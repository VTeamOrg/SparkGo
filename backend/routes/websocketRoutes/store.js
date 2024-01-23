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
    },
    update: (vehicleId, data) => {
        const index = connectedClients.vehicles.findIndex(vehicle => vehicle.id === vehicleId);
        connectedClients.vehicles[index] = data;
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
    },
    update: (userId, data) => {
        const index = connectedClients.users.findIndex(user => user.id === userId);
        connectedClients.users[index] = data;
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
    },
    update: (adminId, data) => {
        const index = connectedClients.admins.findIndex(admin => admin.id === adminId);
        connectedClients.admins[index] = data;
    }
}

module.exports = { connectedVehicles, connectedUsers, connectedAdmins };