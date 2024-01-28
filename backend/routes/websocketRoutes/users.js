const { destination } = require("@turf/turf");
const subscriptionModel = require("../../models/subscriptionModel");
const userModel = require("../../models/userModel");
const calculateDistance = require("../../utils/calculateDistance");
const { connectedUsers, connectedVehicles } = require("./store");
const vehicles = require("./vehicles");

const users = {
    updateLocation: (ws, msg) => {
        const { latitude, longitude } = msg.data;
        const user = connectedUsers.get().find(user => user.ws === ws);
        if (user) {
            user.data.latitude = latitude;
            user.data.longitude = longitude;
        }
    },

    rentVehicle: async (ws, msg) => {
        // check if user is already renting a vehicle
        const user = connectedUsers.get().find(user => user.ws === ws);
        if (!user) return ws.send(JSON.stringify({ action: "rentVehicle", status: "error", message: "No user found" }));
        
        
        if (user.rentedVehicle !== -1) return ws.send(JSON.stringify({ action: "rentVehicle", status: "error", message: "User is already renting a vehicle", data: {vehicleId: user.rentedVehicle, userId: user.id} }));
        
        if (!msg.payload) return ws.send(JSON.stringify({ action: "rentVehicle", status: "error", message: "Error" }));

        const { vehicleId } = msg.payload;
        
        
        if (!vehicleId) return ws.send(JSON.stringify({ action: "rentVehicle", status: "error", message: "No vehicle id provided" }));
        
        console.log("rentVehicle", vehicleId, user.id);
        
        const vehicle = connectedVehicles.get().find(vehicle => vehicle.id === vehicleId);
        
        if (!vehicle) return;

        const vehicleWs = vehicle.ws;


        vehicles.rentVehicle(vehicleWs, user);
    },

    startVehicle: async (ws, msg) => {
        const { vehicleId } = msg.payload;

        console.log("startVehicle", vehicleId);

        if (!vehicleId) return ws.send(JSON.stringify({ action: "startVehicle", status: "error", message: "No vehicle id provided" }));

        const vehicle = connectedVehicles.get().find(vehicle => vehicle.id === vehicleId);

        if (!vehicle) return;

        const user = connectedUsers.get().find(user => user.ws === ws);
        
        if (!user) return;

        vehicles.startVehicle(vehicle.ws, user);
    },

    stopVehicle: async (ws, msg) => {
        const { vehicleId } = msg.payload;

        console.log("stopVehicle", vehicleId);

        if (!vehicleId) return ws.send(JSON.stringify({ action: "stopVehicle", status: "error", message: "No vehicle id provided" }));

        const vehicle = connectedVehicles.get().find(vehicle => vehicle.id === vehicleId);

        if (!vehicle) return;

        const user = connectedUsers.get().find(user => user.ws === ws);
        
        if (!user) return;

        vehicles.stopVehicle(vehicle.ws, user);
    },

    returnVehicle: async (ws, msg) => {
        const { vehicleId } = msg.payload;

        
        if (!vehicleId) return ws.send(JSON.stringify({ action: "returnVehicle", status: "error", message: "No vehicle id provided" }));
        
        const vehicle = connectedVehicles.get().find(vehicle => vehicle.id === vehicleId);
        
        if (!vehicle) return ws.send(JSON.stringify({ action: "returnVehicle", status: "error", message: "No vehicle found" }));
        console.log("returnVehicle", vehicleId);
        
        const user = connectedUsers.get().find(user => user.ws === ws);
        
        if (!user) return;

        vehicles.returnVehicle(vehicle.ws, user);
    },

    driveVehicle: async (ws, msg) => {
        const { vehicleId, destination } = msg.payload;

        console.log("driveVehicle", vehicleId, destination);

        if (!vehicleId) return ws.send(JSON.stringify({ action: "driveVehicle", status: "error", message: "No vehicle id provided" }));

        const vehicle = connectedVehicles.get().find(vehicle => vehicle.id === vehicleId);

        if (!vehicle) return ws.send(JSON.stringify({ action: "driveVehicle", status: "error", message: "No vehicle found" }));

        vehicles.driveVehicle(vehicle.ws, destination);
    }

}

module.exports = users;