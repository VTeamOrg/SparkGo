import asyncio
import json
import multiprocessing
from time import sleep
import unittest
from unittest import mock
from unittest.mock import patch, MagicMock, AsyncMock
from vehicle import Vehicle

# Mock WebSocket class
class MockWebSocket:
    def __init__(self):
        self.send = AsyncMock()
        self.recv_queue = asyncio.Queue()
        self.close = AsyncMock()
        self.open = True

    def add_response(self, response):
        self.recv_queue.put_nowait(response)

    async def recv(self):
        return await self.recv_queue.get()



class TestVehicle(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        # Set up the Vehicle instance for testing
        self.vehicle = Vehicle(1, multiprocessing.Value('i', 100), [0, 0, 0, 0], 0, 0)
        websocket = MockWebSocket()
        await self.vehicle.activate(websocket, False)  # Ensure the vehicle is activated before testing

    async def test_rent_vehicle(self):
        user_id = 123
        self.assertTrue(await self.vehicle.rent_vehicle(user_id))
        self.vehicle.websocket.add_response(json.dumps({"action": "rentVehicle", "rentedBy": user_id, "message": "Vehicle Rented"}))
        websocket_response = await self.vehicle.websocket.recv()

        # Check if the websocket message is correct
        expected_response = {
            "action": "rentVehicle",
            "rentedBy": user_id,
            "message": "Vehicle Rented"
        }
        self.assertEqual(websocket_response, json.dumps(expected_response))
        
        self.vehicle.update_vehicle_data(expected_response)
        self.assertEqual(self.vehicle.rented_by.value, user_id)

    async def test_return_vehicle(self):
        user_id = 123
        self.vehicle.rented_by.value = user_id
        self.assertTrue(await self.vehicle.return_vehicle(user_id))
        self.vehicle.websocket.add_response(json.dumps({"action": "returnVehicle", "message": "Vehicle Returned"}))
        # Assume the vehicle is already rented by the user for this test
        websocket_response = await self.vehicle.websocket.recv()

        # Check if the websocket message is correct
        expected_response = {
            "action": "returnVehicle",
            "message": "Vehicle Returned"
        }
        self.assertEqual(websocket_response, json.dumps(expected_response))

        self.vehicle.update_vehicle_data(expected_response)
        self.assertEqual(self.vehicle.rented_by.value, -1)


    async def test_start_vehicle(self):
        user_id = 123
        self.vehicle.rented_by.value = user_id
        self.assertTrue(await self.vehicle.start_vehicle(user_id))
        self.vehicle.websocket.add_response(json.dumps({"action": "startVehicle", "message": "Vehicle Started"}))
        # Assume the vehicle is already rented by the user for this test
        websocket_response = await self.vehicle.websocket.recv()

        # Check if the websocket message is correct
        expected_response = {
            "action": "startVehicle",
            "message": "Vehicle Started"
        }
        self.assertEqual(websocket_response, json.dumps(expected_response))

        self.vehicle.update_vehicle_data(expected_response)
        self.assertEqual(self.vehicle.is_started.value, 1)

    async def test_stop_vehicle(self):
        self.vehicle.is_started.value = 1
        self.assertTrue(await self.vehicle.stop_vehicle())
        self.vehicle.websocket.add_response(json.dumps({"action": "stopVehicle", "message": "Vehicle Stopped"}))
        # Assume the vehicle is already rented by the user for this test
        websocket_response = await self.vehicle.websocket.recv()

        # Check if the websocket message is correct
        expected_response = {
            "action": "stopVehicle",
            "message": "Vehicle Stopped"
        }
        self.assertEqual(websocket_response, json.dumps(expected_response))

        self.vehicle.update_vehicle_data(expected_response)
        self.assertEqual(self.vehicle.is_started.value, 0)

    # async def test_calculate_speed(self):
    #     # Mocking the method for testing purposes
    #     self.vehicle.is_started.value = 1  # Set the vehicle as started
    #     asyncio.create_task(self.vehicle.calculate_speed())  # Start calculating speed
    #     await asyncio.sleep(10)  # Allow time for the speed to be calculated
    #     # Add assertions or checks based on the expected behavior of speed calculation

    # async def test_decrease_battery(self):
    #     # Mocking the method for testing purposes
    #     self.vehicle.current_speed.value = 30  # Set some speed for battery decrease
    #     self.vehicle.battery.value = 50  # Set initial battery value
    #     asyncio.create_task(self.vehicle.decrease_battery())  # Start decreasing battery
    #     await asyncio.sleep(35)  # Allow time for the battery to decrease
    #     # Add assertions or checks based on the expected behavior of battery decrease


if __name__ == "__main__":
    unittest.main()