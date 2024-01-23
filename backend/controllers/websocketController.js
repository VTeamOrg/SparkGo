const WebSocket = require("ws");
const { connectedVehicles, connectedAdmins, connectedUsers } = require("../routes/websocketRoutes/store.js")

// handleConnection is called when a new WebSocket connection is established
const handleConnection = (ws, req, connectionId, deviceType) => {
    // Add the client to the list of connected clients
    if (deviceType === 'vehicle') {
        // if deviceType is vehicle, add the client to the list of connected vehicles
        connectedVehicles.add({ id: connectionId, ws, userUsageLog: [], updateCreditInterval: null, rentedBy: -1, data: { latitude: -1, longitude: -1, battery: -1, currentSpeed: -1, maxSpeed: -1, isStarted: false, rentedBy: -1 } });
    }
    if (deviceType === 'user') {
        // const user = connectedUsers.get()?.find(user => user.id === connectionId);
        // if (user) {
        //     // if user is already connected, replace the old websocket with the new one
        //     user.ws = ws;
        //     return;
        // } 
        // if deviceType is user, add the client to the list of connected users
        connectedUsers.add({ id: connectionId, ws, rentedVehicle: -1, data: { latitude: -1, longitude: -1 } });
    }
    if (deviceType === 'admin') {
        // if deviceType is admin, add the client to the list of connected admins
        connectedAdmins.add({ id: connectionId, ws, data: { latitude: -1, longitude: -1 } });
    }

    console.info('WebSocket connection established. \n Connection ID: ', connectionId, '\n Device type: ', deviceType);
    console.info(`vehicles: ${connectedVehicles.get()?.length} users: ${connectedUsers.get()?.length} admins: ${connectedAdmins.get()?.length}`)
};

// create seperate files for each topic ex (vehicles, cities ...)

const handleMessage = (ws, message) => {
    // check if valid json 
    const msg = JSON.parse(message.toString()) || { action: null };

    const isVehicle = connectedVehicles.get()?.find(vehicle => vehicle.ws === ws);
    const isUser = connectedUsers.get()?.find(user => user.ws === ws);
    const isAdmin = connectedAdmins.get()?.find(admin => admin.ws === ws);

    const vehicleFunctions = require("../routes/websocketRoutes/vehicles");
    const userFunctions = require("../routes/websocketRoutes/users");
    // const adminFunctions = require("../routes/websocketRoutes/admins");
    if (ws.readyState === WebSocket.OPEN) {
        if (isVehicle) {
            switch (msg.action) {
                case 'vehicleStatus':
                    vehicleFunctions.vehicleStatus(ws, msg);
                    break;
                default:
                    break;
            }
        }

        if (isUser) {
            // console.log(msg);
            switch (msg.action) {
                case 'updateLocation':
                    userFunctions.updateLocation(ws, msg);
                    break;
                case 'rentVehicle':
                    userFunctions.rentVehicle(ws, msg);
                    break;
                case 'startVehicle':
                    userFunctions.startVehicle(ws, msg);
                    break;
                case 'stopVehicle':
                    userFunctions.stopVehicle(ws, msg);
                    break;
                case 'returnVehicle':
                    userFunctions.returnVehicle(ws, msg);
                    break;
                default:
                    break;
            }
        }
    }
};

// handleClose is called when a WebSocket connection is closed
// todo: Update database with last known location of vehicle before removing it from the list of connected vehicles
const handleClose = (connectionId, deviceType) => {
    // Remove the client from the list of connected clients
    if (deviceType === 'vehicle') {
        const vehicle = connectedVehicles.get()?.find(vehicle => vehicle.id === connectionId);
        // Remove the client from the list of connected clients
        connectedVehicles.remove(connectionId);

        // sned message to admins and users that vehicle is offline
        connectedAdmins.get()?.forEach(admin => {
            user.ws.send(JSON.stringify({ action: 'vehicleUpdate', data: vehicle.data, message: 'vehicleRemoved' }));
        });
        connectedUsers.get()?.forEach(user => {
            user.ws.send(JSON.stringify({ action: 'vehicleUpdate', data: vehicle.data, message: 'vehicleRemoved' }));
        });
        console.info('(Vehicle) WebSocket connection closed and removed from store. \n Vehicles count: ', connectedVehicles.get()?.length);
    }

    if (deviceType === 'user') {
        // Remove the client from the list of connected clients
        const user = connectedUsers.get()?.find(user => user.id === connectionId);
        if (user.rentedVehicle === -1) {
            connectedUsers.remove(connectionId);
        }

        // send message to admins that user is offline
        connectedAdmins.get()?.forEach(admin => {
            admin.ws.send(JSON.stringify({ action: 'userUpdate', data: user.data, message: 'userRemoved' }));
        });

        console.info('(User) WebSocket connection closed and removed from store. \n Users count: ', connectedUsers.get()?.length);
    }
};

module.exports = { handleConnection, handleMessage, handleClose };
