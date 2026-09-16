import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeContext";
import { db } from "@/services/firebase";
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity, BackHandler, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from 'expo-clipboard';
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';

const ChatScreen = ( { route, navigation } ) => {
    const { chatId, recipient } = route.params || null;
    const { theme } = useTheme();
    const { user: currentUser } = useAuth();
    const insets = useSafeAreaInsets();
    const [ message, setMessage ] = useState( '' );
    const [ messages, setMessages ] = useState( [] );
    const [ selectedMessages, setSelectedMessages ] = useState( null );
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
    const handleMessageLongPress = ( item, isMe ) => {
        setSelectedMessages( item );
    }
    const handleCopyMessageText = async () => {
        if( selectedMessages?.text ){
            await Clipboard.setStringAsync( selectedMessages.text );
        }
        setSelectedMessages( null );
    }
    const handleDeleteMessageText = () => {
        if( !selectedMessages ) return;
        setSelectedMessages( null );
        Alert.alert(
            'Delete Message',
            'Are you sure you want to delete this message?',
            [ 
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'default',
                    onPress: async () => {
                        const messageIdToDelete = selectedMessages.id;
                        try{
                            const messageRef = doc( db, "chats", chatId, "messages", messageIdToDelete );
                            await deleteDoc( messageRef );
                        } catch( error ){
                            console.error( "Error deleting message:", error );
                            Alert.alert( "Error", "Failed to delete the message." );
                        }
                    }
                }
            ]
        )
    }
    useEffect( () => {
        const onBackPress = () => {
            if( selectedMessages ){
                setSelectedMessages( null );
                return true;
            }
            return false;
        }
        const backHandler = BackHandler.addEventListener( 'hardwareBackPress', onBackPress );
        return () => backHandler.remove();
    }, [ selectedMessages ] );
    useEffect( () => {
        navigation.setOptions( {
            gestureEnabled: !selectedMessages
        } )
    }, [ selectedMessages, navigation ] );
    return(
        <View style={ { flex: 1, backgroundColor: theme.colors.background } }>
            <View style={ [
                styles.chatHeader,
                {
                    paddingTop: insets.top + 12,
                    backgroundColor: theme.colors.headerBackground
                }
            ] }>
                <TouchableOpacity
                    onPress={ () => selectedMessages ? setSelectedMessages( null ) : navigation.goBack() }
                    hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                    activeOpacity={ 0.75 }
                >
                    <Ionicons name="arrow-back" size={ 24 } color={ theme.colors.headerText } />
                </TouchableOpacity>
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
                <View style={ styles.actionContainer }>
                    { selectedMessages ? (
                        <>
                            <TouchableOpacity
                                hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                                activeOpacity={ 0.75 }
                                onPress={ handleCopyMessageText }
                            >
                                <Ionicons name="copy-outline" size={ 24 } color={ theme.colors.textSecondary } />
                            </TouchableOpacity>
                            <TouchableOpacity
                                hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                                activeOpacity={ 0.75 }
                            >
                                <Octicons name="reply" size={ 24 } color={ theme.colors.textSecondary } />
                            </TouchableOpacity>
                            { selectedMessages?.senderId === currentUser?.uid && (
                                <TouchableOpacity
                                    hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                                    activeOpacity={ 0.75 }
                                    onPress={ handleDeleteMessageText }
                                >
                                    <Ionicons name="trash-outline" size={ 24 } color={ theme.colors.textSecondary } />
                                </TouchableOpacity>
                            ) }
                        </>
                    ) : (
                        <>
                            <TouchableOpacity
                                hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                                activeOpacity={ 0.75 }
                            >
                                <Ionicons name="videocam-outline" size={ 24 } color={ theme.colors.textSecondary } />
                            </TouchableOpacity>
                            <TouchableOpacity
                                hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                                activeOpacity={ 0.75 }
                            >
                                <Ionicons name="call-outline" size={ 24 } color={ theme.colors.textSecondary } />
                            </TouchableOpacity>
                        </>
                    ) }
                </View>
            </View>
            <View style={ { flex: 1, backgroundColor: theme.colors.chatBackground } }>
                <KeyboardAvoidingView
                    style={ { flex: 1 } }
                    behavior={ Platform.OS === "ios" ? "padding" : undefined }
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
                                    showsVerticalScrollIndicator={ false }
                                    renderItem={ ( { item } ) => {
                                        const isMe = item.senderId === currentUser?.uid;
                                        const isSelected = selectedMessages?.id === item.id;
                                        const formattedTime = formatMessageTime( item.createdAt );
                                        return(
                                            <TouchableOpacity
                                                onLongPress={ () => handleMessageLongPress( item, isMe ) }
                                                onPress={ () => {
                                                    if( selectedMessages ){
                                                        setSelectedMessages( isSelected ? null : item );
                                                    }
                                                } }
                                                delayLongPress={ 250 }
                                                activeOpacity={ 0.75 }
                                                style={ [
                                                    styles.messageContainer,
                                                    {
                                                        alignItems: isMe ? 'flex-end' : 'flex-start',
                                                        padding: isSelected ? 6 : null,
                                                        backgroundColor: isSelected ? theme.colors.primaryMuted : null,
                                                        borderRadius: isSelected ? 6 : null
                                                    }
                                                ] }
                                            >
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
                                            </TouchableOpacity>
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
            </View>
        </View>
    )
}
export default ChatScreen;

const styles = StyleSheet.create( {
    chatHeader:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 16,
        paddingBottom: 12
    },
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
    actionContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginLeft: 'auto'
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
        maxWidth: '80%',
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