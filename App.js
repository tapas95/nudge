import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
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
    <SafeAreaProvider>
      <SafeAreaView style={ styles.appWrapper }>
        <ThemeProvider>
          <AuthProvider>
            <MainNavigator />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appWrapper: {
    flex: 1,
  },
});