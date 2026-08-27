import { useTheme } from "@/theme/ThemeContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@/screens/Home";
import NewChat from "@/screens/NewChat";
import ChatScreen from '@/screens/ChatScreen';

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
            <Stack.Screen name="Home" component={ Home } />
            <Stack.Screen name="NewChatModal" component={ NewChat } />
            <Stack.Screen name="ChatScreen" component={ ChatScreen } />
        </Stack.Navigator>
    )
}