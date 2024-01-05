const connectedClients = {
    vehicles: [],
    users: [],
    admins: [],
};
const connectedVehicles = {
    get: () => {
        return connectedClients.vehicles;
    },
    add: (vehicle) => {
        connectedClients.vehicles.push(vehicle);
    },
    remove: (vehicleId) => {
        const index = connectedClients.vehicles.findIndex(vehicle => vehicle.id === vehicleId);
        connectedClients.vehicles.splice(index, 1);
    }
}

const connectedUsers = {
    get: () => {
        return connectedClients.users;
    },
    add: (user) => {
        connectedClients.users.push(user);
    },
    remove: (userId) => {
        const index = connectedClients.users.findIndex(user => user.id === userId);
        connectedClients.users.splice(index, 1);
    }
}

const connectedAdmins = {
    get: () => {
        return connectedClients.admins;
    },
    add: (admin) => {
        connectedClients.admins.push(admin);
    },
    remove: (adminId) => {
        const index = connectedClients.admins.findIndex(admin => admin.id === adminId);
        connectedClients.admins.splice(index, 1);
    }
}

module.exports = { connectedVehicles, connectedUsers, connectedAdmins };