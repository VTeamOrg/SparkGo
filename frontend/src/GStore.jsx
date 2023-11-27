import { effect, signal } from "@preact/signals-react";
import { useCookies } from "react-cookie";
import MsgBox, { msgBoxData } from "./components/msgBox/MsgBox";

export const app_dark = signal(false);

const GStore = () => {
    effect(() => {
        // init dark mode
        const [cookies] = useCookies();
        app_dark.value = cookies.app_dark ?? false;
    });

    return (
        <>
            <MsgBox />
        </>
    );
}

export default GStore;
