import random
import asyncio
import signal
import websockets
import multiprocessing
import json

"""
Vehicle class
    - vehicle_id: int
    - battery: int
    - bounds: [int, int, int, int]
    - lat: int
    - lng: int

    THe class represents a vehicle object. It has the following properties:
    - vehicle_id: The ID of the vehicle
    - battery: The battery level of the vehicle
    - bounds: The bounds of the vehicle
    - lat: The latitude of the vehicle
    - lng: The longitude of the vehicle
    - max_speed: The maximum speed of the vehicle
    - is_started: Whether the vehicle is started or not
    - rented_by: The user ID of the user that rented the vehicle
    - current_speed: The current speed of the vehicle
    - websocket: The websocket connection of the vehicle
    - activate(): A method to activate the vehicle
    - run_vehicle_status(): A method to run the vehicle status
    - connect_websocket(): A method to connect to the websocket
    - send_message(): A method to send a message to the websocket
    - receive_message(): A method to receive a message from the websocket
    - print_vehicle_status(): A method to print the vehicle status
    - rent_vehicle(): A method to rent the vehicle
    - return_vehicle(): A method to return the vehicle
    - start_vehicle(): A method to start the vehicle
    - stop_vehicle(): A method to stop the vehicle
    - calculate_speed(): A method to calculate the speed of the vehicle
    - decrease_battery(): A method to decrease the battery of the vehicle
"""
class Vehicle:
    def __init__(self, vehicle_id, battery, bounds, lat, lng):
        self.vehicle_id = vehicle_id
        self.battery = battery
        self.bounds = bounds
        self.lat = lat
        self.lng = lng
        self.max_speed = multiprocessing.Value('i', 60)
        self.is_started = multiprocessing.Value('i', 0)
        self.rented_by = multiprocessing.Value('i', 0)
        self.current_speed = multiprocessing.Value('i', 0)
        self.websocket = None

    # Activate the vehicle
    async def activate(self):
        await self.connect_websocket()
        asyncio.create_task(self.run_vehicle_status())
        asyncio.create_task(self.calculate_speed())
        asyncio.create_task(self.decrease_battery())

    # Run the vehicle status
    async def run_vehicle_status(self):
        while True:
            await self.print_vehicle_status()
            await self.send_message("updateVehicleStatus")
            response = await self.receive_message()
            if response:
                with self.max_speed.get_lock():
                    self.max_speed.value = random.randint(30, 60)
            await asyncio.sleep(5)

    # Connect to the websocket
    async def connect_websocket(self):
        uri = "ws://localhost:3000?type=vehicle"
        connected = False
        retry_count = 0
        max_retries = 5

        while not connected and retry_count < max_retries:
            try:
                self.websocket = await websockets.connect(uri)
                connected = True
                print("Connected to WebSocket")
            except:
                print("Connection closed. Retrying...")
                retry_count += 1
                await asyncio.sleep(5)

    # Send a message to the websocket
    async def send_message(self, action):
        if self.websocket:
            payload = {
                "action": action,
                "vehicleId": self.vehicle_id,
                "lat": self.lat,
                "lng": self.lng,
                "battery": self.battery.value,
                "maxSpeed": self.max_speed.value,
                "isStarted": self.is_started.value,
                "rentedBy": self.rented_by.value,
                "currentSpeed": self.current_speed.value
            }
            await self.websocket.send(json.dumps(payload))
            print(f"Sent: {json.dumps(payload)}")

    # Receive a message from the websocket
    async def receive_message(self):
        if self.websocket:
            response = await self.websocket.recv()
            print(f"Received: {response}")
            return response

    # Print the vehicle status
    async def print_vehicle_status(self):
        print(f"""
            Vehicle Status:
            Vehicle ID: {self.vehicle_id}
            Battery: {self.battery.value}
            Bounds: {self.bounds}
            Location: {self.lat}, {self.lng}
            Max Speed: {self.max_speed.value}
            Is Started: {self.is_started.value}
            Rented By: {self.rented_by.value}
        """)
    
    # Rent the vehicle
    async def rent_vehicle(self, user_id):
        if not self.rented_by.value:
            self.rented_by.value = user_id
            action = "rentVehicle"
            await self.send_message(action)
            print(f"Vehicle {self.vehicle_id} rented by user {user_id}")
            return True
        else:
            print(f"Vehicle {self.vehicle_id} is already rented.")
            return False

    # Return the vehicle
    async def return_vehicle(self, user_id):
        if self.rented_by.value == user_id:
            self.is_started.value = 0
            self.rented_by.value = 0
            self.current_speed.value = 0
            action = "returnVehicle"
            await self.send_message(action)
            print(f"Vehicle {self.vehicle_id} returned by user {user_id}")
            return True
        else:
            print(f"Vehicle {self.vehicle_id} can't be returned. Not rented by user {user_id}.")
            return False

    # Start the vehicle
    async def start_vehicle(self, user_id):
        if self.rented_by.value == user_id and not self.is_started.value:
            self.is_started.value = 1
            action = "start"
            await self.send_message(action)
            print(f"Vehicle {self.vehicle_id} started by user {user_id}")
            return True
        else:
            print(f"Vehicle {self.vehicle_id} can't be started by user {user_id}.")
            return False

    # Stop the vehicle
    async def stop_vehicle(self):
        if self.is_started.value:
            self.is_started.value = 0
            action = "stop"
            await self.send_message(action)
            print(f"Vehicle {self.vehicle_id} stopped")
            return True
        else:
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
    
    path = generate_path(start_point, end_point, 10) # 10 steps between two points

    print("------------->, generated paths: ", path)
    for point in path:
        if vehicle.is_started.value:
            print("Moving to: ", point)
            vehicle.lat = point[0]
            vehicle.lng = point[1]
            await asyncio.sleep(1)
        
    await vehicle.stop_vehicle()


vehicles = []
async def run_vehicles():
    for i in range(1, 2):
        random_start_point = [random.randint(0, 100), random.randint(0, 100)]
        vehicle = Vehicle(i, multiprocessing.Value('i', 100), [0, 0, 0, 0], random_start_point[0], random_start_point[1])
        vehicles.append(vehicle)
        await vehicle.activate()
        await vehicle.rent_vehicle(i * 2)
        await vehicle.start_vehicle(i * 2)

        asyncio.create_task(move_towards_destination(vehicle, [90, 40]))  # Run this in the background


async def main():
    try:
        await run_vehicles()
    except Exception as e:
        # this is not working
        
        print("Exception-------------------->: ", e)
        for vehicle in vehicles:
            await vehicle.stop_vehicle()
        await asyncio.sleep(1)
        for vehicle in vehicles:
            await vehicle.return_vehicle(vehicle.rented_by.value)
        print("Exiting...")
    while True:
        await asyncio.sleep(3600)  # Keep the event loop running indefinitely

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal.SIG_DFL) # Allow Ctrl-C to exit the program
    asyncio.run(main())
