import random
import asyncio
import websockets
import multiprocessing
import json
import logging
from async_manager import AsyncManager  # Import the AsyncManager class



class Vehicle:
    def __init__(self, vehicle_id, battery, bounds, lat, lon):
        self.vehicle_id = vehicle_id
        self.battery = battery
        self.bounds = bounds
        self.lat = lat
        self.lon = lon
        self.max_speed = multiprocessing.Value('i', 60)
        self.is_started = multiprocessing.Value('i', 0)
        self.rented_by = multiprocessing.Value('i', -1)
        self.current_speed = multiprocessing.Value('i', 0)
        self.websocket = None

        self.async_manager = AsyncManager(self)  # Create an instance of AsyncManager

    # Activate the vehicle
    async def activate(self, websocket = None, run_tasks = True):
        if websocket is not None:
            self.websocket = websocket
        else:
            await self.connect_websocket()

        if run_tasks:
            # await self.async_manager.activate_vehicle()  # Activate tasks through AsyncManager
            asyncio.create_task(self.async_manager.activate_vehicle())

    # Run the vehicle status
    async def run_vehicle_status(self):
        while True:
            await self.send_message("vehicleStatus")
            await asyncio.sleep(5)


    async def reconnect_websocket(self):
        while True:
            if self.websocket is None or not self.websocket.open:
                logging.info("WebSocket connection lost. Attempting reconnection...")
                await self.connect_websocket()
            await asyncio.sleep(5)  # Adjust the interval for reconnection attempts

    # Connect to the websocket
    async def connect_websocket(self):
        uri = f"ws://localhost:3000?type=vehicle&id={self.vehicle_id}"
        connected = False

        while not connected:
            try:
                self.websocket = await websockets.connect(uri)
                connected = True
                logging.info("Connected to WebSocket")
            except websockets.WebSocketException as e:
                logging.error(f"WebSocket connection failed: {e}. Retrying...")
                retry_count += 1
                await asyncio.sleep(5)
            except Exception as e:
                logging.error(f"Unexpected error in WebSocket connection: {e}")
                break

    # Send a message to the websocket
    async def send_message(self, action, payload = None):
        try:
            data = {
                "action": action,
                "vehicleId": self.vehicle_id,
                "lat": self.lat,
                "lon": self.lon,
                "battery": self.battery.value,
                "maxSpeed": self.max_speed.value,
                "isStarted": self.is_started.value,
                "rentedBy": self.rented_by.value,
                "currentSpeed": self.current_speed.value,
                "payload": payload
            }
            await self.websocket.send(json.dumps(data))
            logging.info(f"Sent: {json.dumps(payload)}")
        except websockets.WebSocketException as e:
            logging.error(f"WebSocket error while sending message: {e}")
            self.websocket = None  # Clean up the websocket connection
        except Exception as e:
            logging.error(f"Unexpected error in sending message: {e}")

    # Receive a message from the websocket
    async def receive_message(self):
        try:
            if self.websocket:
                response = await self.websocket.recv()
                logging.info(f"Received: {response}")
                return response
        except websockets.WebSocketException as e:
            logging.error(f"WebSocket error while receiving message: {e}")
            self.websocket = None  # Clean up the websocket connection
            await self.connect_websocket()
        except Exception as e:
            logging.error(f"Unexpected error in receiving message: {e}")
    
    def update_vehicle_data(self, response):
        # response = json.loads(response)
        action = response.get("action")
        if action:
            actions_mapping = {
                "startVehicle": self._handle_start_vehicle,
                "stopVehicle": self._handle_stop_vehicle,
                "returnVehicle": self._handle_return_vehicle,
                "rentVehicle": self._handle_rent_vehicle,
                "maxSpeed": self._handle_max_speed,
                "warning": self._handle_warning,
                "error": self._handle_error
            }

            handler = actions_mapping.get(action)
            if handler:
                handler(response)
            else:
                print(f"Action '{action}' not recognized.")
        else:
            print("No action specified in the response.")
    
    def _handle_start_vehicle(self, response):
        self.is_started.value = 1
        print(f"Vehicle {self.vehicle_id} started by user {self.rented_by.value}.\n {response['message']}")

    def _handle_stop_vehicle(self, response):
        self.is_started.value = 0
        self.current_speed.value = 0
        print(f"Vehicle {self.vehicle_id} stopped by user {self.rented_by.value}.\n {response['message']}")

    def _handle_return_vehicle(self, response):
        print(f"Vehicle {self.vehicle_id} returned by user {self.rented_by.value}.\n {response['message']}")
        self.rented_by.value = -1

    def _handle_rent_vehicle(self, response):
        self.rented_by.value = response.get("rentedBy")
        print(f"Vehicle {self.vehicle_id} rented by user {self.rented_by.value}.\n {response['message']}")

    def _handle_max_speed(self, response):
        self.max_speed.value = response.get("maxSpeed")
        print(f"Vehicle {self.vehicle_id} max speed updated.\n {response['message']}")

    def _handle_warning(self, response):
        print(f"Vehicle {self.vehicle_id} warning.\n {response['message']}")

    def _handle_error(self, response):
        print(f"Vehicle {self.vehicle_id} error.\n {response['message']}")


    # a method to always listen to the websocket server responses and update the vehicle status
    async def process_websocket_messages(self):
        while True:
            response = await self.receive_message()
            if response:
                response = json.loads(response)
                print("Response---------------------->: ", response)
                if not response["action"]:
                    continue
                
                self.update_vehicle_data(response)


            await asyncio.sleep(5)

    # Rent the vehicle
    async def rent_vehicle(self, user_id):
        if self.rented_by.value == -1:
            action = "rentVehicle"
            payload = {
                "userId": user_id
            }
            await self.send_message(action, payload)
            return True

        print(f"Vehicle {self.vehicle_id} is already rented.")
        return False

    # Return the vehicle
    async def return_vehicle(self, user_id):
        if self.rented_by.value == user_id:
            action = "returnVehicle"
            await self.send_message(action)
            return True

        print(f"Vehicle {self.vehicle_id} can't be returned. Not rented by user {user_id}.")
        return False

    # Start the vehicle
    async def start_vehicle(self, user_id):
        if self.rented_by.value == user_id and not self.is_started.value:
            action = "startVehicle"
            await self.send_message(action)
            return True

        print(f"Vehicle {self.vehicle_id} can't be started by user {user_id}.")
        return False

    # Stop the vehicle
    async def stop_vehicle(self):
        if self.is_started.value:
            action = "stopVehicle"
            await self.send_message(action)
            return True

        return False

    # Calculate the speed of the vehicle
    async def calculate_speed(self):
        while True:
            if self.is_started.value:
                with self.current_speed.get_lock():
                    self.current_speed.value = random.randint(0, 60)
            else:
                with self.current_speed.get_lock():
                    self.current_speed.value = 0
            await asyncio.sleep(5)

    # Decrease the battery of the vehicle
    async def decrease_battery(self):
        while True:
            if self.current_speed.value > 0 and self.battery.value > 0:
                with self.battery.get_lock():
                    self.battery.value -= 1
                    print("Decreasing battery: ", self.battery.value)
            await asyncio.sleep(30)
