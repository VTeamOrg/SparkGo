import { effect, signal } from "@preact/signals-react";
import { useCookies } from "react-cookie";

export const app_dark = signal(false);

const GStore = ()=> {
    effect(()=> {
        // init dark mode
        const [cookies] = useCookies();
        app_dark.value = cookies;
    });

    return;
}

export default GStore;

