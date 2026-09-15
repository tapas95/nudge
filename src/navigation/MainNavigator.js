import { useTheme } from "@/theme/ThemeContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewChat from "@/screens/NewChat";
import ChatScreen from '@/screens/ChatScreen';
import Profile from '@/screens/Profile';
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator();

export default function MainNavigator(){
    const { theme } = useTheme();
    return(
        <Stack.Navigator
            screenOptions={ {
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: {
                    backgroundColor: theme.colors.background
                },
            } }
        >
            {/* <Stack.Screen name="Home" component={ Home } /> */}
            <Stack.Screen name="MainTabs" component={ BottomTabNavigator } />
            <Stack.Screen name="NewChatModal" component={ NewChat } />
            <Stack.Screen name="ChatScreen" component={ ChatScreen } />
            <Stack.Screen name="Profile" component={ Profile } />
        </Stack.Navigator>
    )
}