const geoJsonData = require("../data/coords.json");

const coordController = {
    getGeoJson: function (req, res) {
        try {
            return res.json({
                data: geoJsonData,
            });
        } catch (error) {
            console.error("Error extracting GeoJSON:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getCities: function (req, res) {
        try {
            // Extract cities data from your GeoJSON based on the structure
            const citiesData = geoJsonData.features.filter(
                feature => feature.properties.name !== 'restrictid'
            )[0].geometry.coordinates.filter((polygon, index) => index !== 0) // Remove the first polygon (the one that covers the whole map);
            return res.json({
                data: citiesData,
            });
        } catch (error) {
            console.error("Error extracting cities:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },
}

module.exports = coordController;
