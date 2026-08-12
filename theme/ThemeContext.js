import { useState, createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "./theme";

const ThemeContext = createContext();

const ThemeProvider = ( { children } ) => {
    const systemTheme = useColorScheme();
    const [ isDarkMode, setIsDarkMode ] = useState( systemTheme === 'dark' );
    const theme = isDarkMode ? darkTheme : lightTheme;
    const toggleTheme = () => setIsDarkMode( prev => !prev );
    return (
        <ThemeContext.Provider value={ { theme, isDarkMode, toggleTheme } }>
            { children }
        </ThemeContext.Provider>
    );
}

const useTheme = () => {
    const context = useContext( ThemeContext );
    if ( !context ) {
        throw new Error( "useTheme must be used within a ThemeProvider" );
    }
    return context;
}

export { ThemeProvider, useTheme };