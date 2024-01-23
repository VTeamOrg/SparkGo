import { FaHashtag } from "react-icons/fa6";
import Button from "../Button";
import { memo, useEffect, useState } from "react";
import useVehicle from "../../hooks/useVehicle";
import { computed, effect, useSignalEffect } from "@preact/signals-react";
import { userDataStore, vehicleStore } from "../../GStore";
/**
 * Represents a memoized component displaying the battery level.
 * @param {object} props - The props for the BatteryComponent.
 * @param {number} props.level - The battery level percentage.
 * @returns {JSX.Element} - Returns the JSX for the BatteryComponent.
 */
export const BatteryComponent = memo(({ level }) => {
    return (
        <div className="h-7 w-4 flex flex-col items-center relative">
            <div className='h-1 w-2 bg-accent-1 overflow-hidden'></div>
            <div className="bg-accent-1 h-full w-full relative rounded-sm">
                <div
                    className="text-accent-1 rounded-sm w-full absolute bottom-0"
                    style={{ height: `${level}%` }}
                ></div>
            </div>
        </div>
    );
});

BatteryComponent.displayName = "BatteryComponent";

/**
 * Represents a component displaying vehicle information in a message container.
 * @param {object} props - The props for the VehicleMsgContainer.
 * @param {string} props.vehicleId - The unique identifier of the vehicle.
 * @param {number} props.batteryLevel - The battery level of the vehicle.
 * @param {number} props.cost - The cost per minute of using the vehicle.
 * @param {number} props.unlockFee - The fee to unlock the vehicle.
 * @param {string} props.currency - The currency used for cost and unlock fee.
 * @returns {JSX.Element} - Returns the JSX for the VehicleMsgContainer.
 */
const VehicleMsgContainer = ({
    vehicleId,
    batteryLevel
}) => {

    const vehicle = useVehicle(vehicleId);
    const vehicleData = computed(() => vehicleStore.value.find(vehicle => vehicle.id === vehicleId));
    const rentedVehicle = computed(() => userDataStore.value.rentedVehicle);
    const [vehiclePrices, setVehiclePrices] = useState(null);

    const getVehiclePrices = async ()=> {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/vehiclePrice/${vehicleData.value.typeId}`);
        const data = await res.json();
        setVehiclePrices(data.data);
    };

    useEffect(()=> {
        // get vehicle price
        if (!vehicleData.value) return;
        getVehiclePrices();

        return () => {
            // cleanup
        }

    }, [vehicleData.value]);

    return (
        vehiclePrices &&
        <div className="flex gap-4 justify-center flex-col items-center">
            <div className="flex items-center justify-around h-full w-full">
                <div className="flex gap-1 font-bold font-mono text-xl items-center">
                    <FaHashtag className="text-accent-1 text-2xl" />
                    <span className="text-text_color-2">{vehicleId}</span>
                </div>
                <div className="flex gap-1 font-bold font-mono text-xl items-center">
                    <BatteryComponent level={batteryLevel} />
                    <span className="text-text_color-2">{batteryLevel}%</span>
                </div>
            </div>

            <div className="flex flex-col w-full bg-primary rounded-lg p-4 text-white gap-2">
                <div className="flex justify-between text-text_color-2">
                    <p className="font-bold">Unlock fee</p>
                    <p>{vehiclePrices.unlock} SEK</p>
                </div>
                <div className="flex justify-between text-text_color-2">
                    <p className="font-bold">Per Minute</p>
                    <p>{vehiclePrices.minute} SEK</p>
                </div>
            </div>

            <Button className="flex justify-center text-accent-1 font-bold w-9/12" onClick={async ()=> await vehicle.rentVehicle()}>
                Rent {rentedVehicle.value === vehicleId ? "out" : ""}
            </Button>
        </div>
    );
};

export default VehicleMsgContainer;
