import { Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
import websocketService from "./services/websocketService";
import { appSettingsStore, userDataStore, vehicleStore } from "./GStore";
import { useEffect } from "react";
import Checkout from "./pages/Checkout";

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

            if (!data) {
                console.error("Error fetching online vehicles:", res);
                return;
            }

            // create a new array with the data we need
            const sanitizedData = data.map(item => {
                const { id, type_id, currentSpeed, maxSpeed, battery, position, isStarted } = item;

                const updatedVehicleData = {
                    id,
                    typeId: type_id,
                    isStarted,
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

    const getUserRentedVehicle = async () => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/vehicles/rented/1", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const res = await response.json();

            const data = res;

            if (!data) {
                console.error("Error fetching user rented vehicle:");
                return;
            }

            const { vehicleId } = data;

            if (vehicleId === -1) return
            userDataStore.value = { ...userDataStore.value, rentedVehicle: vehicleId };

        } catch (error) {
            console.error("Error fetching user rented vehicle:", error);
        }
    }

    useEffect(() => {
        getOnlineVehicles();
        websocketService.connect();
        getUserRentedVehicle();

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
                <Route path="/checkout" element={<Checkout />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>

        </>

    );
}

export default App;