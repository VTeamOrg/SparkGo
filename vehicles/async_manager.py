import asyncio

class AsyncManager:
    def __init__(self, vehicle):
        self.vehicle = vehicle

    async def activate_vehicle(self):
        asyncio.create_task(self.vehicle.run_vehicle_status())
        asyncio.create_task(self.vehicle.process_websocket_messages())
        asyncio.create_task(self.vehicle.calculate_speed())
        asyncio.create_task(self.vehicle.decrease_battery())
        asyncio.create_task(self.vehicle.reconnect_websocket())
