import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import { IoScan } from "react-icons/io5";
import { PiWalletFill } from "react-icons/pi";
import { userDataStore } from "../../GStore";
import RentedVehiclePanel from "../maps/RentedVehiclePanel";




const Navbar = ({ view, setView }) => {
    const [toggleActiveVehicleState, setToggleActiveVehicleState] = useState(false);

    const handleFindLocation = () => {
        if (view !== "map") {
            return setView("map");
        }

        const mapboxLocationBtn = document.querySelector('.mapboxgl-ctrl-geolocate');
        mapboxLocationBtn.click();

    }
    const toggleActiveVehicle = () => {
        setToggleActiveVehicleState(!toggleActiveVehicleState);
        console.log(toggleActiveVehicleState);
        if (view !== "map") {
            return setView("map");
        }

    }
    return (
        <>
            {
                toggleActiveVehicleState && <RentedVehiclePanel />
            }
            <nav className="fixed bottom-0 left-0 w-full flex justify-between px-4 py-2 z-10">
                <button onClick={handleFindLocation} className="h-16 w-16 rounded-full bg-bg_color-1 text-accent-1 flex justify-center items-center text-2xl shadow-lg shadow-shadow_color-1">
                    <FaLocationArrow />
                </button>

                {
                    !userDataStore.value.rentedVehicle &&
                    <button className="h-16 w-2/4 rounded-full bg-bg_color-1 text-text_color-1 font-bold flex justify-center items-center gap-2 p-1 shadow-lg shadow-shadow_color-1" onClick={() => setView("scanner")}>
                        <IoScan className="text-accent-1 text-3xl" />
                        <p className="text-base">Scan & Ride</p>
                    </button>
                }

                {
                    userDataStore.value.rentedVehicle &&
                    <button className="h-16 w-2/4 rounded-full bg-bg_color-1 text-text_color-1 font-bold flex justify-center items-center gap-2 p-1 shadow-lg shadow-shadow_color-1" onClick={toggleActiveVehicle}>
                        <p className="text-base">Active Vehicle</p>
                    </button>
                }

                <button className="h-16 w-16 rounded-full bg-bg_color-1 text-accent-1 flex justify-center items-center text-3xl shadow-lg shadow-shadow_color-1" onClick={() => setView("wallet")}>
                    <PiWalletFill />
                </button>

            </nav>
        </>
    );
}

export default Navbar;