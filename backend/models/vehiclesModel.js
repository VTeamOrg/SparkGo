const database = require("../db/database.js");
const { connectedVehicles } = require("../routes/websocketRoutes/store.js");

const vehiclesModel = {
    getAllVehicles: async function () {
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

            const result = vehiclesArray.map(vehicle => {
                const connectedVehicle = connectedVehicles.get().find(connectedVehicle => connectedVehicle.id === vehicle.id);

                if (connectedVehicle) {
                    return {
                        id: vehicle.id,
                        city_id: vehicle.city_id,
                        type_id: vehicle.type_id,
                        status: 'active',
                        position: [connectedVehicle.vehicleData?.lat, connectedVehicle?.vehicleData?.lon],
                        battery: connectedVehicle.vehicleData?.battery ?? null,
                        currentSpeed: connectedVehicle.vehicleData?.currentSpeed ?? null,
                        maxSpeed: connectedVehicle.vehicleData?.maxSpeed ?? null,
                        isStarted: connectedVehicle.vehicleData?.isStarted ?? null,
                        rentedBy: connectedVehicle.rentedBy,
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
                }
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
                        position: [connectedVehicle.vehicleData?.lat, connectedVehicle?.vehicleData?.lon],
                        battery: connectedVehicle.vehicleData?.battery ?? null,
                        currentSpeed: connectedVehicle.vehicleData?.currentSpeed ?? null,
                        maxSpeed: connectedVehicle.vehicleData?.maxSpeed ?? null,
                        isStarted: connectedVehicle.vehicleData?.isStarted ?? null,
                        rentedBy: connectedVehicle.rentedBy,
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
                    position: [connectedVehicle.vehicleData?.lat, connectedVehicle?.vehicleData?.lon],
                    battery: connectedVehicle.vehicleData?.battery ?? null,
                    currentSpeed: connectedVehicle.vehicleData?.currentSpeed ?? null,
                    maxSpeed: connectedVehicle.vehicleData?.maxSpeed ?? null,
                    isStarted: connectedVehicle.vehicleData?.isStarted ?? null,
                    rentedBy: connectedVehicle.rentedBy,
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
            }
        } catch (error) {
            throw error;
        }
    },
    

    createVehicle: async function (city_id, type_id, rented_by) {
        try {
            const db = await database.openDb();
            const newVehicle = await database.query(
                db,
                "INSERT INTO vehicle (city_id, type_id, rented_by) VALUES (?, ?, ?)",
                [city_id, type_id, rented_by]
            );

            await database.closeDb(db);
            return newVehicle;
        } catch (error) {
            throw error;
        }
    },

    // i dont think we need this, we have to be more specific on what we want to update
    // i think it's better to make a function for each update we want to do
    updateVehicle: async function (vehicleId, city_id, type_id, rented_by) {
        try {
            const db = await database.openDb();
            const updatedVehicle = await database.query(
                db,
                "UPDATE vehicle SET city_id = ?, type_id = ?, rented_by = ? WHERE id = ?",
                [city_id, type_id, rented_by, vehicleId]
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
