import Button from "../Button";
import LoginBgLight from "../../assets/login-bg-light.svg";

const SubscriptionDeck = () => {
    return (
        <div className="bg-[#6badff52] p-4 rounded-lg flex flex-col items-center gap-4">
            <h1 className="font-bold text-lg">My Subscriptions</h1>

            {/* subscription card carocell */}
            <div className="w-full overflow-x-scroll snap-mandatory	snap-x">
                <ul className="w-[40rem] h-40 flex gap-1">
                    <li className="bg-[#7c2cff] text-white w-[17rem] h-full snap-start rounded-lg p-1 border-4 border-purple-400"
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
                    </li>

                </ul>
            </div>
        </div>
    )
}

export default SubscriptionDeck;