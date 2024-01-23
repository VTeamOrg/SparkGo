// import useDarkMode from "../hooks/useDarkMode";
import { useEffect, useState } from "react";
import MapBox from "../components/maps/MapBox";
import Scanner from "../components/scanner";
import Navbar from "../components/navbar";
import Wallet from "../components/wallet";
/**
 * Home Page
 */

const Home = ({view}) => {

    const [toView, setView] = useState(view); // ["map", "wallet", "scanner"]
    const [renderView, setRenderView] = useState(<MapBox />);

    useEffect(() => {
        if (toView === "map") {
            setRenderView(<MapBox />);
        } else if (toView === "wallet") {
            setRenderView(<Wallet />);
        } else if (toView === "scanner") {
            setRenderView(<Scanner />);
        }
    }, [toView]);
    
    
    return (
        <>
            {renderView}
            <Navbar setView = {setView} view = {toView}/>
        </>
    );
}

export default Home;
