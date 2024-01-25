import asyncio

class AsyncManager:
    def __init__(self, vehicle):
        self.vehicle = vehicle
        self.tasks = []

    async def activate_vehicle(self):
        tasks = [
            self.vehicle.run_vehicle_status(),
            self.vehicle.process_websocket_messages(), 
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
            await asyncio.gather(*tasks, return_exceptions=True)

    async def cleanup(self):
        for task in self.tasks:
            task.cancel()

        await asyncio.gather(*self.tasks, return_exceptions=True)
