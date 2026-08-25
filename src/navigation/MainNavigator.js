import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTheme } from "@/theme/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import Home from "@/screens/Home";
import NewChat from "@/screens/NewChat";

const Stack = createNativeStackNavigator();

export default function MainNavigator(){
    const { theme } = useTheme();
    const { user } = useAuth();
    console.log(user);
    return(
        <Stack.Navigator
            screenOptions={ {
                headerShown: true
            } }
        >
            <Stack.Screen
                name="Home"
                component={ Home }
                options={ () => ( {
                    headerTitle: 'Nudge',
                    headerTitleAlign: 'center',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: theme.colors.background },
                    headerTitleStyle: {
                        fontFamily: theme.typography.fontFamily.bold,
                        color: theme.colors.text,
                        fontSize: 20,
                        lineHeight: 26
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                            activeOpacity={ 0.75 }
                        >
                            <View style={ styles.userContainer }>
                                <View style={ [
                                    styles.userAvatarContainer,
                                    {
                                        borderColor: theme.colors.accent
                                    }
                                ] }>
                                    <Image
                                        source={ { uri: user?.avatarUrl } }
                                        width={ 32 }
                                        height={ 32 }
                                        resizeMode="cover"
                                        style={ styles.userAvatar }
                                    />
                                    <View style={ [
                                        styles.currentStatus,
                                        {
                                            backgroundColor: user.isOnline ? theme.colors.success : theme.colors.danger
                                        }
                                    ] }></View>
                                </View>
                                <Text
                                    style={ [
                                        styles.username,
                                        {
                                            fontFamily: theme.typography.fontFamily.bold,
                                            color: theme.colors.text
                                        }
                                    ] }
                                >
                                    Hi, { user?.displayName?.split( ' ' )[ 0 ] }
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                            activeOpacity={ 0.75 }
                        >
                            <Ionicons name="ellipsis-vertical-sharp" size={ 20 } color={ theme.colors.textSecondary } />
                        </TouchableOpacity>
                    )
                } ) }
            ></Stack.Screen>
            <Stack.Screen
                name="NewChatModal"
                component={ NewChat }
                options={ {
                    headerTitle: 'Select Contact',
                    headerBackTitleVisible: false,
                } }
            />
        </Stack.Navigator>
    )
}

const styles = StyleSheet.create( {
    userContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    userAvatarContainer:{
        borderWidth: 2,
        borderStyle: 'solid',
        borderRadius: 32,
        position: 'relative'
    },
    userAvatar:{
        borderRadius: 32,
    },
    currentStatus:{
        width: 8,
        height: 8,
        borderRadius: 8,
        position: 'absolute',
        right: 0,
        bottom: 0,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ffffff'
    },
    username:{
        fontSize: 16,
        lineHeight: 22
    },
} );