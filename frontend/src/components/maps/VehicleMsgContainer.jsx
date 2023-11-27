import { app_dark } from "../../GStore";
import { FaHashtag } from "react-icons/fa6";
import BatteryComponent from "../Battery/Battery";
import Button from "../Button";


const VehicleMsgContainer = ({vehicleId, batteryLevel, cost, unlockFee, currency}) => {
    return (
        <div className="flex gap-4 justify-center flex-col items-center">
            <div className="flex items-center justify-around h-full w-full">
                <div className="flex gap-1 font-bold font-mono text-xl items-center">
                    <FaHashtag  className="text-primary text-2xl"/>
                    SC-100
                </div>
                <div className="flex gap-1 font-bold font-mono text-xl items-center">
                    <BatteryComponent level={85}/>
                    85%
                </div>
            </div>

            <div className="flex flex-col w-full bg-primary rounded-lg p-4 text-white gap-2">
                <div className="flex justify-between">
                    <p className="font-bold">Unlock fee</p>
                    <p>5.00SEK</p>
                </div>
                <div className="flex justify-between">
                    <p className="font-bold">Per Minute</p>
                    <p>2.00SEK</p>
                </div>
            </div>

            <Button className="flex justify-center text-primary font-bold w-9/12">Scan & Ride</Button>
        </div>
    );
}

export default VehicleMsgContainer;