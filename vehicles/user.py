import asyncio
from ctypes import pointer
import json
import logging
import multiprocessing
import random
import signal
from numpy import shape
import requests
import websockets

api_url = "http://localhost:3000/v1"

vehicles = []
users = []

def get_server_vehicles():
    url = f"{api_url}/vehicles/active?forClient"
    return make_request(url)

def get_rented_vehicle(vehicle_id):
    url = f"{api_url}/vehicles/{vehicle_id}"
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
            exit (1)

    return response.json()


def get_random_action_for_user(user, vehicle):
    print("Vehicle: ", vehicle, "User: ", user.user_id)
    if user.vehicle_rented.value == 0:
        return "rent"
    if vehicle["rentedBy"] == user.user_id:
        if vehicle["isStarted"]:
            choices = ["stop", "drive"]
            probabilities = [0.5, 0.5]
            return random.choices(choices, probabilities)[0]
        else:
            choices = ["start", "return"]
            probabilities = [0.5, 0.5]
            return random.choices(choices, probabilities)[0]
    else:
        return "rent"


class User:
    def __init__(self, user_id, vehicle_to_rent=0):
        self.user_id = user_id
        self.websocket = None
        self.vehicle_to_rent = multiprocessing.Value('i', vehicle_to_rent)
        self.vehicle_rented = multiprocessing.Value('i', 0)

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
            await asyncio.sleep(5)

    async def send_message(self, action, payload):
        try:
            await self.websocket.send(json.dumps({"action": action, "payload": payload}))
            print(f"User {self.user_id} sent message: {action}")
        except websockets.WebSocketException as e:
            logging.error(f"WebSocket error while sending message: {e}")
        except Exception as e:
            logging.error(f"Unexpected error in sending message: {e}")

    async def receive_message(self):
        try:
            response = json.loads(await self.websocket.recv())
            print("Result: ", response)
            return response
        except websockets.WebSocketException as e:
            logging.error(f"WebSocket error while receiving message: {e}")
            self.websocket = None
        except Exception as e:
            logging.error(f"Unexpected error in receiving message: {e}")
            raise  # Rethrow the exception
    
    async def user_actions(self):
        while True:
            
            server_vehicles = get_server_vehicles()["data"]
            random_vehicle = random.choice(server_vehicles)
            self.vehicle_to_rent.value = random_vehicle["id"]

            waiting_time = 5

            if self.vehicle_rented.value == 0:
                await self.send_message("rentVehicle", {"vehicleId": self.vehicle_to_rent.value})
                self.vehicle_rented.value = self.vehicle_to_rent.value
                print(f"User {self.user_id} rented vehicle {self.vehicle_rented.value}")
            else:
                rented_vehicle = get_rented_vehicle(self.vehicle_rented.value)["data"][0]
                action = get_random_action_for_user(self, rented_vehicle)
                if action == "rent":
                    await self.send_message("rentVehicle", {"vehicleId": self.vehicle_to_rent.value})
                    self.vehicle_rented.value = self.vehicle_to_rent.value
                    print(f"User {self.user_id} rented vehicle {self.vehicle_to_rent.value}")
                elif action == "start":
                    await self.send_message("startVehicle", {"vehicleId": self.vehicle_rented.value})
                    print(f"User {self.user_id} started vehicle {self.vehicle_rented.value}")
                elif action == "stop":
                    await self.send_message("stopVehicle", {"vehicleId": self.vehicle_rented.value})
                    print(f"User {self.user_id} stopped vehicle {self.vehicle_rented.value}")
                elif action == "drive":
                    await self.send_message("driveVehicle", {"vehicleId": self.vehicle_rented.value})
                    waiting_time = 30
                    print(f"User {self.user_id} drove vehicle {self.vehicle_rented.value}")
                elif action == "return":
                    await self.send_message("returnVehicle", {"vehicleId": self.vehicle_rented.value})
                    self.vehicle_rented.value = 0
                    print(f"User {self.user_id} returned vehicle {self.vehicle_rented.value}")
                    


        
            await asyncio.sleep(waiting_time)

                

        


async def main():
    users = []
    server_vehicles = get_server_vehicles()["data"]
    random_vehicle = random.choice(server_vehicles)

    server_users = get_server_users()

    for data in server_users["data"]:
        user = User(data["id"], random_vehicle["id"])
        await user.connect_to_websocket()
        await user.user_actions()
        users.append(user)
    while True:
        await asyncio.sleep(3600) 


if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal.SIG_DFL)  # Allow Ctrl-C to exit the program
    asyncio.run(main())
