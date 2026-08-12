import { StatusBar } from 'expo-status-bar';
import { Text, View, ActivityIndicator } from 'react-native';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import Login from './screens/Login';
import { AuthProvider, useAuth } from './src/context/AuthContext';

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
      { isAuthenticated ? ( <Login /> ) : ( <Login /> ) }
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
