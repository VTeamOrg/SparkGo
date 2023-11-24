const database = require("../db/database.js");

const cities = {
    getAllCities: async function getAllCities(req, res) {
        try {
            const db = await database.openDb();
            const allCities = await database.query(
                db,
                "SELECT * FROM city ORDER BY id DESC"
            );

            await database.closeDb(db);

            return res.json({
                data: allCities,
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getCityById: async function getCityById(req, res) {
        try {
            const db = await database.openDb();
            const cityId = req.params.cityId;
            const city = await database.query(
                db,
                "SELECT * FROM city WHERE id = ?",
                cityId
            );

            await database.closeDb(db);

            return res.json({
                data: city[0],
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createCity: async function createCity(req, res) {
        try {
            const db = await database.openDb();
            const { name } = req.body; 
            const result = await database.query(
                db,
                "INSERT INTO city (name) VALUES (?)",
                [name]
            );

            await database.closeDb(db);

            return res.status(201).json({
                data: {
                    id: result.insertId,
                    name: name,
                },
                message: "City created successfully",
            });
        } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateCityById: async function updateCityById(req, res) {
        console.log("update by id: ");
        try {
          const db = await database.openDb();
          const cityId = req.params.cityId;
          const { name } = req.body; 
      
          console.log("Updating city with ID:", cityId);
          console.log("New city name:", name);
      
          const result = await database.query(
            db,
            "UPDATE city SET name = ? WHERE id = ?",
            [name, cityId]
          );
      
          await database.closeDb(db);
      
          if (result.affectedRows === 0) {
            console.log("City not found for update");
            return res.status(404).json({ error: "City not found" });
          }
      
          console.log("City updated successfully");
          return res.json({
            message: "City updated successfully",
          });
        } catch (error) {
          console.error("Error querying database:", error.message);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      },
      
    deleteCityById: async function deleteCityById(req, res) {
        console.log("Deleting city by ID");
        try {
            const db = await database.openDb();
            const cityId = req.params.cityId;
        
            console.log("Deleting city with ID:", cityId);
        
            const result = await database.query(
                db,
                "DELETE FROM city WHERE id = ?",
                [cityId]
            );
        
            await database.closeDb(db);
        
            if (result.affectedRows === 0) {
                console.log("City not found for deletion");
                return res.status(404).json({ error: "City not found" });
            }
        
            console.log("City deleted successfully");
            return res.json({
                message: "City deleted successfully",
            });
            } catch (error) {
            console.error("Error querying database:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
  
  
};

module.exports = cities;
