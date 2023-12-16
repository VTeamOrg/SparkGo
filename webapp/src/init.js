import { curr_theme } from "./GStore";
const Init = () => {
    // localStorage.setItem("theme", "dark");
    const theme = localStorage.getItem("theme") ?? "light";

    document.documentElement.setAttribute("data-theme", theme);

    curr_theme.value = theme

    return;
}

export default Init;
