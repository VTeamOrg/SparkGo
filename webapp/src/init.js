import { useEffect } from "react";
import { curr_theme, loadedVehicles } from "./GStore";
const Init = () => {
    // localStorage.setItem("theme", "dark");
    const theme = localStorage.getItem("theme") ?? "light";

    document.documentElement.setAttribute("data-theme", theme);

    curr_theme.value = theme;

    useEffect(() => {
        // get online vehicles
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
                    const { id, currentSpeed, maxSpeed, battery, position } = item;

                    console.log('position', position);

                    const updatedVehicleData = {
                        id,
                        battery,
                        currentSpeed,
                        maxSpeed,
                        lon: parseFloat(position.lon),
                        lat: parseFloat(position.lat),
                      };

                    return updatedVehicleData;
                    
                });
                loadedVehicles.value = [...sanitizedData];
            } catch (error) {
                console.error("Error fetching online vehicles:", error);
            }
        };

        getOnlineVehicles();


    }, []);

    return;
}

export default Init;
