import { curr_theme } from '../GStore';

const useDarkMode = () => {
    const toggleDarkMode = () => {
        const next_theme = curr_theme.value === "light" ? "dark" : "light";
        curr_theme.value = next_theme;
        
        document.documentElement.setAttribute("data-theme", next_theme);
        
        localStorage.setItem("theme", next_theme);
    };

    return [curr_theme, toggleDarkMode];
};

export default useDarkMode;
