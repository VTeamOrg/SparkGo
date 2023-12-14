const { getUserById } = require("../../models/users");

const vehicle = {
    rentVehicle: async (ws, msg) => {
        const { vehicleId, userId, battery } = msg;
        const user = await getUserById(userId);

        if (!user) {
            return ws.send(JSON.stringify({ status: "error", message: "User not found" }));
        }

        if (user.wallet < 1) {
            return ws.send(JSON.stringify({ status: "error", message: "Not enaugh coins in wallet, please top up or buy a subscription plan to rent a vehicle" }));
        }

        if (battery < 20) {
            return ws.send(JSON.stringify({ status: "error", message: "Battery too low, please choose another vehicle" }));
        }

        ws.send(JSON.stringify({ status: "success", message: "Vehicle rented" }));
    }
}