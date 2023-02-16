import React, { useContext, PropsWithChildren, useState, useLayoutEffect } from "react";

interface ThemeContextType {
    dark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType>({} as ThemeContextType);

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: PropsWithChildren) {
    let prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedPreference = localStorage.getItem("prefersDarkMode");
    if (storedPreference) {
        prefersDark = JSON.parse(storedPreference) as boolean;
    }
    const [dark, setDark] = useState(prefersDark);
    useLayoutEffect(() => {
        if (dark) {
            localStorage.setItem("prefersDarkMode", "true");
            document.body.classList.add("dark");
        } else {
            localStorage.setItem("prefersDarkMode", "false");
            document.body.classList.remove("dark");
        }
    }, [dark]);

    function toggleTheme() {
        setDark((dark) => !dark);
    }
    const value = {
        dark,
        toggleTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
