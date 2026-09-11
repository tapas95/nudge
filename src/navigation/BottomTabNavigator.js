import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from '@/theme/ThemeContext';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Home from "@/screens/Home";
import NewChat from '@/screens/NewChat';
import Profile from '@/screens/Profile';

const BottomTabs = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    // console.log(insets);
    return(
        <BottomTabs.Navigator
            screenOptions={ ( { route } ) => ( { 
                headerShown: false,
                animation: 'shift',
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarActiveBackgroundColor: theme.colors.primaryMuted,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    backgroundColor: theme.colors.headerBackground,
                    // paddingTop: 8,
                    paddingBottom: insets.bottom,
                    height: Platform.OS === 'android' ? 73 : 65,
                    borderTopColor: theme.colors.border
                },
                tabBarItemStyle: {
                    
                 },
                tabBarLabelStyle: {
                    fontFamily: theme.typography.fontFamily.semibold,
                    fontSize: 14,
                },
                tabBarIcon: ( { focused, color = theme.colors.primary, size } ) => {
                    let iconName;
                    if( route.name === 'Home' ){
                        iconName = focused ? 'chat-processing' : 'chat-processing-outline';
                    } else if( route.name === 'Contacts' ){
                        iconName = focused ? 'contacts' : 'contacts-outline';
                    } else if( route.name === 'Profile' ){
                        iconName = focused ? 'account' : 'account-outline';
                    }
                    return <MaterialCommunityIcons name={ iconName } size={ size || 20 } color={ color } />
                }
             } ) }
        >
            <BottomTabs.Screen name='Profile' component={ Profile } options={ { tabBarLabel: 'Profile' } } />
            <BottomTabs.Screen name="Home" component={ Home } options={ { tabBarLabel: 'Chats' } } />
            <BottomTabs.Screen name='Contacts' component={ NewChat } options={ { tabBarLabel: 'Contacts' } } />
        </BottomTabs.Navigator>
    )
}
export default BottomTabNavigator;