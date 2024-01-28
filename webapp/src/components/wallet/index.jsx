import { IoReturnUpBack } from "react-icons/io5";
import undraw_scooter from "../../assets/undraw_scooter.svg";
import Credit from "./Credit";
import SubscriptionDeck from "./SubscriptionDeck";
import Receipts from "./Receipts";


const Wallet = () => {
    return (
        <div className="bg-bg_color-2 w-full h-full">
            <div className="h-12 w-full flex items-center p-2 fixed z-10 left-0 top-0">
                <IoReturnUpBack className="text-3xl font-extrabold" />
            </div>
            {/* hero banner */}
            <div className="bg-accent-1 p-5 h-52 relative">
                <img src={undraw_scooter} alt="" className="absolute right-0 bottom-0 transform -scale-x-100" />
                <div className="w-48 h-full flex flex-col justify-center gap-1 relative z-1 text-white">
                    <h1 className="text-3xl font-bold">Spark Wallet</h1>
                    <p className="text-sm font-light italic">Get Rolling with Low-Cost Passes.</p>
                </div>
            </div>

            {/* content */}
            <div className="p-4 w-full h-full flex flex-col gap-4">
                {/* wallet credits */}
                <Credit />

                {/* subscriptions */}
                <SubscriptionDeck />

                {/* receipts */}
                <Receipts />
            </div>
        </div>
    )
}

export default Wallet;