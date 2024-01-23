import websockets
import asyncio
import logging
import json


class User:
    def __init__(self, user_id) -> None:
        self.user_id = user_id
        self.websocket = None
    
    async def connectToWebsocket(self):
        uri = f"ws://localhost:3000?type=user&id={self.user_id}"
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
    
    async def sendMessage(self, action, payload):
        try:
            await self.websocket.send(json.dumps({
                "action": action,
                "payload": payload
            }))
        except:
            print("Error sending message")

    async def receiveMessage(self):
        try:
            response = await self.websocket.recv()
            return response
        except:
            print("Error receiving message")
            return None
    
    async def rentVehicle(self, vehicle_id):
        await self.sendMessage("rentVehicle", {
            "vehicleId": vehicle_id
        })
        
        response = await self.receiveMessage()
        return response

    async def startVehicle(self, vehicle_id):
        await self.sendMessage("startVehicle", {
            "vehicleId": vehicle_id
        })
        response = await self.receiveMessage()
        return response
    
    async def stopVehicle(self, vehicle_id):
        await self.sendMessage("stopVehicle", {
            "vehicleId": vehicle_id
        })
        response = await self.receiveMessage()
        return response
    
    async def returnVehicle(self, vehicle_id):
        await self.sendMessage("returnVehicle", {
            "vehicleId": vehicle_id
        })
        response = await self.receiveMessage()
        return response
    
    

    