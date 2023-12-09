const database = require("../db/database.js");

const vehicleType = {
  getAllVehicleTypes: async function getAllVehicleTypes(req, res) {
    try {
      const db = await database.openDb();
      const allVehicleTypes = await database.query(
        db,
        "SELECT * FROM vehicle_type"
      );

      await database.closeDb(db);

      return res.json({
        data: allVehicleTypes,
      });
    } catch (error) {
      console.error("Error querying database:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getVehicleTypeById: async function getVehicleTypeById(req, res) {
    try {
      const db = await database.openDb();
      const typeId = req.params.id;
      const vehicleType = await database.query(
        db,
        "SELECT * FROM vehicle_type WHERE id = ?",
        typeId
      );

      await database.closeDb(db);

      return res.json({
        data: vehicleType[0],
      });
    } catch (error) {
      console.error("Error querying database:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createVehicleType: async function createVehicleType(req, res) {
    try {
      const db = await database.openDb();
      const { name } = req.body;

      const result = await database.query(
        db,
        "INSERT INTO vehicle_type (name) VALUES (?)",
        [name]
      );

      await database.closeDb(db);

      return res.json({
        message: "Vehicle type created successfully",
        insertedId: result.insertId,
      });
    } catch (error) {
      console.error("Error creating vehicle type:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateVehicleType: async function updateVehicleType(req, res) {
    try {
      const db = await database.openDb();
      const typeId = req.params.id;
      const { name } = req.body;

      await database.query(
        db,
        "UPDATE vehicle_type SET name = ? WHERE id = ?",
        [name, typeId]
      );

      await database.closeDb(db);

      return res.json({
        message: "Vehicle type updated successfully",
      });
    } catch (error) {
      console.error("Error updating vehicle type:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteVehicleType: async function deleteVehicleType(req, res) {
    console.log("in delete");
    try {
      const db = await database.openDb();
      const typeId = req.params.id;

      await database.query(db, "DELETE FROM vehicle_type WHERE id = ?", [typeId]);

      await database.closeDb(db);

      return res.json({
        message: "Vehicle type deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting vehicle type:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = vehicleType;
