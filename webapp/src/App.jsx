import { Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useEffect } from "react";
import websocketService from "./services/websocketService";
import { appSettingsStore, vehicleStore } from "./GStore";

const App = () => {
    const theme = localStorage.getItem("theme") ?? "light";
    appSettingsStore.value = { style: theme };
    document.documentElement.setAttribute("data-theme", theme);

    const getOnlineVehicles = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/vehicles/active?forClient=true", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const res = await response.json();

            const data = res.data;

            // create a new array with the data we need
            const sanitizedData = data.map(item => {
                const { id, type_id, currentSpeed, maxSpeed, battery, position } = item;

                const updatedVehicleData = {
                    id,
                    typeId: type_id,
                    battery,
                    currentSpeed,
                    maxSpeed,
                    lon: parseFloat(position.lon),
                    lat: parseFloat(position.lat),
                };

                return updatedVehicleData;

            });
            vehicleStore.value = [...sanitizedData];
        } catch (error) {
            console.error("Error fetching online vehicles:", error);
        }
    };

    useEffect(() => {
        getOnlineVehicles();
        websocketService.connect();

        // return () => {
        //     websocketService.disconnect();
        // }
    }, []);

    return (
        <>
            <Routes>
                <Route path="/" element={<Home view="map" />} />
                <Route path="/wallet" element={<Home view="wallet" />} />
                <Route path="/scanner" element={<Home view="scanner" />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>

        </>

    );
}

export default App;
