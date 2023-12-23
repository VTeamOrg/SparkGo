// Import necessary models
const PriceListModel = require("../../models/priceListModel");
const SubscriptionModel = require("../../models/subscriptionModel");
const UserModel = require("../../models/userModel");
const vehiclesModel = require("../../models/vehiclesModel");

// Destructure functions from vehiclesModel
const { getVehicleById } = require("../../models/vehiclesModel");
const { connectedVehicles } = require("./store");

// Define the vehicles object with various methods
const vehicles = {
    // Method to rent a vehicle
    rentVehicle: async (ws, data) => {
        try {
            // Retrieve connected vehicle based on WebSocket
            const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);
            const { vehicleId, payload, battery } = data;
            const userId = payload.userId;

            // Fetch user details and vehicle data
            const user = await UserModel.getUserById(userId);
            const vehicleData = await getVehicleById(vehicleId);
            const priceList = await PriceListModel.getPriceListItemById(vehicleData.type_id);

            // Check if user exists
            if (!user) {
                return ws.send(JSON.stringify({ action: "warning", message: "User not found" }));
            }

            // Fetch user's subscription
            const subscription = await SubscriptionModel.getSubscriptionByMemberId(userId);

            // Check if the vehicle is already rented
            if (connectedVehicle.rentedBy !== null) {
                return ws.send(JSON.stringify({ action: "warning", message: "Vehicle already rented" }));
            }

            // Check battery level
            if (battery < 20) {
                return ws.send(JSON.stringify({ action: "warning", message: "Battery too low. Please choose another vehicle." }));
            }

            // Calculate total rent price
            const { price_per_unlock, price_per_minute } = priceList;
            const totalRentPrice = price_per_unlock + price_per_minute;

            // Handle subscription and user wallet conditions for renting
            if (subscription && subscription.is_paused === "N") {
                // Check if user has enough credit or unlocks to rent the vehicle
                const enoughUnlocks = subscription.available_unlocks >= 1;
                const enoughMinutes = subscription.available_minutes >= 1;
                const enoughCredit = user.wallet >= totalRentPrice;

                // Return warning message for insufficient credit or unlocks
                // if (!enoughUnlocks && !(enoughMinutes && enoughCredit)) {
                if (!enoughCredit && !(enoughMinutes && enoughUnlocks)) {
                    return ws.send(JSON.stringify({ action: "warning", message: "Insufficient credit." }));
                }

                // Deduct unlock or update available unlocks based on conditions
                if (!enoughUnlocks) {
                    await UserModel.updateUser(user.id, { wallet: user.wallet - price_per_unlock });
                } else {
                    await SubscriptionModel.updateAvailableUnlocks(userId, subscription.available_unlocks - 1);
                }

                // Update connected vehicle's rentedBy property and return success message
                connectedVehicle.rentedBy = userId;
                return ws.send(JSON.stringify({ action: "rentVehicle", message: "Vehicle rented", rentedBy: userId }));
            }

            // Rent the vehicle based on user wallet if no subscription or subscription paused
            if (user.wallet >= totalRentPrice) {
                await UserModel.updateUser(user.id, { wallet: user.wallet - totalRentPrice });
                connectedVehicle.rentedBy = userId;
                return ws.send(JSON.stringify({ action: "rentVehicle", message: "Vehicle rented", rentedBy: userId }));
            }

            // Return error for insufficient credit
            return ws.send(JSON.stringify({ action: "error", message: "Insufficient credit to rent this vehicle." }));
        } catch (error) {
            console.error("Error renting vehicle:", error);
            return ws.send(JSON.stringify({ action: "error", message: "Error renting vehicle." }));
        }
    },

    // Method to start a rented vehicle
    startVehicle: async (ws, data) => {
        try {
            // Retrieve connected vehicle based on WebSocket
            const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.ws === ws);
            const { vehicleId, rentedBy } = data;
            const user = await UserModel.getUserById(rentedBy);
            const vehicleData = await getVehicleById(vehicleId);
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
            vehicles.handleCreditUpdate(vehicleId, connectedVehicle);

            // Log the start of vehicle usage and start the credit update interval
            connectedVehicle.userUsageLog.push({ type: "start", timestamp: Date.now() });
            vehicles.startCreditUpdateInterval(vehicleId).catch(error => {
                console.error("Error starting credit update interval:", error);
            });

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
        const vehicleData = await getVehicleById(vehicleId);

        // Check if the vehicle is rented by the specified user
        if (connectedVehicle.rentedBy !== rentedBy) {
            return ws.send(JSON.stringify({ action: "warning", message: "Vehicle not rented by this user" }));
        }

        // Log the stop of vehicle usage, clear credit update interval, and return success message
        connectedVehicle.userUsageLog.push({ type: "stop", timestamp: Date.now() });
        clearInterval(connectedVehicle.updateCreditInterval);
        connectedVehicle.updateCreditInterval = null;

        return ws.send(JSON.stringify({ action: "stopVehicle", message: "Vehicle stopped" }));
    },

    // Method to start the credit update interval
    startCreditUpdateInterval: async (vehicleId) => {
        const connectedVehicle = connectedVehicles.get().find(vehicle => vehicle.id === vehicleId);
        if (connectedVehicle.updateCreditInterval) {
            return;
        }

        // Start the credit update interval
        connectedVehicle.updateCreditInterval = setInterval(
            () => vehicles.handleCreditUpdate(vehicleId, connectedVehicle),
            60000 // 1 minute
        );
    },

    // Method to handle credit update during vehicle usage
    handleCreditUpdate: async (vehicleId, connectedVehicle) => {
        try {
            const vehicleData = await getVehicleById(vehicleId);
            const { type_id } = vehicleData;
            const { rentedBy } = connectedVehicle;
            const priceList = await PriceListModel.getPriceListItemById(type_id);
            const { price_per_minute } = priceList;
    
            const user = await UserModel.getUserById(rentedBy);
            const subscription = await SubscriptionModel.getSubscriptionByMemberId(rentedBy);
    
            if (subscription && subscription.is_paused === "N" && subscription.available_minutes < 1) {
                if (user.wallet < price_per_minute) {
                    clearInterval(connectedVehicle.updateCreditInterval);
                    connectedVehicle.updateCreditInterval = null;
    
                    connectedVehicle.ws.send(JSON.stringify({ action: "stopVehicle", message: "Vehicle Stopped" }));
                    return connectedVehicle.ws.send(JSON.stringify({ action: "error", message: "Insufficient credit or minutes to continue renting the vehicle" }));
                } else {
                    await UserModel.updateUser(user.id, { wallet: user.wallet - price_per_minute });
                    return;
                }
            }
    
            if (user.wallet < price_per_minute) {
                clearInterval(connectedVehicle.updateCreditInterval);
                connectedVehicle.updateCreditInterval = null;
    
                connectedVehicle.ws.send(JSON.stringify({ action: "stopVehicle", message: "Vehicle Stopped" }));
                return connectedVehicle.ws.send(JSON.stringify({ action: "error", message: "Insufficient credit to continue renting the vehicle" }));
            }
    
            if (subscription && subscription.is_paused === "N" && subscription.available_minutes >= 1) {
                await SubscriptionModel.updateAvailableMinutes(rentedBy, subscription.available_minutes - 1);
                return;
            }
    
            await UserModel.updateUser(user.id, { wallet: user.wallet - price_per_minute });
        } catch (error) {
            console.error("Error in credit update interval:", error);
        }
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
        connectedVehicle.rentedBy = null;

        // Return success message for returning the vehicle
        return ws.send(JSON.stringify({ action: "returnVehicle", message: "Vehicle Returned" }));
    }
}

// Export the vehicles object
module.exports = vehicles;
