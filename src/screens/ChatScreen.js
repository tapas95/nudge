import { useEffect, useLayoutEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeContext";
import { db } from "@/services/firebase";
import { collection, addDoc, doc, setDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Ionicons from '@expo/vector-icons/Ionicons';

const ChatScreen = ( { route, navigation } ) => {
    const { chatId, recipient } = route.params || null;
    const { theme } = useTheme();
    const { user: currentUser } = useAuth();
    const [ message, setMessage ] = useState( '' );
    const [ messages, setMessages ] = useState( [] );
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
    const handleSendMessage = async () => {
        const messageToSend = message.trim();
        if( !messageToSend || !chatId ) return;
        setMessage( '' );
        try{
            const messagesRef = collection( db, "chats", chatId, "messages" );
            const chatDocRef = doc( db, "chats", chatId );
            await addDoc( messagesRef, {
                text: messageToSend,
                senderId: currentUser.uid,
                receiverId: recipient.id,
                createdAt: serverTimestamp(),
            } );
            await setDoc( chatDocRef, {
                chatId,
                participants: [ currentUser.uid, recipient.id ],
                lastMessage: {
                    text: messageToSend,
                    senderId: currentUser.uid,
                    createdAt: serverTimestamp(),
                },
                updatedAt: serverTimestamp(),
            },
            { merge: true }
        );
        } catch( error ){
            console.error( "Error sending message:", error );
        } finally{

        }
    }
    useEffect( () => {
        if( !chatId ) return;
        const messagesRef = collection( db, "chats", chatId, "messages" );
        const q = query( messagesRef, orderBy( "createdAt", "desc" ) );
        const unsubscribe = onSnapshot( q, ( snapshot ) => {
            const fetchedMessages = snapshot.docs.map( ( doc ) => ( {
                id: doc.id,
                ...doc.data(),
            } ) );
            setMessages( fetchedMessages );
        }, ( error ) => {
            console.error( "Error listening to messages:", error );
        } );
        return () => unsubscribe();
    }, [ chatId ] );
    const formatMessageTime = ( timestamp ) => {
        if ( !timestamp ) return '';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date( timestamp );
            return date.toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit', hour12: true } );
        } catch {
            return '';
        }
    };
    return(
        <SafeAreaView style={ { flex: 1, backgroundColor: theme.colors.chatBackground } } edges={ [ 'bottom' ] }>
            <KeyboardAvoidingView
                style={ { flex: 1 } }
                behavior={ Platform.OS === "ios" ? "padding" : undefined }
                keyboardVerticalOffset={ Platform.OS === "ios" ? 90 : 0 }
            >
                <View style={ styles.chatWrapper }>
                    <View style={ styles.chatContainer }>
                        { messages.length === 0 ? (
                            <View style={ styles.emptyContainer }>
                                <Text style={ [ styles.emptyText, { color: theme.colors.textSecondary } ] }>
                                    Say hello to { recipient?.name || 'them' }!
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={ messages }
                                keyExtractor={ item => item.id }
                                inverted
                                contentContainerStyle={ styles.messagesList }
                                renderItem={ ( { item } ) => {
                                    const isMe = item.senderId === currentUser?.uid;
                                    const formattedTime = formatMessageTime( item.createdAt );
                                    console.log( JSON.stringify(item, null, 2 ) );
                                    return(
                                        <View style={ [
                                            styles.messageContainer,
                                            {
                                                alignItems: isMe ? 'flex-end' : 'flex-start'
                                            }
                                        ] }>
                                            <View style={ [
                                                styles.messageBubble,
                                                {
                                                    backgroundColor: isMe ? theme.colors.bubbleOutgoing : theme.colors.bubbleIncoming,
                                                    borderBottomRightRadius: isMe ? 0 : 12,
                                                    borderBottomLeftRadius: isMe ? 12 : 0
                                                }
                                            ] }>
                                                <Text style={ [
                                                    styles.messageText,
                                                    {
                                                        fontFamily: theme.typography.fontFamily.medium,
                                                        color: isMe ? theme.colors.bubbleOutgoingText : theme.colors.bubbleIncomingText
                                                    }
                                                ] }>
                                                    { item.text }
                                                </Text>
                                            </View>
                                            { formattedTime ? (
                                                <Text style={ [
                                                    styles.timeText,
                                                    {
                                                        fontFamily: theme.typography.fontFamily.regular,
                                                        color: isMe ? theme.colors.bubbleOutgoingTime || theme.colors.textMuted : theme.colors.bubbleIncomingTime || theme.colors.textMuted
                                                    }
                                                ] }>
                                                    { formattedTime }
                                                </Text>
                                            ) : null }
                                        </View>
                                    )
                                } }
                            />
                        ) }
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
    messagesList:{
        gap: 12,
        paddingVertical: 12
    },
    messageContainer:{
        gap: 4
    },
    messageBubble:{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12
    },
    messageText:{
        fontSize: 16,
        lineHeight: 22
    },
    timeText:{
        fontSize: 12,
        lineHeight: 14
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