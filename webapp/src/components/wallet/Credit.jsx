import { PiWalletBold } from "react-icons/pi";
import { PiPlusBold } from "react-icons/pi";
import Button from "../Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Credit = () => {
    const [credit, setCredit] = useState(0);
    const navigate = useNavigate();

    const getCredit = async () => {
        const response = await fetch("http://localhost:3000/v1/wallet/1", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        setCredit(data?.credits);
        return;
    }

    const handleTopUp = () => {
        return navigate("/checkout?paymentType=payment&paymentValue=any");
    }

    useEffect(() => {
        getCredit();
    } , []);


    return (
        <div className="bg-[#6badff52] p-4 rounded-lg flex flex-col items-center gap-4">
            <div className="flex justify-between items-center w-full font-bold">
                <div className="flex items-center">
                    <PiWalletBold className="text-4xl text-accent-1" />
                    <p className="text-lg font-normal text-text_color-2">My Wallet</p>
                </div>
                <div className="text-2xl font-bold text-text_color-2">
                    {credit} sek
                </div>
            </div>
            <Button className="px-2 py-2 !bg-black text-white w-32 border-0" onClick={handleTopUp}>
                <PiPlusBold className="text-accent-1 absolute text-2xl" />
                <p className="text-sm block w-full">Top Up</p>
            </Button>
        </div>
    )
}

export default Credit;
