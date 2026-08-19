import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from '@/theme/ThemeContext';
import AuthNavigator from "./AuthNavigator";
import Home from "@/screens/Home";

export default function RootNavigator(){
    const { isAuthenticated, initializing } = useAuth();
    const { theme, isDarkMode } = useTheme();
    const navigationTheme = {
        ...( isDarkMode ? DarkTheme : DefaultTheme ),
        colors: {
            ...( isDarkMode ? DarkTheme.colors : DefaultTheme.colors ),
            background: theme.colors.background
        }
    }
    if ( initializing ) {
        return (
            <View style={ [ styles.loading, { backgroundColor: theme.colors.background } ] }>
                <ActivityIndicator size="large" color={ theme.colors.primary } />
            </View>
        );
    }
    return(
        <NavigationContainer theme={ navigationTheme }>
            { isAuthenticated ? <Home /> : <AuthNavigator /> }
        </NavigationContainer>
    )
}

const styles = StyleSheet.create( {
    loading:{
        flex: 1
    }
} );