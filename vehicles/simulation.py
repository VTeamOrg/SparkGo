import asyncio
import time
import requests
import random
import multiprocessing
from vehicle import Vehicle
import signal
import logging
from shapely.geometry import shape, Point

"""
    The following code is for vehicle class testing purposes
"""

api_url = "http://localhost:3000/v1"

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


# Function to generate a path between two points with smaller steps
async def move_towards_destination(vehicle, end_point):
    print("------------->, moving towards destination: ", end_point , " from: ", [vehicle.lat, vehicle.lon])
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
    
    path = generate_path(start_point, end_point, 50) # 20 steps between to points

    print("------------->, generated paths: ", path)
    for point in path:
        if vehicle.is_started.value and vehicle.rented_by.value != -1:
            print("Moving to: ", point)
            vehicle.lat = point[0]
            vehicle.lon = point[1]
            await asyncio.sleep(1)
        
    await vehicle.stop_vehicle()


vehicles = []


def getServerVehicles():
    url = f"{api_url}/vehicles"

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
    url = f"{api_url}/users"
    
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
    for data in server_vehicles["data"]:
        random_start_point = generate_random_point_within_polygon()
        vehicle = Vehicle(data["id"], multiprocessing.Value('i', 100), [0, 0, 0, 0], random_start_point[0], random_start_point[1])
        vehicles.append(vehicle)
        await vehicle.activate()

async def run_vehicles():
    server_users = getServerUsers()
    user_ids = [item['id'] for item in server_users["data"]]
    # vehicle_ids = [item.vehicle_id for item in vehicles]

    def get_random_user():
        return random.choice(user_ids)
    
    def get_vehicle(user_id):
        vehicle = None
        for item in vehicles:
            if item.rented_by.value == user_id:
                vehicle = item
                break

        if vehicle is None:
            vehicle = random.choice(vehicles)

        return vehicle
    
    def get_random_action_for_user(user_id, vehicle):
        print("-------------------->", vehicle.rented_by.value, user_id)
        if vehicle.rented_by.value == user_id:
            if vehicle.is_started.value:
                choices = ["stop", "drive"]
                probabilities = [0.5, 0.5]
                return random.choices(choices, probabilities)[0]
            
            else:
                choices = ["start", "return"]
                probabilities = [0.5, 0.5]
                return random.choices(choices, probabilities)[0]
        else:
            return random.choice(["rent"])
    
    while True:
        user_id = get_random_user()
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
            # await move_towards_destination(vehicle, generate_random_point_within_polygon())
            asyncio.create_task(move_towards_destination(vehicle, generate_random_point_within_polygon()))
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


def simulate_on_leaflet_map():
    import folium
    import time
    from folium.plugins import MarkerCluster

    m = folium.Map(location=[56.1612, 15.5869], zoom_start=15)
    marker_cluster = MarkerCluster().add_to(m)

    # for vehicle in vehicles:
    #     folium.Marker(location=[vehicle.lat, vehicle.lon], popup=f"Vehicle {vehicle.vehicle_id}").add_to(marker_cluster)

    # m.save('index.html')

    while True:
        # clear the markers from the map first
        marker_cluster = MarkerCluster().add_to(m)
        # add the markers again
        for vehicle in vehicles:
            folium.Marker(location=[vehicle.lat, vehicle.lon], popup=f"Vehicle {vehicle.vehicle_id}").add_to(marker_cluster)
        m.save('index.html')
        print("Updated map ------------------------------------------------------------------------------------->")
        time.sleep(2)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal.SIG_DFL) # Allow Ctrl-C to exit the program
    # map_thread = threading.Thread(target=simulate_on_leaflet_map, args=())
    # map_thread.start()
    asyncio.run(main())