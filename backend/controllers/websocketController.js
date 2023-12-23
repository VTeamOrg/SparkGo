const WebSocket = require("ws");
const { connectedVehicles } = require("../routes/websocketRoutes/store");

// handleConnection is called when a new WebSocket connection is established
const handleConnection = (ws, req, connectionId, deviceType) => {
    // Add the client to the list of connected clients
    if (deviceType === 'vehicle') {
        // if deviceType is vehicle, add the client to the list of connected vehicles
        connectedVehicles.add({id: connectionId, rentedBy: null, ws, userUsageLog: [], updateCreditInterval: null});
    }
    console.info('Vehicles count: ', connectedVehicles.get().length);
};

// create seperate files for each topic ex (vehicles, cities ...)

const handleMessage = (ws, message) => {
    // console.log('Received message:', message.toString());
    const msg = JSON.parse(message.toString());
    const vehicleFunctions = require("../routes/websocketRoutes/vehicles");
    if (ws.readyState === WebSocket.OPEN) {
        switch (msg.action) {
            case 'rentVehicle':
                vehicleFunctions.rentVehicle(ws, msg);
                break;
            case 'startVehicle':
                vehicleFunctions.startVehicle(ws, msg);
                break;
            case 'stopVehicle':
                vehicleFunctions.stopVehicle(ws, msg);
                break;
            case 'returnVehicle':
                vehicleFunctions.returnVehicle(ws, msg);
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
        console.info('(Vehicle) WebSocket connection closed and removed from store. \n Vehicles count: ', connectedVehicles.get()?.length);
    }
};

module.exports = { handleConnection, handleMessage, handleClose };
