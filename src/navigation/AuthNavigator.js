import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@/theme/ThemeContext";
import Login from "@/screens/Login";
import Register from "@/screens/Register";
import ForgotPassword from "@/screens/ForgotPassword";

const Stack = createNativeStackNavigator();

export default function AuthNavigator(){
    const { theme } = useTheme();
    return(
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={ {
                headerShown: false,
                contentStyle:{
                    backgroundColor: theme.colors.background,
                    paddingHorizontal: theme.spacing.lg,
                }
            } }
        >
            <Stack.Screen name="Login" component={ Login }></Stack.Screen>
            <Stack.Screen name="Register" component={ Register }></Stack.Screen>
            <Stack.Screen name="ForgotPassword" component={ ForgotPassword }></Stack.Screen>
        </Stack.Navigator>
    )
}