const WebSocket = require("ws");
const { connectedVehicles } = require("../routes/websocketRoutes/store");

// handleConnection is called when a new WebSocket connection is established
const handleConnection = (ws, req, connectionId, deviceType) => {
    // Add the client to the list of connected clients
    if (deviceType === 'vehicle') {
        // if deviceType is vehicle, add the client to the list of connected vehicles
        connectedVehicles.add({id: connectionId, ws});
    }
    console.log('Vehicles count: ', connectedVehicles.get().length);
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
    const msg = JSON.parse(message.toString());
    if (ws.readyState === WebSocket.OPEN) {
        switch (msg.action) {
            case 'rentVehicle':
                ws.send("Vehicle rented")
                break;
            case 'startVehicle':
                ws.send("Vehicle started")
                break;
            case 'stopVehicle':
                ws.send("Vehicle stopped")
                break;
            case 'vehicleStatus':
                ws.send("Vehicle status")
                break;
            default:
                break;
        }
    }
};

// handleClose is called when a WebSocket connection is closed
// todo: Update database with last known location of vehicle before removing it from the list of connected vehicles
const handleClose = (connectionId, deviceType) => {
    // Remove the client from the list of connected clients
    if (deviceType === 'vehicle') {
        // Remove the client from the list of connected clients
        connectedVehicles.remove(connectionId);
        console.log('(Vehicle) WebSocket connection closed and removed from store.');
        console.log('Vehicles count: ', connectedVehicles.get()?.length);
    }
};

module.exports = { handleConnection, handleMessage, handleClose };
