import { PiWalletBold } from "react-icons/pi";
import { PiPlusBold } from "react-icons/pi";
import Button from "../Button";

const Credit = () => {
    return (
        <div className="bg-[#6badff52] p-4 rounded-lg flex flex-col items-center gap-4">
            <div className="flex justify-between items-center w-full font-bold">
                <div className="flex items-center">
                    <PiWalletBold className="text-4xl text-accent-1" />
                    <p className="text-lg font-normal text-text_color-2">My Wallet</p>
                </div>
                <div className="text-2xl font-bold text-text_color-2">
                    550.00 sek
                </div>
            </div>
            <Button className="px-2 py-2 !bg-black text-white w-32 border-0">
                <PiPlusBold className="text-accent-1 absolute text-2xl" />
                <p className="text-sm block w-full">Top Up</p>
            </Button>
        </div>
    )
}

export default Credit;
