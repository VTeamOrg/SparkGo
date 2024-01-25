const database = require("../db/database.js");
//const { connectedVehicles } = require("../routes/websocketRoutes/store.js");
const { connectedVehicles  } = require("../data/connectedVehicles.json");

const vehiclesModel = {
    getAllVehicles: async function () {
        try {
            const db = await database.openDb();
            const getAllVehicles = await database.query(
                db,
                "SELECT * FROM v_vehicle ORDER BY id ASC LIMIT 10"
            );

            await database.closeDb(db);
            console.log(getAllVehicles);
            // Check and ensure the result is an array or convert if needed
            const vehiclesArray = Array.isArray(getAllVehicles)
                ? getAllVehicles
                : (getAllVehicles ? [getAllVehicles] : []);

            const result = vehiclesArray.map(vehicle => {
                const connectedVehicle = connectedVehicles.find(connectedVehicle => connectedVehicle.id === Number(vehicle.id));
console.log(connectedVehicle);
                if (connectedVehicle) {
                    return {
                        id: Number(vehicle.id),
                        city_id: Number(vehicle.city_id),
                        type_id: Number(vehicle.type_id),
                        status: 'active',
                        position: {
                            lat: connectedVehicle.position.lat ?? null,
                            lon: connectedVehicle.position.lon ?? null,
                        },
                        battery: connectedVehicle.battery ?? null,
                        currentSpeed: connectedVehicle.currentSpeed ?? null,
                        maxSpeed: connectedVehicle.maxSpeed ?? null,
                        isStarted: connectedVehicle.isStarted ?? null,
                        rentedBy: connectedVehicle.rentedBy,
                        city_name: vehicle.city_name,
                        name: vehicle.name,
                        type_name: vehicle.type_name,
                        station_id: vehicle.station_id
                    }
                }

                return {
                    id: Number(vehicle.id),
                    city_id: Number(vehicle.city_id),
                    type_id: Number(vehicle.type_id),
                    status: 'inactive',
                    position: {
                        lat: null,
                        lon: null,
                    },
                    battery: null,
                    currentSpeed: null,
                    maxSpeed: null,
                    isStarted: null,
                    rentedBy: null,
                    city_name: vehicle.city_name,
                    name: vehicle.name,
                    type_name: vehicle.type_name,
                    station_id: vehicle.station_id
                }
            });

            return result;
        } catch (error) {
            throw error;
        }
    },

    getVehiclesByStationId: async function (stationId) {
        try {
            const db = await database.openDb();
            const getAllVehicles = await database.query(
                db,
                "SELECT * FROM v_vehicle WHERE station_id = ? ORDER BY id DESC",
                [stationId]
            );
    
            await database.closeDb(db);
    
            // Check and ensure the result is an array or convert if needed
            const vehiclesArray = Array.isArray(getAllVehicles)
                ? getAllVehicles // If it's already an array, use it as is
                : (getAllVehicles ? [getAllVehicles] : []); // Convert to array or use an empty array if null/undefined
    
            const result = vehiclesArray.map(vehicle => {
                const connectedVehicle = connectedVehicles.find(connectedVehicle => connectedVehicle.id === Number(vehicle.id));
    
                if (connectedVehicle) {
                    return {
                        id: Number(vehicle.id),
                        city_id: Number(vehicle.city_id),
                        type_id: Number(vehicle.type_id),
                        status: 'active',
                        position: {
                            lat: connectedVehicle.position.lat ?? null,
                            lon: connectedVehicle.position.lon ?? null,
                        },
                        battery: connectedVehicle.battery ?? null,
                        currentSpeed: connectedVehicle.currentSpeed ?? null,
                        maxSpeed: connectedVehicle.maxSpeed ?? null,
                        isStarted: connectedVehicle.isStarted ?? null,
                        rentedBy: connectedVehicle.rentedBy,
                        city_name: vehicle.city_name,
                        name: vehicle.name,
                        type_name: vehicle.type_name,
                        station_id: vehicle.station_id
                    }
                }
    
                return {
                    id: Number(vehicle.id),
                    city_id: Number(vehicle.city_id),
                    type_id: Number(vehicle.type_id),
                    status: 'inactive',
                    position: {
                        lat: null,
                        lon: null,
                    },
                    battery: null,
                    currentSpeed: null,
                    maxSpeed: null,
                    isStarted: null,
                    rentedBy: null,
                    city_name: vehicle.city_name,
                    name: vehicle.name,
                    type_name: vehicle.type_name,
                    station_id: vehicle.station_id
                };
            });
    
            return result;
        } catch (error) {
            throw error;
        }
    },
    

    getActiveVehicles: async function () {
        try {
            const db = await database.openDb();
            const getAllVehicles = await database.query(
                db,
                "SELECT * FROM v_vehicle ORDER BY id DESC"
            );

            // console.log('getAllVehicles:', getAllVehicles); // Log the result for debugging
            await database.closeDb(db);
            // Check and ensure the result is an array or convert if needed
            const vehiclesArray = Array.isArray(getAllVehicles)
                ? getAllVehicles // If it's already an array, use it as is
                : (getAllVehicles ? [getAllVehicles] : []); // Convert to array or use an empty array if null/undefined
                
            const activeVehicles = connectedVehicles.get();

            const result = activeVehicles.map(connectedVehicle => {
                const dbVehicle = vehiclesArray.find(dbVehicle => dbVehicle.id === connectedVehicle.id);

                if (connectedVehicle) {
                    return {
                        id: dbVehicle.id,
                        city_id: dbVehicle.city_id,
                        type_id: dbVehicle.type_id,
                        status: 'active',
                        position: {lat: connectedVehicle.data?.lat, lon: connectedVehicle?.data?.lon},
                        battery: connectedVehicle.data?.battery ?? null,
                        currentSpeed: connectedVehicle.data?.currentSpeed ?? null,
                        maxSpeed: connectedVehicle.data?.maxSpeed ?? null,
                        isStarted: connectedVehicle.data?.isStarted ?? null,
                        rentedBy: connectedVehicle.rentedBy,
                        city_name: dbVehicle.city_name,
                        name: dbVehicle.name,
                        type_name: dbVehicle.type_name,
                        station_id: dbVehicle.station_id,
                    }
                }

                return {
                    id: dbVehicle.id,
                    city_id: dbVehicle.city_id,
                    type_id: dbVehicle.type_id,
                    status: 'inactive',
                    position: [null, null],
                    battery: null,
                    currentSpeed: null,
                    maxSpeed: null,
                    isStarted: null,
                    rentedBy: null,
                    city_name: dbVehicle.city_name,
                    name: dbVehicle.name,
                    type_name: dbVehicle.type_name,
                    station_id: dbVehicle.station_id,
                }
            });


            return result;
        } catch (error) {
            throw error;
        }
    },

    getVehicleById: async function (vehicleId) {
        try {
            const db = await database.openDb();
            let vehicle = await database.query(
                db,
                "SELECT * FROM v_vehicle WHERE id = ?",
                vehicleId
            );

            await database.closeDb(db);

            vehicle = JSON.parse(JSON.stringify(vehicle[0]));
            
            const connectedVehicle = connectedVehicles.get().find(connectedVehicle => connectedVehicle.id === vehicle.id);

            if (connectedVehicle) {
                return {
                    id: vehicle.id,
                    city_id: vehicle.city_id,
                    type_id: vehicle.type_id,
                    status: 'active',
                    position: {lat: connectedVehicle.data?.lat, lon: connectedVehicle?.data?.lon},
                    battery: connectedVehicle.data?.battery ?? null,
                    currentSpeed: connectedVehicle.data?.currentSpeed ?? null,
                    maxSpeed: connectedVehicle.data?.maxSpeed ?? null,
                    isStarted: connectedVehicle.data?.isStarted ?? null,
                    rentedBy: connectedVehicle.rentedBy,
                    city_name: vehicle.city_name,
                    name: vehicle.name,
                    type_name: vehicle.type_name,
                    station_id: vehicle.station_id
                }
            }

            return {
                id: vehicle.id,
                city_id: vehicle.city_id,
                type_id: vehicle.type_id,
                status: 'inactive',
                position: [null, null],
                battery: null,
                currentSpeed: null,
                maxSpeed: null,
                isStarted: null,
                rentedBy: null,
                city_name: vehicle.city_name,
                name: vehicle.name,
                type_name: vehicle.type_name,
                station_id: vehicle.station_id
            }
        } catch (error) {
            throw error;
        }
    },
    

    createVehicle: async function (city_id, type_id, vehicle_status, name, station_id) {
        try {
            const db = await database.openDb();
            const newVehicle = await database.query(
                db,
                "INSERT INTO vehicle (city_id, type_id, vehicle_status, name, station_id) VALUES (?, ?, ?, ?, ?)",
                [city_id, type_id, vehicle_status, name, station_id]
            );

            await database.closeDb(db);
            return newVehicle;
        } catch (error) {
            throw error;
        }
    },

    updateVehicle: async function (vehicleId, city_id, type_id, vehicle_status, name, station_id) {
        try {
            const db = await database.openDb();
            const updatedVehicle = await database.query(
                db,
                "UPDATE vehicle SET city_id = ?, type_id = ?, vehicle_status = ?, name = ?, station_id = ? WHERE id = ?",
                [city_id, type_id, vehicle_status, name, station_id, vehicleId]
            );
    
            await database.closeDb(db);
            return updatedVehicle;
        } catch (error) {
            throw error;
        }
    },  

    rentVehicle: async function (vehicleId, rentedBy) {
        try {
            const db = await database.openDb();
            const rentedVehicle = await database.query(
                db,
                "UPDATE vehicle SET rented_by = ? WHERE id = ?",
                [rentedBy, vehicleId]
            );

            await database.closeDb(db);
            return rentedVehicle;
        } catch (error) {
            throw error;
        }
    },

    deleteVehicle: async function (vehicleId) {
        try {
            const db = await database.openDb();
            await database.query(
                db,
                "DELETE FROM vehicle WHERE id = ?",
                vehicleId
            );

            await database.closeDb(db);
        } catch (error) {
            throw error;
        }
    },
};

module.exports = vehiclesModel;
