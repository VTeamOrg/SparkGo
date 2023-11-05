const fetch = require("node-fetch");
const EventSource = require("eventsource");
require("dotenv").config();

const delayedTrainsMap = new Map();

async function fetchTrainPositions(io) {
    try {
        const delayedNumbersURL =
            "https://jsramverk-train-adde22anbx22.azurewebsites.net/delayed";
        const delayedNumbersResponse = await fetch(delayedNumbersURL);
        const delayedNumbers = await delayedNumbersResponse.json();

        const stationsURL =
            "https://jsramverk-train-adde22anbx22.azurewebsites.net/stations";
        const stationsResponse = await fetch(stationsURL);
        const stations = await stationsResponse.json();

        const stationsData = stations.data || [];

        // Transform the stations array into an object with LocationSignature as keys
        const stationsObject = {};

        stationsData.forEach((station) => {
            stationsObject[station.LocationSignature] =
                station.AdvertisedLocationName;
        });

        function translateStationSignature(signature) {
            const translatedName = stationsObject[signature];

            if (translatedName) {
                return translatedName;
            } else {
                return signature;
            }
        }

        delayedNumbers.data.forEach((data) => {
            delayedTrainsMap.set(data.OperationalTrainNumber, data);
        });

        const filters = delayedNumbers.data.map(
            (data) =>
                `<EQ name='Train.OperationalTrainNumber' value="${data.OperationalTrainNumber}" />`
        );
        const filterQuery = `<FILTER>\n<OR>\n${filters.join(
            "\n"
        )}\n</OR>\n</FILTER>`;

        const query = `<REQUEST>
    <LOGIN authenticationkey="${process.env.TRAFIKVERKET_API_KEY}" />
    <QUERY sseurl="true" namespace="järnväg.trafikinfo" objecttype="TrainPosition" schemaversion="1.0" limit="1">
        ${filterQuery}
    </QUERY>
</REQUEST>`;

        const trainPositions = {};

        const response = await fetch(
            "https://api.trafikinfo.trafikverket.se/v2/data.json",
            {
                method: "POST",
                body: query,
                headers: { "Content-Type": "text/xml" },
            }
        );
        const result = await response.json();
        console.log(
            "Train positions fetched successfully: ",
            JSON.stringify(result, null, 2)
        );
        const sseurl = result.RESPONSE.RESULT[0].INFO.SSEURL;

        const eventSource = new EventSource(sseurl);

        eventSource.onopen = function () {
            console.log("Connection to server opened.");
        };

        io.on("connection", (socket) => {
            console.log("a user connected");

            eventSource.onmessage = function (e) {
                try {
                    const parsedData = JSON.parse(e.data);

                    if (parsedData) {
                        const changedPosition =
                            parsedData.RESPONSE.RESULT[0].TrainPosition[0];

                        const matchCoords = /(\d*\.\d+|\d+),?/g;

                        const position = changedPosition.Position.WGS84.match(
                            matchCoords
                        )
                            .map((t) => parseFloat(t))
                            .reverse();

                        const trainNumber =
                            changedPosition.Train.AdvertisedTrainNumber;

                        if (delayedTrainsMap.has(trainNumber)) {
                            const delayedData =
                                delayedTrainsMap.get(trainNumber);

                            const trainObject = {
                                activityId: delayedData.ActivityId,
                                trainnumber: trainNumber,
                                position: position,
                                timestamp: changedPosition.TimeStamp,
                                bearing: changedPosition.Bearing,
                                status: !changedPosition.Deleted,
                                speed: changedPosition.Speed,
                                FromLocation: delayedData.FromLocation
                                    ? translateStationSignature(
                                          delayedData.FromLocation[0]
                                              .LocationName
                                      )
                                    : "N/A",
                                ToLocation: delayedData.ToLocation
                                    ? translateStationSignature(
                                          delayedData.ToLocation[0].LocationName
                                      )
                                    : "N/A",
                                LocationSignature: translateStationSignature(
                                    delayedData.LocationSignature
                                ),
                                AdvertisedTimeAtLocation:
                                    delayedData.AdvertisedTimeAtLocation,
                                EstimatedTimeAtLocation:
                                    delayedData.EstimatedTimeAtLocation,
                            };

                            socket.emit("message", trainObject);

                            trainPositions[trainNumber] = trainObject;
                        }
                    }
                } catch (e) {
                    console.log(e);
                }

                return;
            };
        });

        eventSource.onerror = function (e) {
            console.log("EventSource failed.");
        };
    } catch (error) {
        console.error("Error fetching train positions:", error);
    }
}

module.exports = fetchTrainPositions;
