import { effect } from '@preact/signals-react';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { app_dark } from '../GStore';

const useDarkMode = () => {
    const [cookies, setCookie] = useCookies(['app_dark']);

    const toggleDarkMode = () => {
        app_dark.value = !app_dark.value;
        setCookie("app_dark", app_dark.value);
    };

    return [app_dark.value, toggleDarkMode];
};

export default useDarkMode;