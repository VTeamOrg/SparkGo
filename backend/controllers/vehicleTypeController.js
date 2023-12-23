const vehicleTypeModel = require("../models/vehicleTypeModel");

const vehicleTypeController = {
    getAllVehicleTypes: async function (req, res) {
        try {
            const allVehicleTypes = await vehicleTypeModel.getAllVehicleTypes();
            return res.json({
                data: allVehicleTypes,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getVehicleTypeById: async function (req, res) {
        try {
            const typeId = req.params.id;
            const vehicleType = await vehicleTypeModel.getVehicleTypeById(typeId);

            return res.json({
                data: vehicleType,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createVehicleType: async function (req, res) {
        try {
            const { name } = req.body;
            const result = await vehicleTypeModel.createVehicleType(name);

            return res.json({
                message: "Vehicle type created successfully",
                insertedId: result.insertId,
            });
        } catch (error) {
            console.error("Error creating vehicle type:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateVehicleType: async function (req, res) {
        try {
            const typeId = req.params.id;
            const { name } = req.body;

            await vehicleTypeModel.updateVehicleType(typeId, name);

            return res.json({
                message: "Vehicle type updated successfully",
            });
        } catch (error) {
            console.error("Error updating vehicle type:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    deleteVehicleType: async function (req, res) {
        console.log("in delete");
        try {
            const typeId = req.params.id;
            await vehicleTypeModel.deleteVehicleType(typeId);

            return res.json({
                message: "Vehicle type deleted successfully",
            });
        } catch (error) {
            console.error("Error deleting vehicle type:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = vehicleTypeController;
