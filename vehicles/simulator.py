import asyncio
import json
import logging
import multiprocessing
import random
import signal
import time
import requests
from shapely.geometry import shape, Point
from folium import Map, Marker, Popup
from folium.plugins import MarkerCluster
import websockets
import random

api_url = "http://localhost:3000/v1"

def get_server_vehicles():
    url = f"{api_url}/vehicles"
    return make_request(url)

def get_server_users():
    url = f"{api_url}/users"
    return make_request(url)

def make_request(url):
    success = False

    while not success:
        try:
            response = requests.get(url)
            response.raise_for_status()
            success = True
        except requests.RequestException as e:
            print(f"Error: {e}")
            print("Retrying in 5 seconds...")
            asyncio.sleep(5)

    return response.json()

def get_geojson_polygon():
    url = f"{api_url}/coords/cities"
    response = requests.get(url)
    return {
        "type": "Polygon",
        "coordinates": response.json()["data"]
    }

# Convert GeoJSON to a Shapely geometry
polygon = shape(get_geojson_polygon())

# Generate a random point within the polygon
min_x, min_y, max_x, max_y = polygon.bounds

def generate_random_point_within_polygon():
    while True:
        point = Point(random.uniform(min_x, max_x), random.uniform(min_y, max_y))
        if polygon.contains(point):
            return [point.y, point.x]

async def move_towards_destination(vehicle, end_point):
    print("Moving towards destination:", end_point, "from:", [vehicle.lat, vehicle.lon])

    start_point = [vehicle.lat, vehicle.lon]

    def generate_path(start_point, end_point, num_steps):
        path = []
        for i in range(num_steps + 1):
            fraction = i / num_steps
            intermediate_point = [
                start_point[0] + (end_point[0] - start_point[0]) * fraction,
                start_point[1] + (end_point[1] - start_point[1]) * fraction,
            ]
            path.append(intermediate_point)
        return path

    path = generate_path(start_point, end_point, 50)  # 50 steps between two points

    print("Generated paths:", path)
    for point in path:
        if vehicle.is_started.value and vehicle.rented_by.value != -1:
            print("Moving to:", point)
            vehicle.lat = point[0]
            vehicle.lon = point[1]
            await asyncio.sleep(1)

    await vehicle.stop_vehicle()


def get_random_action_for_user(user, vehicle):
    print("--------------------------->", user.vehicle_rented.value)
    if user.vehicle_rented.value == 0:
        return "rent"
    if vehicle.rented_by.value == user.user_id:
        if vehicle.is_started.value:
            choices = ["stop", "drive"]
            probabilities = [0.5, 0.5]
            return random.choices(choices, probabilities)[0]
        else:
            choices = ["start", "return"]
            probabilities = [0.5, 0.5]
            return random.choices(choices, probabilities)[0]
    else:
        return "do_nothing"



class User:
    def __init__(self, user_id):
        self.user_id = user_id
        self.websocket = None
        self.vehicle_rented = multiprocessing.Value('i', 0)
        self.async_manager = UserAsyncManager(self)
        self.receive_event = asyncio.Event()
        self.recv_lock = asyncio.Lock()

    async def activate(self):
        await self.connect_to_websocket()
        asyncio.create_task(self.async_manager.activate_user())
        

    async def connect_to_websocket(self):
        uri = f"ws://localhost:3000?type=user&id={self.user_id}"
        connected = False
        retry_count = 0
    

        while not connected and retry_count < 3:
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

    async def reconnect_websocket(self):
        while True:
            if self.websocket is None or not self.websocket.open:
                logging.info("WebSocket connection lost. Attempting reconnection...")
                await self.connect_to_websocket()
            self.receive_event.set()
            await asyncio.sleep(5)

    async def send_message(self, action, payload):
        try:
            await self.websocket.send(json.dumps({"action": action, "payload": payload}))
        except websockets.WebSocketException as e:
            logging.error(f"WebSocket error while sending message: {e}")
        except Exception as e:
            logging.error(f"Unexpected error in sending message: {e}")
    
    async def receive_message(self):
        async with self.recv_lock:
            try:
                response = json.loads(await self.websocket.recv())
                return response
            except websockets.WebSocketException as e:
                logging.error(f"WebSocket error while receiving message: {e}")
                self.websocket = None
            except Exception as e:
                logging.error(f"Unexpected error in receiving message: {e}")
                raise  # Rethrow the exception

        await asyncio.sleep(1)  # Avoid blocking the event loop entirely



    async def rent_vehicle(self, vehicle_id):
        try:
            await self.send_message("rentVehicle", {"vehicleId": vehicle_id})
            print(f"User {self.user_id} sent rent request")
            result = await self.receive_message()
            print("Result: ", result)
            if result["action"] == "rentVehicle" and result["status"] == "error" and result["data"]["userId"] == self.user_id:
                self.vehicle_rented.value = vehicle_id
                print(f"User {self.user_id} rented vehicle {self.vehicle_rented.value}")
                return
            if result["action"] == "success" and result["message"] == "rentVehicleAccepted":
                print(f"User {self.user_id} rented vehicle {vehicle_id}")
                self.vehicle_rented.value = vehicle_id
            else:
                print(f"User {self.user_id} failed to rent vehicle", result)

            return
        except Exception as e:
            pass
    

    async def start_vehicle(self, vehicle_id):
        try:
            await self.send_message("startVehicle", {"vehicleId": vehicle_id})
            print(f"User {self.user_id} sent startVehicle request")
            result = await self.receive_message()
            if result["action"] == "success" and result["message"] == "startVehicleAccepted":
                self.vehicle_rented.value = vehicle_id
            else:
                print(f"User {self.user_id} failed to start vehicle")
            
            return result
        except Exception as e:
            pass

    async def stop_vehicle(self, vehicle_id):
        try:
            await self.send_message("stopVehicle", {"vehicleId": vehicle_id})
            print(f"User {self.user_id} sent stopVehicle request")
            result = await self.receive_message()
            if result["action"] == "success" and result["message"] == "stopVehicleAccepted":
                self.vehicle_rented.value = 0
            else:
                print(f"User {self.user_id} failed to stop vehicle")
            
            return result
        except Exception as e:
            pass

    async def return_vehicle(self, vehicle_id):
        try:
            await self.send_message("returnVehicle", {"vehicleId": vehicle_id})
            print(f"User {self.user_id} sent returnVehicle request")
            result = await self.receive_message()
            if result["action"] == "success" and result["message"] == "returnVehicleAccepted":
                self.vehicle_rented.value = 0
            else:
                print(f"User {self.user_id} failed to return vehicle", result)
            
            return result
        except Exception as e:
            pass


class Vehicle:
    def __init__(self, vehicle_id, battery, lat, lon):
        self.vehicle_id = vehicle_id
        self.battery = battery
        self.lat = lat
        self.lon = lon
        self.websocket = None
        self.is_started = multiprocessing.Value('i', 0)
        self.current_speed = multiprocessing.Value('i', 0)
        self.rented_by = multiprocessing.Value('i', -1)
        self.async_manager = VehicleAsyncManager(self)

    async def activate(self):
        await self.connect_websocket()
        asyncio.create_task(self.async_manager.activate_vehicle())

    async def run_vehicle_status(self):
        while True:
            await self.send_message("vehicleStatus")
            await asyncio.sleep(5)

    async def connect_websocket(self):
        uri = f"ws://localhost:3000?type=vehicle&id={self.vehicle_id}"
        connected = False
        retry_count = 0

        while not connected and retry_count < 3:
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

    async def send_message(self, action, payload=None):
        try:
            data = {
                "action": action,
                "vehicleId": self.vehicle_id,
                "lat": self.lat,
                "lon": self.lon,
                "battery": self.battery,
                "payload": payload
            }
            await self.websocket.send(json.dumps(data))
            logging.info(f"Sent: {json.dumps(payload)}")
        except websockets.WebSocketException as e:
            logging.error(f"WebSocket error while sending message: {e}")
            self.websocket = None
        except Exception as e:
            logging.error(f"Unexpected error in sending message: {e}")

    async def receive_message(self):
        while True:
            try:
                # response in json format
                response = json.loads(await self.websocket.recv())

                print("Received---------------------->: ", response)
                
                if response["action"] == "vehicleRented":
                    self.rented_by.value = response["message"]["userId"]
                elif response["action"] == "vehicleReturned":
                    self.rented_by.value = -1
                elif response["action"] == "vehicleStarted":
                    self.is_started.value = 1
                elif response["action"] == "vehicleStopped":
                    self.is_started.value = 0
                elif response["action"] == "changePosition":
                    self.lat = response["message"]["lat"]
                    self.lon = response["message"]["lon"]
                elif response["action"] == "changeBattery":
                    self.battery = response["message"]["battery"]
                else:
                    logging.info(f"Received: {response}")

            except websockets.WebSocketException as e:
                logging.error(f"WebSocket error while receiving message: {e}")
                self.websocket = None
                break
            except Exception as e:
                logging.error(f"Unexpected error in receiving message: {e}")
                break

            await asyncio.sleep(5)

    async def calculate_speed(self):
        while True:
            if self.is_started.value:
                with self.current_speed.get_lock():
                    self.current_speed.value = random.randint(0, 60)
            else:
                with self.current_speed.get_lock():
                    self.current_speed.value = 0
            await asyncio.sleep(5)

    async def decrease_battery(self):
        while True:
            if self.current_speed.value > 0 and self.battery.value > 0:
                with self.battery.get_lock():
                    self.battery.value -= 1
                    print("Decreasing battery:", self.battery.value)
            await asyncio.sleep(30)

    async def reconnect_websocket(self):
        while True:
            if self.websocket is None or not self.websocket.open:
                logging.info("WebSocket connection lost. Attempting reconnection...")
                await self.connect_websocket()
            await asyncio.sleep(5)


class VehicleAsyncManager:
    def __init__(self, vehicle):
        self.vehicle = vehicle
        self.tasks = []

    async def activate_vehicle(self):
        tasks = [
            self.vehicle.run_vehicle_status(),
            self.vehicle.receive_message(),
            self.vehicle.calculate_speed(),
            self.vehicle.decrease_battery(),
            self.vehicle.reconnect_websocket()
        ]

        self.tasks.extend(tasks)

        try:
            await asyncio.gather(*tasks)
        except asyncio.CancelledError:
            for task in tasks:
                task.cancel()
            await asyncio.gather(*tasks, return_exceptions=True)  # Wait for tasks to be cancelled

class UserAsyncManager:
    def __init__(self, user):
        self.user = user
        self.tasks = []

    async def activate_user(self):
        tasks = [
            # self.user.receive_message(),
            self.user.reconnect_websocket()
        ]

        self.tasks.extend(tasks)

        try:
            await asyncio.gather(*tasks)
        except asyncio.CancelledError:
            for task in tasks:
                task.cancel()
            await asyncio.gather(*tasks, return_exceptions=True)  # Wait for tasks to be cancelled

async def main():
    vehicles = []
    users = []

    server_vehicles = get_server_vehicles()
    server_users = get_server_users()

    for data in server_vehicles["data"]:
        random_start_point = generate_random_point_within_polygon()
        vehicle = Vehicle(data["id"], 100, random_start_point[0], random_start_point[1])
        vehicles.append(vehicle)
        await vehicle.activate()
    
    # wait for all vehicles to be activated
    # await asyncio.sleep(5)

    for data in server_users["data"]:
        user = User(data["id"])
        await user.activate()
        users.append(user)
        asyncio.create_task(user.connect_to_websocket())
    
    # wait for all users to be activated
    # await asyncio.sleep(5)

    async def user_actions():
        while True:
            random_user = random.choice(users)
            random_vehicle = random.choice(vehicles)
            action = get_random_action_for_user(random_user, random_vehicle)
            # print("User: ", random_user.user_id, "Vehicle: ", random_vehicle.vehicle_id, "Action: ", action)

            if action == "rent":
                asyncio.create_task(random_user.rent_vehicle(random_vehicle.vehicle_id))
            elif action == "return":
                asyncio.create_task(random_user.return_vehicle(random_vehicle.vehicle_id))
            elif action == "start":
                asyncio.create_task(random_user.start_vehicle(random_vehicle.vehicle_id))
            elif action == "drive":
                asyncio.create_task(move_towards_destination(random_vehicle, generate_random_point_within_polygon()))
            elif action == "stop":
                asyncio.create_task(random_user.stop_vehicle(random_vehicle.vehicle_id))

            await asyncio.sleep(10)

    async def vehicle_status(vehicle):
        while True:
            await vehicle.run_vehicle_status()
            await asyncio.sleep(5)

    vehicle_status_tasks = [vehicle_status(vehicle) for vehicle in vehicles]
    await asyncio.gather(user_actions(), *vehicle_status_tasks)


if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal.SIG_DFL)  # Allow Ctrl-C to exit the program
    asyncio.run(main())