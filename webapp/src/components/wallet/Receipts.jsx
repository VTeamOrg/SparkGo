import { useEffect, useState } from "react";

const Receipts = () => {
    const [receipts, setReceipts] = useState([]);

    const dateToStr = (date) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString();
    }

    const getAllReceipts = async () => {
        const response = await fetch("http://localhost:3000/v1/receipts/memberid/1", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        setReceipts(data.data);
    }

    useEffect(() => {
        getAllReceipts();
    }, []);

    return (
        <div className="bg-[#6badff52] p-4 rounded-lg flex flex-col items-center gap-4">
            <h1 className="font-bold text-lg">My Receipts</h1>

            <ul className="w-full flex flex-col gap-5">
                {
                    receipts && receipts.map(receipt => {
                        return (
                            <li key={receipt.id} className="w-full flex justify-between">
                                <div className="flex gap-2">
                                    <div className={`w-8 h-8 bg-indigo-600 rounded-full`}></div>
                                    <div className="flex flex-col">
                                        <h1 className="font-bold">{receipt.receipt_details}</h1>
                                        <p className="text-sm">{receipt.sum}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-right">
                                    <p className="text-sm">{dateToStr(receipt.payment_date)}</p>
                                    <p className="text-accent-1 font-bold">-{receipt.sum}</p>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default Receipts;
