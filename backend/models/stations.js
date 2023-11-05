const fetch = require("node-fetch");

const stations = {
    getStationNames: async function getStationNames(req, res) {
        const query = `<REQUEST>
            <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
            <QUERY objecttype="TrainStation" schemaversion="1.0">
                <INCLUDE>LocationSignature</INCLUDE>
                <INCLUDE>AdvertisedLocationName</INCLUDE>
            </QUERY>
        </REQUEST>`;

        const response = await fetch(
            "https://api.trafikinfo.trafikverket.se/v2/data.json",
            {
                method: "POST",
                body: query,
                headers: { "Content-Type": "text/xml" },
            }
        );

        const result = await response.json();

        const stationsData = result.RESPONSE.RESULT[0].TrainStation.map(
            (station) => ({
                LocationSignature: station.LocationSignature,
                AdvertisedLocationName: station.AdvertisedLocationName,
            })
        );

        return res.json({
            data: stationsData,
        });
    },
};

module.exports = stations;
