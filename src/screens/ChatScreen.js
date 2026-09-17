import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeContext";
import { db } from "@/services/firebase";
import { collection, addDoc, doc, setDoc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity, BackHandler, Alert, TextInput } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from 'expo-clipboard';
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { EmojiKeyboard } from 'rn-emoji-keyboard';
import Button from "@/components/ui/Button";
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';

const ChatScreen = ( { route, navigation } ) => {
    const { chatId, recipient } = route.params || null;
    const { theme } = useTheme();
    const { user: currentUser } = useAuth();
    const insets = useSafeAreaInsets();
    const [ message, setMessage ] = useState( '' );
    const [ messages, setMessages ] = useState( [] );
    const [ selectedMessages, setSelectedMessages ] = useState( null );
    const [ replyMessage, setReplyMessage ] = useState( null );
    const player = useAudioPlayer( require( '../../assets/message-sent-sound.wav' ) );
    const [ isEmojiPickerOpen, setIsEmojiPickerOpen ] = useState( false );
    useEffect( () => {
        setAudioModeAsync( {
            playsInSilentMode: true
        } ).catch( error => console.warn( "Failed to set audio mode:", error ) )
    }, [] );
    const playSound = () => {
        if( player ){
            try{
                player.seekTo( 0 );
                player.play();
            } catch( audioError ){
                console.warn( "Send chime failed:", audioError );
            }
        }
    }
    const handleSendMessage = async () => {
        const messageToSend = message.trim();
        if( !messageToSend || !chatId ) return;
        const currentReply = replyMessage ? {
            id: replyMessage.id,
            text: replyMessage.text,
            senderId: replyMessage.senderId,
        } : null;
        setMessage( '' );
        setReplyMessage( null );
        playSound();
        try{
            const messagesRef = collection( db, "chats", chatId, "messages" );
            const chatDocRef = doc( db, "chats", chatId );
            await addDoc( messagesRef, {
                text: messageToSend,
                senderId: currentUser.uid,
                receiverId: recipient.id,
                createdAt: serverTimestamp(),
                replyTo: currentReply
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
            if( replyMessage ){
                setReplyMessage( false );
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
    const handleOnEmojiSelected = ( selectedEmojis ) => {
        console.log( JSON.stringify( selectedEmojis, null, 4 ) );
        setMessage( prev => prev + selectedEmojis.emoji );
    }
    return(
        <>
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
                                    onPress={ () => {
                                        setReplyMessage( selectedMessages );
                                        setSelectedMessages( null );
                                    } }
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
                                                        { item.replyTo && (
                                                            <View
                                                                style={ [
                                                                    styles.replyBubble,
                                                                    {
                                                                        backgroundColor: isMe ? 'rgba( 255, 255, 255, 0.1 )' : theme.colors.primaryMuted,
                                                                        borderRadius: theme.radii.sm,
                                                                        borderColor: isMe ? theme.colors.text : theme.colors.primary
                                                                    }
                                                                ] }
                                                            >
                                                                <Text
                                                                    style={ [
                                                                        {
                                                                            fontFamily: theme.typography.fontFamily.medium,
                                                                            color: isMe ? theme.colors.text : theme.colors.primary
                                                                        }
                                                                    ] }
                                                                >
                                                                    { item.replyTo.senderId === currentUser.uid ? 'You' : recipient?.name || 'Unknown' }
                                                                </Text>
                                                                <Text
                                                                    style={ [
                                                                        styles.replyBubbleText,
                                                                        {
                                                                            fontFamily: theme.typography.fontFamily.regular,
                                                                            color: theme.colors.textSecondary
                                                                        }
                                                                    ] }
                                                                >
                                                                    { item.replyTo.text }
                                                                </Text>
                                                            </View>
                                                        ) }
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
                                <View
                                    style={ [
                                        styles.messageInputContainer,
                                        {
                                            backgroundColor: theme.colors.headerBackground,
                                            borderColor: theme.colors.border,
                                            borderRadius: theme.radii.xl
                                        }
                                    ] }
                                >
                                    { replyMessage && (
                                        <View
                                            style={ [
                                                styles.replyMessageContainer,
                                                {
                                                    backgroundColor: theme.colors.primaryMuted,
                                                    borderColor: theme.colors.primary,
                                                    borderRadius: theme.radii.lg
                                                }
                                            ] }
                                        >
                                            <Text
                                                style={ [
                                                    styles.replyMessageText,
                                                    {
                                                        fontFamily: theme.typography.fontFamily.regular,
                                                        color: theme.colors.text
                                                    }
                                                ] }
                                            >
                                                { replyMessage.text }
                                            </Text>
                                            <TouchableOpacity
                                                hitSlop={ { top: 5, right: 5, bottom: 5, left: 5 } }
                                                activeOpacity={ 0.75 }
                                                onPress={ () => {
                                                    setReplyMessage( null );
                                                } }
                                            >
                                                <Ionicons name="close-outline" size={ 18 } color={ theme.colors.textSecondary } />
                                            </TouchableOpacity>
                                        </View>
                                    ) }
                                    <View style={ styles.messageInputInnerContainer }>
                                        <TouchableOpacity
                                            hitSlop={ { top: 5, right: 5, bottom: 5, left: 5 } }
                                            activeOpacity={ 0.75 }
                                            style={ styles.emojiButton }
                                            onPress={ () => setIsEmojiPickerOpen( prev => !prev ) }
                                        >
                                            <Entypo name="emoji-happy" size={ 20 } color={ theme.colors.textSecondary } />
                                        </TouchableOpacity>
                                        <TextInput
                                            placeholder="Type a message..."
                                            placeholderTextColor={ theme.colors.textMuted }
                                            multiline
                                            resizeMode={ true }
                                            value={ message }
                                            onChangeText={ setMessage }
                                            style={ [ 
                                                styles.messageInput,
                                                {
                                                    fontFamily: theme.typography.fontFamily.regular,
                                                    color: theme.colors.text
                                                }
                                            ] }
                                        />
                                    </View>
                                </View>
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
            { isEmojiPickerOpen &&
                <EmojiKeyboard
                    onEmojiSelected={ handleOnEmojiSelected }
                    enableSearchBar
                    allowMultipleSelections
                    enableRecentlyUsed
                    categoryPosition="top"
                    emojiSize={ 30 }
                    hideSearchBarClearIcon={ true }
                    theme={ {
                        container: theme.colors.background,
                        header: theme.colors.text,
                        knob: theme.colors.primaryMuted,
                        category: {
                            icon: theme.colors.textSecondary,
                            container: theme.colors.headerBackground,
                            containerActive: theme.colors.primary,
                            iconActive: theme.colors.text,
                        },
                        search: {
                            placeholder: theme.colors.textMuted,
                            text: theme.colors.textSecondary,
                            icon: theme.colors.text,
                            background: theme.colors.headerBackground
                        }
                    } }
                />
            }
        </>
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
    replyBubble:{
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginBottom: 4,
        borderLeftWidth: 3
    },
    replyBubbleText:{
        fontStyle: 'italic'
    },
    chatActionContainer:{
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8
    },
    messageInputContainer:{
        flex: 1,
        padding: 8,
        borderWidth: 1
    },
    messageInputInnerContainer:{
        flexGrow: 1,
        flexDirection: 'row',
        gap: 12
    },
    replyMessageContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderLeftWidth: 4,
        marginBottom: 8
    },
    replyMessageText:{
        flexGrow: 1,
        fontSize: 12,
        lineHeight: 18,
        fontStyle: 'italic'
    },
    emojiButton:{
        alignSelf: 'flex-end'
    },
    messageInput:{
        flex: 1,
        maxHeight: 250,
        fontSize: 14,
        lineHeight: 20,
        padding: 0
    },
    sendBtn:{
        padding: 0,
        borderRadius: 10
    }
} );