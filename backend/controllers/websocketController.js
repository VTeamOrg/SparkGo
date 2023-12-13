const WebSocket = require("ws");

// handleConnection is called when a new WebSocket connection is established
const handleConnection = (ws, req, connectedClients, connectionId, deviceType) => {
    // Add the client to the list of connected clients
    if (deviceType === 'vehicle') {
        // if deviceType is vehicle, add the client to the list of connected vehicles
        connectedClients.vehicles?.push({id: connectionId, ws});
    }
    console.log('Vehicles count: ', connectedClients.vehicles?.length);
};

// todo
// describe how the request would looklike: right now, we have to create the following events:
// rentVehicle: {vehicleId, userId} -> return {status: 'success'/'error', message: 'error message'}
// startVehicle: {vehicleId, userId} -> return {status: 'success'/'error', message: 'error message'}
// stopVehicle: {vehicleId, userId} -> return {status: 'success'/'error', message: 'error message'}
// vehicleStatus: {vehicleId} -> return {maxSpeed: number, emidietlyStop: boolean, message: string}

// create seperate files for each topic ex (vehicles, cities ...)

const handleMessage = (ws, message) => {
    console.log('Received message:', message.toString());
    if (ws.readyState === WebSocket.OPEN) {
        ws.send("Server Hello")
    }
};

// handleClose is called when a WebSocket connection is closed
// todo: Update database with last known location of vehicle before removing it from the list of connected vehicles
const handleClose = (connectedClients, connectionId, deviceType) => {
    // Remove the client from the list of connected clients
    if (deviceType === 'vehicle') {
        // if deviceType is vehicle, remove the client from the list of connected vehicles
        const index = connectedClients.vehicles?.findIndex(vehicle => vehicle.id === connectionId);
        // Remove the client from the list of connected clients
        connectedClients.vehicles?.splice(index, 1);
        console.log('(Vehicle) WebSocket connection closed and removed from store.');
        console.log('Vehicles count: ', connectedClients.vehicles?.length);
    }
};

module.exports = { handleConnection, handleMessage, handleClose };
