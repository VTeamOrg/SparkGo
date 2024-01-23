import { computed, useSignalEffect } from "@preact/signals-react";
import { userDataStore, vehicleStore } from "../../GStore";
import { BatteryComponent } from "./VehicleMsgContainer";
import { FaHashtag } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Button from "../Button";
import useVehicle from "../../hooks/useVehicle";

const SpeedWidget = ({ currentSpeed, maxSpeed }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex items-center font-bold gap-1">
                <div style={{ fontSize: "3rem" }} className="text-accent-1 font-extrabold leading-3">{currentSpeed}</div>
                <div style={{ fontSize: "1.2rem" }} className="leading-6">
                    <div className="text-text_color-1">
                        Speed
                    </div>
                    <div className="text-text_color-1">
                        km/h
                    </div>
                </div>
            </div>
            <div className="text-red-500 leading-3 text-lg tracking-widest">Max: {maxSpeed} km/h</div>
        </div>
    );
}

const RentedVehiclePanel = () => {
    const rentedVehicleId = userDataStore.value.rentedVehicle;
    const vehicleFuncs = useVehicle(rentedVehicleId);
    const vehicle = computed(() => vehicleStore.value.find(vehicle => vehicle.id === rentedVehicleId));
    const [vehiclePrices, setVehiclePrices] = useState(null);
    const rideStated = computed(() => vehicle.value.isStarted);
    const getVehiclePrices = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/vehiclePrice/${vehicle.value.typeId}`);
        const data = await res.json();
        setVehiclePrices(data.data);
    };

    const togglePauseRide = async () => {
        console.log(rideStated.value);
        if (!rideStated.value) {
            vehicleFuncs.resumeRide();
        }
        vehicleFuncs.pauseRide();
    }

    const handleEndRide = async () => {
        vehicleFuncs.returnVehicle();
    }

    useEffect(() => {
        // get vehicle price
        if (!vehicle.value) return;
        getVehiclePrices();

        return () => {
            // cleanup
        }

    }, [vehicle.value]);

    return (
        vehicle.value && vehiclePrices &&
        <div className="bg-bg_color-1 fixed bottom-20 left-2/4 p-4 w-[calc(100%-2rem)] -translate-x-1/2 z-[10000] rounded-lg shadow-lg flex flex-col gap-2">
            <div className="flex items-center justify-between h-full w-full">
                <div className="flex gap-1 font-bold font-mono text-xl items-center">
                    <FaHashtag className="text-accent-1 text-2xl" />
                    <span className="text-text_color-2">{vehicle.value.id}</span>
                </div>
                <div className="flex gap-1 font-bold font-mono text-xl items-center">
                    <BatteryComponent level={vehicle.value.battery} />
                    <span className="text-text_color-2">{vehicle.value.battery}%</span>
                </div>
            </div>

            <SpeedWidget currentSpeed={vehicle.value.currentSpeed} maxSpeed={vehicle.value.maxSpeed} />

            <div className="flex flex-col w-full bg-primary rounded-lg p-4 text-white gap-2 bg-bg_color-2">
                <div className="flex justify-between text-text_color-2">
                    <p className="font-bold">Unlock fee</p>
                    <p>{vehiclePrices.unlock} SEK</p>
                </div>
                <div className="flex justify-between text-text_color-2">
                    <p className="font-bold">Per Minute</p>
                    <p>{vehiclePrices.minute} SEK</p>
                </div>
            </div>

            <div className="flex gap-4 content-end">
                {
                    rideStated.value ?
                        <Button className="flex-1 bg-yellow-300 justify-center !border-0" onClick={togglePauseRide}>
                            Pause Ride
                        </Button>
                        :
                        <Button className="flex-1 !bg-blue-500 text-white justify-center !border-0" onClick={togglePauseRide}>
                            Resume Ride
                        </Button>
                }

                <Button className="!bg-red-500 text-white justify-center !border-0" onClick={handleEndRide}>
                    End Ride
                </Button>
            </div>
        </div>
    );
}

export default RentedVehiclePanel;
