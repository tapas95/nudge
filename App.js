import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { ThemeProvider, useTheme } from "@/theme/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Home from "@/screens/Home";
import Login from "@/screens/Login";

function MainNavigator() {
  const { user, isAuthenticated, initializing } = useAuth();
  const { theme, isDarkMode } = useTheme();
  if ( initializing ) {
    return (
      <View>
        <ActivityIndicator size="large" color={ theme.colors.primary } />
      </View>
    );
  }
  return (
    <>
      <StatusBar style={ isDarkMode ? 'light' : 'dark' } />
      { isAuthenticated ? ( <Home /> ) : ( <Login /> ) }
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
