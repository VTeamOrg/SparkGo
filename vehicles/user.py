import asyncio
import signal
import websockets
import requests
import json
import random
from shapely.geometry import Polygon, Point

API_URL = "http://localhost:3000/v1"
WS_URL = "ws://localhost:3000"

user_data = {}

def update_user_data(response, user_id):
    if response["action"] == "success" and response["message"] == "rentVehicleAccepted":
        print(response)
        # user_id = response["data"]["user_id"]
        vehicle_id = response["data"]["vehicleId"]

        user_data[user_id]["vehicle_id"] = vehicle_id
        user_data[user_id]["action"] = "rentVehicle"

        print(f"User {user_id} has rented vehicle {vehicle_id}")
    
    elif response["action"] == "success" and response["message"] == "returnVehicleAccepted":
        # user_id = response["user_id"]
        vehicle_id = response["data"]["vehicleId"]

        user_data[user_id]["vehicle_id"] = None
        user_data[user_id]["action"] = None

        print(f"User {user_id} has returned vehicle {vehicle_id}")
    
    elif response["action"] == "success" and response["message"] == "stopVehicleAccepted":
        # user_id = response["user_id"]
        vehicle_id = response["data"]["vehicleId"]

        user_data[user_id]["vehicle_id"] = vehicle_id
        user_data[user_id]["action"] = "stopVehicle"

        print(f"User {user_id} has stopped vehicle {vehicle_id}")
    
    elif response["action"] == "success" and response["message"] == "startVehicleAccepted":
        # user_id = response["user_id"]
        vehicle_id = response["data"]["vehicleId"]

        user_data[user_id]["vehicle_id"] = vehicle_id
        user_data[user_id]["action"] = "startVehicle"

        print(f"User {user_id} has started vehicle {vehicle_id}")
    
    elif response["action"] == "rentVehicle" and response["message"] == "User is already renting a vehicle":
        # user_id = response["user_id"]
        vehicle_id = response["data"]["vehicleId"]

        user_data[user_id]["vehicle_id"] = vehicle_id
        user_data[user_id]["action"] = "rentVehicle"

        print(f"User {user_id} has rented vehicle {vehicle_id}")

    elif response["message"] == "User is not renting a vehicle":
        user_id = response["data"]["userId"]

        user_data[user_id]["vehicle_id"] = None
        user_data[user_id]["action"] = None

        print("User {user_id} is not renting a vehicle")

async def connect_to_websocket(user_id):
    uri = WS_URL + "?type=user&id=" + str(user_id)
    try:
        ws = await websockets.connect(uri, ping_timeout=60)
        print(f"User {user_id} connected")

        if user_id not in user_data.keys():
            user_data[user_id] = {
                "websocket": ws,
                "websocket_lock": asyncio.Lock(),
                "action": None,
                "activated": False,
                "vehicle_id": None
            }
        else:
            user_data[user_id]["websocket"] = ws
    except Exception as e:
        print(e)

def get_expected_res(action):
    if action == "rentVehicle":
        return ["rentVehicleAccepted", "User is already renting a vehicle"]
    elif action == "stopVehicle":
        return ["stopVehicleAccepted"]
    elif action == "startVehicle":
        return ["startVehicleAccepted"]
    elif action == "returnVehicle":
        return ["returnVehicleAccepted"]
    elif action == "driveVehicle":
        return ["driveVehicleAccepted"]
    else:
        return []



async def send_and_receive(user_id, message):

    websocket = user_data[user_id]["websocket"]

    if not websocket.open:
        await connect_to_websocket(user_id)
        websocket = user_data[user_id]["websocket"]


    while True:
        await websocket.send(json.dumps(message))
        result = await websocket.recv()
        response = json.loads(result)

        if response["message"] not in (get_expected_res(message["action"])):
            if response["message"] in ["User is not renting a vehicle", "Vehicle not rented by this user"]:
                user_data[user_id]["vehicle_id"] = None
                user_data[user_id]["action"] = None
                break

            else:
                continue
        print(f"User {user_id} received {response}")

        update_user_data(response, user_id)
        break


async def send_message(user_id):
    if user_data[user_id]["activated"] is False:
        user_data[user_id]["activated"] = True
    else:
        websocket = user_data[user_id]["websocket"]
        await websocket.close()
        return


    while True:
        interval = random.randint(100, 200)
        vehicles = get_server_vehicles()
        curr_action = user_data[user_id]["action"]

        if curr_action == "rentVehicle":
            choices = ["startVehicle", "returnVehicle", "doNothing", "doNothing", "doNothing"]

        elif curr_action == "stopVehicle":
            choices = ["startVehicle", "returnVehicle", "doNothing", "doNothing", "doNothing"]

        elif curr_action == "startVehicle":
            choices = ["stopVehicle", "returnVehicle", "driveVehicle", "doNothing", "doNothing", "doNothing"]

        else:
            choices = ["rentVehicle", "doNothing", "doNothing", "doNothing"]
        
        action = random.choice(choices)

        payload = {}

        payload["vehicleId"] = action == "rentVehicle" and random.choice(vehicles)["id"] or user_data[user_id]["vehicle_id"]

        if action == "doNothing":
            await asyncio.sleep(interval)
            continue
        
        if action == "driveVehicle":
            interval = random.randint(200, 500)
            payload["destination"] = generate_point_inside_coordinates()

        message = {
            "action": action,
            "payload": payload
        }

        print(f"User {user_id} is sending {message}")

        # await send_and_receive(message)
        await send_and_receive(user_id, message)
        await asyncio.sleep(interval)


def get_server_users():
    uri = API_URL + "/users"
    response = requests.get(uri)
    users = response.json()["data"]
    # delete the first user
    users = [user for user in users if user.get('id') != 1]

    return users

def get_server_user(user_id):
    uri = API_URL + "/users/" + user_id
    response = requests.get(uri)
    return response.json()["data"][0]

def get_server_vehicles():
    # Make an HTTP request to get all vehicles
    uri = API_URL + "/vehicles/active?forClient"
    response = requests.get(uri)
    return response.json()["data"]

def get_server_vehicle(vehicle_id):
    uri = API_URL + "/vehicles/" + str(vehicle_id)
    response = requests.get(uri)
    return response.json()["data"][0]

def get_city_polygon():
    # Make an HTTP request to get the city polygon
    response = requests.get("http://localhost:3000/v1/coords/cities")
    return response.json()["data"][0]

def generate_point_inside_coordinates():
    polygon = Polygon(coords)

    min_x, min_y, max_x, max_y = polygon.bounds
    while True:
        random_point = Point(random.uniform(min_x, max_x), random.uniform(min_y, max_y))
        if polygon.contains(random_point):
            return {"lat": random_point.y, "lon": random_point.x}

coords = get_city_polygon()

async def main():
    users = get_server_users()
    tasks = []

    for user in users:
        user_id = user["id"]

        await connect_to_websocket(user_id)

        task1 = asyncio.create_task(send_message(user_id))
        tasks.append(task1)

    await asyncio.gather(*tasks)
    

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal.SIG_DFL)
    asyncio.run(main())
