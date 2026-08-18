import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from "@/theme/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Home from "@/screens/Home";
import Login from "@/screens/Login";

SplashScreen.preventAutoHideAsync();

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
    <SafeAreaView style={ [ styles.appWrapper, { backgroundColor: theme.colors.background, paddingHorizontal: theme.spacing.lg } ] }>
      <StatusBar style={ isDarkMode ? 'light' : 'dark' } />
      { isAuthenticated ? ( <Home /> ) : ( <Login /> ) }
    </SafeAreaView>
  );
}

export default function App() {
  const [ fontsLoaded ] = useFonts( {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  } );
  useEffect( () => {
    if ( fontsLoaded ) {
      SplashScreen.hideAsync();
    }
  }, [ fontsLoaded ] );
  if ( !fontsLoaded ) {
    return null; // Keep native splash screen showing while loading fonts
  }
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <MainNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create( {
  appWrapper: {
    flex: 1,
  }
} );