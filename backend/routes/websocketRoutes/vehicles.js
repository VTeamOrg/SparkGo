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
    rentVehicle: async (ws, data) => {
        try {
            const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);
            const { vehicleId, payload, battery } = data;
            const userId = payload.userId;

            const user = await UserModel.getUserById(userId);
            const vehicleData = await vehiclesModel.getVehicleById(vehicleId);
            const priceList = await PriceListModel.getPriceListItemById(vehicleData.type_id);

            if (!user) {
                return sendWarning(ws, "User not found");
            }

            if (connectedVehicle.rentedBy !== -1) {
                return sendWarning(ws, "Vehicle already rented");
            }

            if (battery < 20) {
                return sendWarning(ws, "Battery too low. Please choose another vehicle.");
            }

            const subscription = await SubscriptionModel.getSubscriptionByMemberId(userId);

            if (await checkRentConditions(subscription, user, priceList)) {
                connectedVehicle.data.rentedBy = userId;
                connectedVehicle.rentedBy = userId;

                // log the rent of vehicle
                connectedVehicle.userUsageLog.push({ type: "rent", timestamp: Date.now() });


                sendVehicleUpdates(connectedVehicle, "vehicleRented");

                return sendSuccess(ws, "Vehicle rented", userId);
            }

            return sendInsufficientCreditError(ws);
        } catch (error) {
            console.error("Error renting vehicle:", error);
            return sendError(ws, "Error renting vehicle.");
        }
    },

    // Method to move a vehicle to a set of coordinates
    moveVehicle: async (ws, data) => {
        console.log("move vehicle");
        try {
            const { vehicleId, lat, lon } = data;

            // Check if the required parameters are provided
            if (!vehicleId || !lat || !lon) {
                return sendWarning(ws, "Missing required parameters for moving the vehicle");
            }

            const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);

            // Check if the vehicle is rented and rented by the user making the request
            if (connectedVehicle.rentedBy === -1 || connectedVehicle.rentedBy !== data.rentedBy) {
                return sendWarning(ws, "Vehicle is not rented by the user or not rented at all");
            }

            // Update the vehicle's coordinates
            connectedVehicle.data.lat = lat;
            connectedVehicle.data.lon = lon;

            // Send a success message or any necessary updates to the WebSocket clients
            sendVehicleUpdates(connectedVehicle, "vehicleMoved");

            return sendSuccess(ws, "Vehicle moved successfully");
        } catch (error) {
            console.error("Error moving vehicle:", error);
            return sendError(ws, "Error moving vehicle.");
        }
    },

    // Method to start a rented vehicle
    startVehicle: async (ws, data) => {
        try {
            // Retrieve connected vehicle based on WebSocket
            const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);
            const { vehicleId, rentedBy } = data;

            if (!vehicleId || !rentedBy) {
                return ws.send(JSON.stringify({ action: "warning", message: "Missing vehicleId or rentedBy" }));
            }

            const user = await UserModel.getUserById(rentedBy);
            const vehicleData = await vehiclesModel.getVehicleById(vehicleId);
            const priceList = await PriceListModel.getPriceListItemById(vehicleData.type_id);
            const { price_per_minute } = priceList;

            // Check if the vehicle is rented by the specified user
            if (connectedVehicle.rentedBy !== rentedBy) {
                return ws.send(JSON.stringify({ action: "warning", message: "Vehicle not rented by this user" }));
            }

            // Fetch user's subscription
            const subscription = await SubscriptionModel.getSubscriptionByMemberId(rentedBy);

            // Check for available minutes and user's credit for continuing rental
            if (subscription && subscription.available_minutes < 1 && user.wallet < price_per_minute) {
                return ws.send(JSON.stringify({ action: "warning", message: "Insufficient minutes or credit." }));
            }

            // Handle credit update and start credit update interval
            await handleCreditUpdate(vehicleId, connectedVehicle);

            // Log the start of vehicle usage and start the credit update interval
            connectedVehicle.userUsageLog.push({ type: "start", timestamp: Date.now() });

            await startCreditUpdateInterval(vehicleId).catch(error => {
                console.error("Error starting credit update interval:", error);
            });

            sendVehicleUpdates(connectedVehicle, "vehicleStarted");

            // Return success message for starting the vehicle
            return ws.send(JSON.stringify({ action: "startVehicle", message: "Vehicle started" }));
        } catch (error) {
            console.error("Error starting vehicle:", error);
            return ws.send(JSON.stringify({ action: "error", message: "Error starting vehicle." }));
        }
    },

    // Method to stop a rented vehicle
    stopVehicle: async (ws, data) => {
        const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);
        const { vehicleId, rentedBy } = data;

        // Check if the vehicle is rented by the specified user
        if (connectedVehicle.rentedBy !== rentedBy) {
            return ws.send(JSON.stringify({ action: "warning", message: "Vehicle not rented by this user" }));
        }

        // Log the stop of vehicle usage, clear credit update interval, and return success message
        connectedVehicle.userUsageLog.push({ type: "stop", timestamp: Date.now() });
        clearInterval(connectedVehicle.updateCreditInterval);
        connectedVehicle.updateCreditInterval = null;

        sendVehicleUpdates(connectedVehicle, "vehicleStopped");

        return ws.send(JSON.stringify({ action: "stopVehicle", message: "Vehicle stopped" }));
    },

    // Method to return a rented vehicle
    returnVehicle: async (ws, data) => {
        const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);
        const { vehicleId, rentedBy } = data;

        // Check if the vehicle is rented by the specified user
        if (connectedVehicle.rentedBy !== rentedBy) {
            return ws.send(JSON.stringify({ action: "warning", message: "Vehicle not rented by this user" }));
        }

        // Log the return of vehicle and reset rentedBy property
        connectedVehicle.userUsageLog.push({ type: "return", timestamp: Date.now() });
        connectedVehicle.data.rentedBy = -1;
        connectedVehicle.rentedBy = -1;
        
        sendVehicleUpdates(connectedVehicle, "vehicleReturned");
        
        // Return success message for returning the vehicle
        return ws.send(JSON.stringify({ action: "returnVehicle", message: "Vehicle Returned" }));
    },

    // Method to handle vehicle status updates
    vehicleStatus: (ws, data) => {
        const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);

        if (!connectedVehicle) {
            return;
        }

        const { vehicleId, lat, lon, battery, maxSpeed, currentSpeed, isStarted, rentedBy } = data;

        const vehicleData = { vehicleId, lat, lon, battery, maxSpeed, currentSpeed, isStarted, rentedBy };

        if (objectsEqual(connectedVehicle.data, vehicleData)) {
            return;
        }

        connectedVehicle.data = vehicleData;

        sendVehicleUpdates(connectedVehicle, "regularUpdate");
    },
}


function sendVehicleUpdates(vehicle, message) {
    const admins = connectedAdmins.get();
    const users = connectedUsers.get();
    const { rentedBy } = vehicle;
    const { lat, lon, battery } = vehicle.data;
    const notAvailable = battery < 20 || rentedBy !== -1;
    // forUser ensures that the vehicle is not rented and the battery level is above 20%
    const forUser = rentedBy === -1 && battery >= 20 || message === "vehicleRented";
    
    // Send vehicle status update to connected users
    forUser && users.forEach(user => {
        const { latitude: userLat, longitude: userLon } = user.data;
        // Calculate distance between vehicle and connected users
        const distance = calculateDistance(userLat, userLon, lat, lon);
        // Check if the distance is less than or equal to the required distance
        const isInRequiredDistance = distance <= process.env.DISTANCE_BITWEEN_USER_AND_VEHICLES;
        if (isInRequiredDistance) {
            user.ws.send(JSON.stringify({ action: "vehicleUpdate", data: vehicle.data, message }));
        }
    });

    // Send vehicle status update to connected admins
    admins.forEach(admin => {
        if (admin.ws.readyState === WebSocket.OPEN) {
            admin.ws.send(JSON.stringify({ action: "vehicleUpdate", data: vehicle.data, message }));
        }
    });
}

// Method to handle credit update during vehicle usage
async function handleCreditUpdate(vehicleId, connectedVehicle) {
    try {
        const { ws } = connectedVehicle;

        const vehicleData = await vehiclesModel.getVehicleById(vehicleId);

        const priceList = await PriceListModel.getPriceListItemById(vehicleData.type_id);
        const user = await UserModel.getUserById(vehicleData.rentedBy);
        const subscription = await SubscriptionModel.getSubscriptionByMemberId(vehicleData.rentedBy);


        const { price_per_minute } = priceList;

        if (!user || !subscription) {
            sendError(ws, "User or subscription not found");
            clearAndUpdateInterval(connectedVehicle);
            return;
        }

        const canContinueRenting = await checkRentConditions(subscription, user, priceList);

        if (!canContinueRenting) {
            sendInsufficientCreditError(ws);
            clearAndUpdateInterval(connectedVehicle);
            return;
        }

        await updateCreditOnRent(user, subscription, price_per_minute);
    } catch (error) {
        console.error("Error in credit update interval:", error);
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
        return;
    }

    // Start the credit update interval
    connectedVehicle.updateCreditInterval = setInterval(
        async () => await handleCreditUpdate(vehicleId, connectedVehicle),
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

        return true;
    }

    return user.wallet >= totalRentPrice;
}

function sendWarning(ws, message) {
    ws.send(JSON.stringify({ action: "warning", message }));
}

function sendSuccess(ws, message, userId) {
    ws.send(JSON.stringify({ action: "rentVehicle", message, rentedBy: userId }));
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
