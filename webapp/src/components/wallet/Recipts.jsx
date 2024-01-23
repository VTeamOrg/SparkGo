const Receipts = () => {
    return (
        <div className="bg-[#6badff52] p-4 rounded-lg flex flex-col items-center gap-4">
            <h1 className="font-bold text-lg">My Receipts</h1>

            <ul className="w-full">
                <li className="w-full flex justify-between">
                    <div className="flex gap-2">
                        <div className="w-8 h-8 bg-[#7c2cff] rounded-full"></div>
                        <div className="flex flex-col">
                            <h1 className="font-bold">Monthly Pass</h1>
                            <p className="text-sm">50.00 SEK/Month</p>
                        </div>
                    </div>
                    <div className="text-sm text-right">
                        <p className="text-sm">1/2/24</p>
                        <p className="text-accent-1 font-bold">-50.00 SEK</p>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default Receipts;
