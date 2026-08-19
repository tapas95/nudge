import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from "@/theme/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import RootNavigator from '@/navigation';

SplashScreen.preventAutoHideAsync();

function ThemedStatusBar() {
  const { isDarkMode } = useTheme();
  return <StatusBar style={ isDarkMode ? 'light' : 'dark' } />;
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
            <ThemedStatusBar />
            <RootNavigator />
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