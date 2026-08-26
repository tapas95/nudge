import { useLayoutEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeContext";
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Ionicons from '@expo/vector-icons/Ionicons';

const ChatScreen = ( { route, navigation } ) => {
    const { chatId, recipient } = route.params || null;
    const { theme } = useTheme();
    const { user: currentUser } = useAuth();
    const [ message, setMessage ] = useState( '' );
    console.log( JSON.stringify( recipient, null, 2 ) );
    useLayoutEffect( () => {
        navigation.setOptions( {
            headerTitle: () => (
                <View style={ styles.userContainer }>
                    <View style={ [
                        styles.avatarContainer,
                        {
                            backgroundColor: theme.colors.accent
                        }
                    ] }>
                        { recipient?.avatarUrl ? (
                            <Image source={ { uri: recipient?.avatarUrl } } width={ 32 } height={ 32 } resizeMode="cover" />
                        ) : (
                            <Text style={ [
                                styles.avatarText,
                                {
                                    fontFamily: theme.typography.fontFamily.bold,
                                    color: theme.colors.text
                                }
                            ] }>
                                { recipient?.name ? recipient?.name[ 0 ].toUpperCase() : '?' }
                            </Text>
                        ) }
                    </View>
                    <View>
                        <Text style={ [
                            styles.userName,
                            {
                                fontFamily: theme.typography.fontFamily.bold,
                                color: theme.colors.text
                            }
                        ] }>
                            { recipient?.name ? recipient?.name : 'Unknown User' }
                        </Text>
                        <Text style={ [
                            styles.userNumber,
                            {
                                fontFamily: theme.typography.fontFamily.medium,
                                color: theme.colors.textSecondary
                            }
                        ] }>
                            { recipient?.phoneNumber }
                        </Text>
                    </View>
                </View>
            )
        } );
    }, [ navigation, recipient, theme ] );
    const handleSendMessage = () => {
        console.log( message );
        setMessage( '' );
    }
    return(
        <SafeAreaView style={ { flex: 1, backgroundColor: theme.colors.chatBackground } } edges={ [ 'bottom' ] }>
            <KeyboardAvoidingView
                style={ { flex: 1 } }
                behavior={ Platform.OS === "ios" ? "padding" : undefined }
                keyboardVerticalOffset={ Platform.OS === "ios" ? 90 : 0 }
            >
                <View style={ styles.chatWrapper }>
                    <View style={ styles.chatContainer }>

                    </View>
                    <View style={ styles.chatActionContainer }>
                        <Input
                            placeholder="Type a message..."
                            multiline
                            resizeMode={ true }
                            value={ message }
                            onChangeText={ setMessage }
                        />
                        <Button
                            style={ styles.sendBtn }
                            onPress={ handleSendMessage }
                        >
                            <Ionicons name="send-outline" size={ 24 } color={ theme.colors.text } />
                        </Button>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
export default ChatScreen;

const styles = StyleSheet.create( {
    userContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    avatarContainer:{
        width: 32,
        height: 32,
        borderRadius: 32,
        overflow: 'hidden'
    },
    avatarText:{
        fontSize: 18,
        lineHeight: 24
    },
    userName:{
        fontSize: 16,
        lineHeight: 22
    },
    userNumber:{
        fontSize: 12,
        lineHeight: 18
    },
    chatWrapper:{
        flex: 1,
        padding: 16
    },
    chatContainer:{
        flex: 1
    },
    chatActionContainer:{
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8
    },
    sendBtn:{
        padding: 0,
        borderRadius: 10
    }
} );