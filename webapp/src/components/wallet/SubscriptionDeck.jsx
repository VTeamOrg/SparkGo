import Button from "../Button";
import LoginBgLight from "../../assets/login-bg-light.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SubscriptionDeck = () => {

    const [plans, setPlans] = useState([]);
    const [activePlan, setActivePlan] = useState(null);
    const navigate = useNavigate();

    const planFrequencies = {
        1: "week",
        2: "month",
        3: "year",
    }

    const colorById = {
        1: "bg-accent-1",
        2: "bg-[#7c2cff]",
        3: "bg-[#bd6dc6]",
    }

    const getAllPlans = async () => {
        const response = await fetch("http://localhost:3000/v1/plans", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        const dataFiltered = data.data.filter(plan => plan.id !== 4);
        setPlans(dataFiltered);
        return;
    }

    const getActivePlan = async () => {
        const response = await fetch("http://localhost:3000/v1/activePlan/memberid/1", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        setActivePlan(data.data);
        return;
    }

    const handleChangePlan = async (planId) => {
        navigate("/checkout?paymentType=subscription&paymentValue=" + planId);
    }

    const handleCancelPlan = async () => {
        const response = await fetch("http://localhost:3000/v1/subscription/cancel/1", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        setActivePlan(null);
        return;
    }


    useEffect(() => {
        getAllPlans();
        getActivePlan();
    }
        , []);

    return (
        <div className="bg-[#6badff52] p-4 rounded-lg flex flex-col items-center gap-4">
            <h1 className="font-bold text-lg">My Subscriptions</h1>

            {/* subscription card carocell */}
            <div className="w-full overflow-x-scroll snap-mandatory	snap-x">
                <ul className={`h-40 flex gap-1`} style={{width: `${plans.length * 20}rem`}}>
                    {
                        activePlan && (
                            <li key={activePlan.plan_id} className={`text-white w-[17rem] h-full snap-start rounded-lg p-1 border-4 border-transparent ${colorById[activePlan.plan_id]}`}
                                    style={{
                                        backgroundImage: `url(${LoginBgLight})`,
                                        backgroundSize: "200%",
                                        backgroundBlendMode: "multiply",
                                    }}>
                                    <div className="flex gap-3 flex-col">
                                        <div className="flex flex-row justify-between">
                                            <div>
                                                <h1 className="text-base font-bold">{activePlan.plan_name}</h1>
                                                <p className="text-sm leading-3">{activePlan.plan_price} SEK/{planFrequencies[activePlan.plan_frequency]}</p>
                                            </div>
                                            <span className="text-xs w-24 flex text-white text-opacity-50 text-right">Next Payment 1/2/24</span>
                                        </div>
                                        <ul className="text-sm ml-4 list-disc">
                                            <li><span className="font-bold">{activePlan.available_minutes == -1 ? "Unlimited" : activePlan.available_minutes}</span> left</li>
                                            <li><span className="font-bold">{activePlan.available_unlocks == -1 ? "Unlimited" : activePlan.available_unlocks}</span> left</li>
                                        </ul>
                                        <Button className="py-1 w-fit !bg-black" onClick={handleCancelPlan}>
                                            cancel
                                        </Button>
                                    </div>
                                </li>
                        )
                    }
                    {
                        plans?.filter(plan => plan.id !== activePlan?.plan_id).map(plan => {
                            return (
                                <li key={plan.id} className={`text-white w-[17rem] h-full snap-start rounded-lg p-1 border-4 border-transparent ${colorById[plan.id]}`}
                                    style={{
                                        backgroundImage: `url(${LoginBgLight})`,
                                        backgroundSize: "200%",
                                        backgroundBlendMode: "multiply",
                                    }}>
                                    <div className="flex gap-3 flex-col">
                                        <div className="flex flex-row justify-between">
                                            <div>
                                                <h1 className="text-base font-bold">{plan.title}</h1>
                                                <p className="text-sm leading-3">{plan.price} SEK/{planFrequencies[plan.price_frequency_id]}</p>
                                            </div>
                                            <span className="text-xs w-24 flex text-white text-opacity-50 text-right">Next Payment 1/2/24</span>
                                        </div>
                                        <ul className="text-sm ml-4 list-disc">
                                            <li>{plan.included_minutes == -1 ? "Unlimited" : plan.included_minutes} included minutes</li>
                                            <li>{plan.included_unlocks == -1 ? "Unlimited" : plan.included_unlocks} included unlocks</li>
                                        </ul>
                                        <Button className="py-1 w-fit !bg-black" onClick={()=>handleChangePlan(plan.id)}>
                                            Activate
                                        </Button>
                                    </div>
                                </li>
                            )
                        }
                        )

                    }
                    {/* <li className="bg-[#7c2cff] text-white w-[17rem] h-full snap-start rounded-lg p-1 border-4 border-purple-400"
                        style={{
                            backgroundImage: `url(${LoginBgLight})`,
                            backgroundSize: "200%",
                            backgroundBlendMode: "multiply",
                        }}>
                        <div className="flex gap-3 flex-col">
                            <div className="flex flex-row justify-between">
                                <div>
                                    <h1 className="text-lg font-bold">Monthly Pass</h1>
                                    <p className="text-sm leading-3">50.00 SEK/week</p>
                                </div>
                                <span className="text-xs w-24 flex text-white text-opacity-50 text-right">Next Payment 1/2/24</span>
                            </div>
                            <ul className="text-sm ml-4 list-disc">
                                <li><span className="text-accent-1 font-bold">93</span> left of 100 included minutes</li>
                                <li><span className="text-accent-1 font-bold">35</span> left of 50 included unlocks</li>
                            </ul>
                            <Button className="py-1 w-fit !bg-black">Cancel</Button>
                        </div>
                    </li>

                    <li className="bg-[#bd6dc6] text-white w-[17rem] h-full snap-start rounded-lg p-1 border-4 border-transparent"
                        style={{
                            backgroundImage: `url(${LoginBgLight})`,
                            backgroundSize: "200%",
                            backgroundBlendMode: "multiply",
                        }}>
                        <div className="flex gap-3 flex-col">
                            <div className="flex flex-row justify-between">
                                <div>
                                    <h1 className="text-lg font-bold">Monthly Pass</h1>
                                    <p className="text-sm leading-3">50.00 SEK/week</p>
                                </div>
                                <span className="text-xs w-24 flex text-white text-opacity-50 text-right">Next Payment 1/2/24</span>
                            </div>
                            <ul className="text-sm ml-4 list-disc">
                                <li><span className="text-accent-1 font-bold">93</span> left of 100 included minutes</li>
                                <li><span className="text-accent-1 font-bold">35</span> left of 50 included unlocks</li>
                            </ul>
                            <Button className="py-1 w-fit">Activate</Button>
                        </div>
                    </li> */}

                </ul>
            </div>
        </div>
    )
}

export default SubscriptionDeck;