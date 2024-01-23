// Import necessary models
const PriceListModel = require("../../models/priceListModel.js");
const SubscriptionModel = require("../../models/subscriptionModel.js");
const UserModel = require("../../models/userModel.js");
const vehiclesModel = require("../../models/vehiclesModel.js");
const calculateDistance = require("../../utils/calculateDistance.js");

// Destructure functions from vehiclesModel
const { connectedVehicles, connectedUsers, connectedAdmins } = require("./store.js");
const objectsEqual = require("../../utils/objectsEqual.js");

// Define the vehicles object with various methods
const vehicles = {
    // Method to rent a vehicle
    rentVehicle: async (ws, user) => {

        try {
            const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);

            const vehicleData = await vehiclesModel.getVehicleById(connectedVehicle.id);
            const { battery } = vehicleData;
            const priceList = await PriceListModel.getPriceListItemByTypeId(vehicleData.type_id);


            if (!user) {
                return sendWarning(user.ws, "User not found");
            }


            if (connectedVehicle.rentedBy !== -1) {
                console.log("Vehicle already rented");
                return sendWarning(user.ws, "Vehicle already rented");
            }

            if (battery < 20) {
                return sendWarning(user.ws, "Battery too low. Please choose another vehicle.");
            }

            const subscription = await SubscriptionModel.getSubscriptionByMemberId(user.id);

            if (await checkRentConditions(subscription, user, priceList)) {
                connectedVehicle.data.rentedBy = user.id;
                connectedVehicle.rentedBy = user.id;

                // log the rent of vehicle
                connectedVehicle.userUsageLog.push({ type: "rent", timestamp: Date.now() });
                user.rentedVehicle = connectedVehicle.id;
                sendSuccess(user.ws, "rentVehicleAccepted", { vehicleId: connectedVehicle.id });
                return sendVehicleUpdates(connectedVehicle, "vehicleRented", [user.id]);
            }

            return sendInsufficientCreditError(user.ws);
        } catch (error) {
            console.error("Error renting vehicle:", error);
            return sendError(user.ws, "Error renting vehicle.");
        }
    },

    // Method to move a vehicle to a set of coordinates
    moveVehicle: async (ws, data) => {
        console.log("route move vehicle");
        try {
            const { vehicleId, lat, lon } = data;

            // Check if the required parameters are provided
            if (!vehicleId || !lat || !lon) {
                return sendWarning(ws, "Missing required parameters for moving the vehicle");
            }

            const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);

            // Update the vehicle's coordinates
            connectedVehicle.data['lat'] = lat;
            connectedVehicle.data['lon'] = lon;

            // Send a success message or any necessary updates to the WebSocket clients
            sendVehicleUpdates(connectedVehicle, "vehicleMoved");

            return sendSuccess(ws, "Vehicle moved successfully");
        } catch (error) {
            console.error("Error moving vehicle:", error);
            return sendError(ws, "Error moving vehicle.");
        }
    },

    // Method to start a rented vehicle
    startVehicle: async (ws, user) => {
        try {
            // Retrieve connected vehicle based on WebSocket
            const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);

            // Check if the vehicle is rented by the specified user
            if (connectedVehicle.rentedBy !== user.id) {
                return sendWarning(user.ws, "Vehicle not rented by this user");
            }

            const vehicleData = await vehiclesModel.getVehicleById(connectedVehicle.id);
            const priceList = await PriceListModel.getPriceListItemByTypeId(vehicleData.type_id);
            const { price_per_minute } = priceList;

            // Check if the vehicle is rented by the specified user
            if (connectedVehicle.rentedBy !== user.id) {
                return sendWarning(user.ws, "Vehicle not rented by this user");
            }

            // Fetch user's subscription
            const subscription = await SubscriptionModel.getSubscriptionByMemberId(user.id);

            // Check for available minutes and user's credit for continuing rental
            if (subscription && subscription.available_minutes < 1 && user.wallet < price_per_minute) {
                return sendInsufficientCreditError(user.ws);
            }

            // Handle credit update and start credit update interval
            const x = await handleCreditUpdate(connectedVehicle);
            if (x === "Error") return;

            // Log the start of vehicle usage and start the credit update interval
            connectedVehicle.userUsageLog.push({ type: "start", timestamp: Date.now() });

            const y = await startCreditUpdateInterval(connectedVehicle.id);
            if (y === "Error") return;

            sendVehicleUpdates(connectedVehicle, "vehicleStarted", [user.id]);

            // Return success message for starting the vehicle
            return sendSuccess(user.ws, "startVehicleAccepted", { vehicleId: connectedVehicle.id });
        } catch (error) {
            console.error("Error starting vehicle:", error);
            return sendError(user.ws, "Error starting vehicle.");
        }
    },

    // Method to stop a rented vehicle
    stopVehicle: async (ws, user) => {
        const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);

        // Check if the vehicle is rented by the specified user
        if (connectedVehicle.rentedBy !== user.id) {
            return ws.send(JSON.stringify({ action: "warning", message: "Vehicle not rented by this user" }));
        }

        // Log the stop of vehicle usage, clear credit update interval, and return success message
        connectedVehicle.userUsageLog.push({ type: "stop", timestamp: Date.now() });
        clearInterval(connectedVehicle.updateCreditInterval);
        connectedVehicle.updateCreditInterval = null;

        sendVehicleUpdates(connectedVehicle, "vehicleStopped", [user.id]);

        return sendSuccess(user.ws, "stopVehicleAccepted", { vehicleId: connectedVehicle.id });
    },

    // Method to return a rented vehicle
    returnVehicle: async (ws, user) => {
        const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);


        // Check if the vehicle is rented by the specified user
        if (connectedVehicle.rentedBy !== user.id) {
            return ws.send(JSON.stringify({ action: "warning", message: "Vehicle not rented by this user" }));
        }

        // Log the return of vehicle and reset rentedBy property
        connectedVehicle.userUsageLog.push({ type: "return", timestamp: Date.now() });
        connectedVehicle.data.rentedBy = -1;
        connectedVehicles.update(connectedVehicle.id, { ...connectedVehicle, rentedBy: -1, data: { ...connectedVehicle.data, rentedBy: -1 } });
        connectedUsers.update(user.id, { ...user, rentedVehicle: -1 });
        console.log("Rturning vehicle", connectedVehicle.id, user.id);

        sendVehicleUpdates(connectedVehicle, "vehicleReturned", [user.id]);

        // Return success message for returning the vehicle
        return sendSuccess(user.ws, "returnVehicleAccepted", { vehicleId: connectedVehicle.id });
    },

    // Method to handle vehicle status updates
    vehicleStatus: async (ws, data) => {
        const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);

        if (!connectedVehicle) {
            return;
        }



        const { vehicleId, lat, lon, battery, maxSpeed, currentSpeed, isStarted, rentedBy } = data;

        const dbVehicle = await vehiclesModel.getVehicleById(vehicleId);

        const vehicleData = { vehicleId, typeId: dbVehicle.type_id, lat, lon, battery, maxSpeed, currentSpeed, isStarted, rentedBy };

        if (objectsEqual(connectedVehicle.data, vehicleData)) {
            return;
        }

        connectedVehicle.data = vehicleData;
        sendVehicleUpdates(connectedVehicle, "regularUpdate");
    },
}


function sendVehicleUpdates(vehicle, message, except = []) {
    const admins = connectedAdmins.get();
    const users = connectedUsers.get();
    const adminsExcept = admins.filter(admin => !except.includes(admin.id));
    const usersExcept = users.filter(user => !except.includes(user.id));
    const { rentedBy } = vehicle;
    const { lat, lon, battery } = vehicle.data;
    const notAvailable = battery < 20 || rentedBy !== -1;

    // Send vehicle status update to connected users
    usersExcept.forEach(user => {
        // ensures that the vehicle is not rented cand the battery level is above 20%    
        if (battery < 20 || message === "regularUpdate" && rentedBy !== -1) {
            return;
        }
        // const { latitude: userLat, longitude: userLon } = user.data;
        // // Calculate distance between vehicle and connected users
        // const distance = calculateDistance(userLat, userLon, lat, lon);
        // // Check if the distance is less than or equal to the required distance
        // const isInRequiredDistance = distance <= process.env.DISTANCE_BITWEEN_USER_AND_VEHICLES;
        // if (isInRequiredDistance) {

        // }

        const data = {
            id: vehicle.id,
            type_id: vehicle.type_id,
            position: { lat, lon },
            battery,
            currentSpeed: vehicle.data.currentSpeed,
            maxSpeed: vehicle.data.maxSpeed,
            isStarted: vehicle.data.isStarted,
            rentedBy,
        };

        if (user.ws.readyState === 1) {
            user.ws.send(JSON.stringify({ action: "vehicleUpdate", data: data, message }));
        }
    });

    // Send vehicle status update to connected admins
    adminsExcept.forEach(admin => {
        if (admin.ws.readyState === 1) {
            admin.ws.send(JSON.stringify({ action: "vehicleUpdate", data: vehicle.data, message }));
        }
    });
}

// Method to handle credit update during vehicle usage
async function handleCreditUpdate(connectedVehicle) {
    try {
        const { ws, id } = connectedVehicle;

        const vehicleData = await vehiclesModel.getVehicleById(id);

        const priceList = await PriceListModel.getPriceListItemByTypeId(vehicleData.type_id);
        const user = await UserModel.getUserById(connectedVehicle.rentedBy);
        const connectedUser = connectedUsers.get().find(user => user.id === connectedVehicle.rentedBy);
        const subscription = await SubscriptionModel.getSubscriptionByMemberId(vehicleData.rentedBy);


        const { price_per_minute } = priceList;

        if (!user || !subscription) {
            sendError(ws, "User or subscription not found");
            clearAndUpdateInterval(connectedVehicle);
            return "Error";
        }

        const canContinueRenting = await checkRentConditions(subscription, user, priceList);

        if (!canContinueRenting) {
            console.log("Insufficient credit");
            clearAndUpdateInterval(connectedVehicle);
            sendInsufficientCreditError(connectedUser.ws);
            return "Error";
        }

        await updateCreditOnRent(user, subscription, price_per_minute);
        console.log("Credit updated");
    } catch (error) {
        console.error("Error in credit update interval:", error);
        clearAndUpdateInterval(connectedVehicle);
        return "Error";
    }
}

// Method to update credit on rent
async function updateCreditOnRent(user, subscription, price_per_minute) {
    if (subscription && subscription.is_paused === "N") {
        await SubscriptionModel.updateAvailableMinutes(user.id, subscription.available_minutes - 1);
    } else {
        await UserModel.updateUser(user.id, { wallet: user.wallet - price_per_minute });
    }
}

// Method to clear and update the credit update interval
function clearAndUpdateInterval(connectedVehicle) {
    clearInterval(connectedVehicle.updateCreditInterval);
    connectedVehicle.updateCreditInterval = null;
}

// Method to start the credit update interval
async function startCreditUpdateInterval(vehicleId) {
    const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.id === vehicleId);
    if (connectedVehicle.updateCreditInterval) {
        return "Error";
    }

    // Start the credit update interval
    connectedVehicle.updateCreditInterval = setInterval(
        async () => {
            const x = await handleCreditUpdate(connectedVehicle);
            if (x === "Error") {
                return "Error";
            }
        },
        60000 // 1 minute
    );
}

async function checkRentConditions(subscription, user, priceList) {
    const { price_per_unlock, price_per_minute } = priceList;
    const totalRentPrice = price_per_unlock + price_per_minute;

    if (subscription && subscription.is_paused === "N") {
        const enoughUnlocks = subscription.available_unlocks >= 1;
        const enoughMinutes = subscription.available_minutes >= 1;
        const enoughCredit = user.wallet >= totalRentPrice;


        if (!enoughCredit && !(enoughMinutes && enoughUnlocks)) {
            return false;
        }

        if (!enoughUnlocks) {
            await UserModel.updateUser(user.id, { wallet: user.wallet - price_per_unlock });
        } else {
            await SubscriptionModel.updateAvailableUnlocks(user.id, subscription.available_unlocks - 1);
        }

        console.log("User has subscription and enough unlocks or minutes");
        return true;
    }

    return user.wallet >= totalRentPrice;
}

function sendWarning(ws, message) {
    ws.send(JSON.stringify({ action: "warning", message }));
}

function sendSuccess(ws, message, data) {
    ws.send(JSON.stringify({ action: "success", message, data }));
}

function sendInsufficientCreditError(ws) {
    ws.send(JSON.stringify({ action: "error", message: "Insufficient credit to rent this vehicle." }));
}

function sendError(ws, message) {
    ws.send(JSON.stringify({ action: "error", message }));
}

// Export the vehicles object
module.exports = vehicles;
module.exports.sendVehicleUpdates = sendVehicleUpdates;
