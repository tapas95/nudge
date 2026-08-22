import { Text, TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@/theme/ThemeContext";
import Login from "@/screens/Login";
import Register from "@/screens/Register";
import ForgotPassword from "@/screens/ForgotPassword";
import VerifyOtp from "@/screens/VerifyOtp";
import Ionicons from '@expo/vector-icons/Ionicons';

const Stack = createNativeStackNavigator();

export default function AuthNavigator(){
    const { theme } = useTheme();
    return(
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={ {
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle:{
                    backgroundColor: theme.colors.background,
                    paddingHorizontal: theme.spacing.lg,
                }
            } }
        >
            <Stack.Screen name="Login" component={ Login }></Stack.Screen>
            <Stack.Screen
                name="Register"
                component={ Register }
                options={ ( { navigation } ) => ( {
                    headerShown: true,
                    headerTitle: 'Sign Up',
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: theme.colors.background },
                    headerTitleStyle: {
                        fontFamily: theme.typography.fontFamily.bold,
                        color: theme.colors.text,
                        fontSize: 16,
                        lineHeight: 22
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={ () => navigation.goBack() }
                            hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                            activeOpacity={ 0.75 }
                        >
                            <Ionicons name="arrow-back-outline" size={ 24 } color={ theme.colors.textSecondary } />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={ () => navigation.navigate( 'Login' ) }
                            hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                            activeOpacity={ 0.75 }
                        >
                            <Text
                                style={ {
                                    fontFamily: theme.typography.fontFamily.medium,
                                    color: theme.colors.primary,
                                    textTransform: 'uppercase',
                                    letterSpacing: .5
                                } }
                            >Login</Text>
                        </TouchableOpacity>
                    )
                } ) }
            ></Stack.Screen>
            <Stack.Screen
                name="ForgotPassword"
                component={ ForgotPassword }
                options={ ( { navigation } ) => ( {
                    headerShown: true,
                    headerTitle: 'Forgot Password',
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: theme.colors.background
                    },
                    headerTitleStyle: {
                        fontFamily: theme.typography.fontFamily.bold,
                        color: theme.colors.text,
                        fontSize: 16,
                        lineHeight: 22
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={ () => navigation.goBack() }
                            hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                            activeOpacity={ 0.75 }
                        >
                            <Ionicons name="arrow-back-outline" size={ 24 } color={ theme.colors.textSecondary } />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={ () => navigation.navigate( 'Login' ) }
                            hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                            activeOpacity={ 0.75 }
                        >
                            <Text
                                style={ {
                                    fontFamily: theme.typography.fontFamily.medium,
                                    color: theme.colors.primary,
                                    textTransform: 'uppercase',
                                    letterSpacing: .5
                                } }
                            >Login</Text>
                        </TouchableOpacity>
                    )
                } ) }
            ></Stack.Screen>
            <Stack.Screen name="VerifyOtp" component={ VerifyOtp } />
        </Stack.Navigator>
    )
}