import useDarkMode from "../hooks/useDarkMode";
// import Map from "../components/maps/Map";
import { app_dark } from "../GStore";
import MapBox from "../components/maps/MapBox";

/**
 * Home Page
 */

const Home = () => {
    const [darkMode, toggleDarkMode] = useDarkMode();
    return (
        <>
            {/* <div className="flex flex-col p-16 items-center gap-10">
                <h1 className="text-primary font-bold text-2xl">React Signal DEMO</h1>
                <Button onClick={() => count.value++}>Signal Count: {count.value}</Button>
                <p>Double is {double}</p>
            </div> */}

            {/* <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" onChange={()=>toggleDarkMode()} checked={app_dark.value}/>
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label> */}
            
            <MapBox />
        </>
    );
}

export default Home;
