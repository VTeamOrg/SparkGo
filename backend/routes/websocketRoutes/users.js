const subscriptionModel = require("../../models/subscriptionModel");
const userModel = require("../../models/userModel");
const calculateDistance = require("../../utils/calculateDistance");
const { connectedUsers } = require("./store");

const users = {
    updateLocation: (ws, msg) => {
        const { latitude, longitude } = msg.data;
        const user = connectedUsers.get().find(user => user.ws === ws);
        if (user) {
            user.data.latitude = latitude;
            user.data.longitude = longitude;
        }
    },

}

module.exports = users;