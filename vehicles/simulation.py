import asyncio
import time
import requests
import random
import multiprocessing
from vehicle import Vehicle
import signal
import logging

"""
    The following code is for vehicle class testing purposes
"""

# Function to generate a path between two points with smaller steps
async def move_towards_destination(vehicle, end_point):
    start_point = [vehicle.lat, vehicle.lng]
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
    
    path = generate_path(start_point, end_point, 20) # 20 steps between two points

    print("------------->, generated paths: ", path)
    for point in path:
        if vehicle.is_started.value and vehicle.rented_by.value != -1:
            print("Moving to: ", point)
            vehicle.lat = point[0]
            vehicle.lng = point[1]
            await asyncio.sleep(1)
        
    await vehicle.stop_vehicle()


vehicles = []


def getServerVehicles():
    url = "http://localhost:3000/vehicles"

    success = False

    while not success:
        try:
            response = requests.get(url)
            success = True
        except Exception as e:
            print("Error: ", e)
            print("Retrying in 5 seconds...")
            success = False
            time.sleep(5)
            continue



    return response.json()

def getServerUsers():
    url = "http://localhost:3000/users"
    
    success = False

    while not success:
        try:
            response = requests.get(url)
            success = True
        except Exception as e:
            print("Error: ", e)
            print("Retrying in 5 seconds...")
            success = False
            time.sleep(5)
            continue


    return response.json()


async def create_vehicles():
    server_vehicles = getServerVehicles()
    vehicle_ids = [item['id'] for item in server_vehicles['data']]
    for id in vehicle_ids:
        random_start_point = [random.randint(0, 100), random.randint(0, 100)]
        vehicle = Vehicle(id, multiprocessing.Value('i', 100), [0, 0, 0, 0], random_start_point[0], random_start_point[1])
        vehicles.append({id: id, "vehicle": vehicle})
        await vehicle.activate()

async def run_vehicles():
    server_vehicles = getServerVehicles()
    server_users = getServerUsers()
    user_ids = [item['id'] for item in server_users['data']]
    vehicle_ids = [item['id'] for item in server_vehicles['data']]
    print("Server vehicles: ", vehicle_ids)

    def get_random_user():
        return random.choice(user_ids)
    
    def get_vehicle(user_id):
        vehicle = None
        for item in vehicles:
            if item["vehicle"].rented_by.value == user_id:
                vehicle = item["vehicle"]
                break

        if vehicle is None:
            vehicle = random.choice(vehicles)["vehicle"]

        return vehicle
    
    def get_random_point():
        return [random.randint(0, 1000), random.randint(0, 1000)]
    
    def get_random_action_for_user(user_id, vehicle):
        print("-------------------->", vehicle.rented_by.value, user_id)
        if vehicle.rented_by.value == user_id:
            if vehicle.is_started.value:
                choices = ["stop", "drive"]
                probabilities = [0.5, 0.5]
                return random.choices(choices, probabilities)[0]
            
            else:
                choices = ["start", "return"]
                probabilities = [0.6, 0.4]
                return random.choices(choices, probabilities)[0]
        else:
            return random.choice(["rent"])
    
    while True:
        user_id = 1 #get_random_user()
        vehicle = get_vehicle(user_id)
        
        action = get_random_action_for_user(user_id, vehicle)

        print("User: ", user_id, "Vehicle: ", vehicle.vehicle_id, "Action: ", action)

        if action == "rent":
            await vehicle.rent_vehicle(user_id)
        elif action == "return":
            await vehicle.return_vehicle(user_id)
        elif action == "start":
            await vehicle.start_vehicle(user_id)
        elif action == "drive":
            await move_towards_destination(vehicle, get_random_point())
        elif action == "stop":
            await vehicle.stop_vehicle()
        await asyncio.sleep(5)

async def main():
    try:
        await create_vehicles()
        await run_vehicles()
    except Exception as e:
        logging.error("Exception: ", e)
    finally:
        # Proper cleanup routines here for any open resources
        for vehicle in vehicles:
            await vehicle.stop_vehicle()
            await vehicle.return_vehicle(vehicle.rented_by.value)
        logging.info("Exiting...")

    while True:
        await asyncio.sleep(3600)  # Keep the event loop running indefinitely

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal.SIG_DFL) # Allow Ctrl-C to exit the program
    asyncio.run(main())
