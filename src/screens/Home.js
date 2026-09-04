import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeContext";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { db } from "@/services/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import Input from "@/components/ui/Input";
import Ionicons from '@expo/vector-icons/Ionicons';
import SkeletonChatList from "@/components/ui/skeleton/SkeletonChatList";

const Home = ( { navigation } ) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [ recipientProfiles, setRecipientProfiles ] = useState( [] );
    const [ loading, setLoading ] = useState( true );
    const [ refreshing, setRefreshing ] = useState( false );
    useEffect( () => {
        fetchConversationList();
    }, [ user?.uid ] );
    const fetchConversationList = async () => {
        if( !user?.uid ) return;
        if( refreshing ){
            setRefreshing( true );
        } else{
            setLoading( true );
        }
        try{
            const chatsRef = collection( db, "chats" );
            const conversationQuery = query( chatsRef, where( 'participants', 'array-contains', user.uid ) );
            const conversationData = await getDocs( conversationQuery );
            const profiles = await Promise.all(
                conversationData.docs.map( async ( chatDoc ) => {
                    const chatData = chatDoc.data();
                    const otherUserId = chatData.participants.find( ( id ) => id !== user.uid );
                    if( !otherUserId ) return null;
                    try{
                        const userDocRef = doc( db, "users", otherUserId );
                        const userSnapshot = await getDoc( userDocRef );
                        if( userSnapshot.exists() ){
                            const userData = userSnapshot.data();
                            return{
                                chatId: chatDoc.id,
                                recipentId: userSnapshot.id,
                                recipentAvatar: userData.avatarUrl || null,
                                recipentName: userData.displayName || 'Nudge User',
                                lastMessage: chatData.lastMessage?.text || '',
                                lastMessageTime: chatData.updatedAt || null
                            };
                        }
                    } catch( error ){
                        console.log( error );
                    }
                    return{
                        chatId: chatDoc.id,
                        recipentId: otherUserId,
                        recipentAvatar: null,
                        recipentName: 'Unknown User'
                    };
                } )
            );
            setRecipientProfiles( profiles.filter( Boolean ) );
        } catch( error ){
            console.log( error );
        } finally{
            setLoading( false );
            setRefreshing( false );
        }
    }
    return (
        <View style={ { flex: 1, backgroundColor: theme.colors.background } }>
            <View style={ [
                styles.homeHeader,
                {
                    paddingTop: insets.top + 12,
                    backgroundColor: theme.colors.headerBackground
                }
            ] }>
                <TouchableOpacity
                    hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                    activeOpacity={ 0.75 }
                    onPress={ () => navigation.navigate( 'Profile' ) }
                >
                    <View style={ styles.userContainer }>
                        <View style={ [
                            styles.userAvatarContainer,
                            {
                                borderColor: theme.colors.text
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
            </View>
            <View style={ styles.homeContainer }>
                <View style={ styles.searchContainer }>
                    <TouchableOpacity
                        style={ styles.iconContainer }
                        hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                        activeOpacity={ 0.75 }
                    >
                        <Ionicons style={ styles.searchIcon } name="search-outline" size={ 24 } color={ theme.colors.text } />
                    </TouchableOpacity>
                    <Input
                        placeholder="Search messages or people"
                        style={ styles.searchInput }
                        placeholderTextColor={ theme.colors.textMuted }
                    />
                </View>
                { loading ? (
                    <View>
                        { [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ].map( ( key ) => (
                            <SkeletonChatList key={ key } />
                        ) ) }
                    </View>
                ) : (
                    <FlatList
                        data={ recipientProfiles }
                        keyExtractor={ item => item.chatId }
                        refreshControl={
                            <RefreshControl
                                refreshing={ refreshing }
                                onRefresh={ () => fetchConversationList( true ) }
                                tintColor={ theme.colors.primary }
                                colors={ [ theme.colors.primary ] }
                            />
                        }
                        ListEmptyComponent={ 
                            <View style={ styles.emptyContainer }>
                                <View style={ [ styles.emptyIconWrapper, { backgroundColor: theme.colors.surface } ] }>
                                    <Ionicons name="chatbubbles-outline" size={ 40 } color={ theme.colors.textMuted } />
                                </View>
                                <Text style={ [ styles.emptyTitle, { fontFamily: theme.typography.fontFamily.semibold, color: theme.colors.text } ] }>
                                    No conversations yet
                                </Text>
                                <Text style={ [ styles.emptySubtitle, { fontFamily: theme.typography.fontFamily.regular, color: theme.colors.textMuted } ] }>
                                    Tap the button below to start chatting with your contacts.
                                </Text>
                            </View>
                         }
                        renderItem={ ( { item } ) => (
                                <TouchableOpacity
                                    onPress={ () => {
                                        navigation.navigate( 'ChatScreen', {
                                            chatId: item.chatId,
                                            recipient: {
                                                id: item.recipentId,
                                                name: item.recipentName,
                                                avatarUrl: item.recipentAvatar,
                                            },
                                        } );
                                    } }
                                    style={ [
                                        styles.recipentProfile,
                                        {
                                            borderColor: theme.colors.border
                                        }
                                    ] }
                                    activeOpacity={ 0.75 }
                                >
                                    <View style={ [
                                        styles.recipentAvatarContainer,
                                        {
                                            backgroundColor: theme.colors.primary
                                        }
                                    ] }>
                                        { item.recipentAvatar ? (
                                            <Image source={ { uri: item.recipentAvatar } } width={ 40 } height={ 40 } resizeMode="cover" style={ styles.recipentAvatar } />
                                        ) : (
                                            <Text style={ [
                                                styles.recipentAvatarText,
                                                {
                                                    fontFamily: theme.typography.fontFamily.medium,
                                                    color: theme.colors.text
                                                }
                                            ] }>
                                                { item.recipentName ? item.recipentName[ 0 ].toUpperCase() : '?' }
                                            </Text>
                                        ) }
                                    </View>
                                    <View style={ styles.messageContent }>
                                        <View style={ styles.messageHeader }>
                                            <Text style={ [
                                                styles.recipentName,
                                                {
                                                    fontFamily: theme.typography.fontFamily.semibold,
                                                    color: theme.colors.text
                                                }
                                            ] }>
                                                { item.recipentName }
                                            </Text>
                                            <Text
                                                style={ [
                                                    styles.time,
                                                    {
                                                        fontFamily: theme.typography.fontFamily.regular,
                                                        color: theme.colors.textMuted
                                                    }
                                                ] }
                                            >
                                                { item.lastMessageTime ? new Date( item.lastMessageTime.seconds * 1000 ).toLocaleTimeString( [], { hour: '2-digit', minute: '2-digit' } ) : '' }
                                            </Text>
                                        </View>
                                        <Text
                                            style={ [
                                                styles.lastMessage,
                                                {
                                                    fontFamily: theme.typography.fontFamily.regular,
                                                    color: theme.colors.textSecondary
                                                }
                                            ] }
                                            numberOfLines={ 1 }
                                            ellipsizeMode="tail"
                                        >
                                            { item.lastMessage || 'Started a conversation' }
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                        contentContainerStyle={ styles.recipentProfileContainer }
                    />
                ) }
                <TouchableOpacity
                    style={ [
                        styles.fab,
                        {
                            backgroundColor: theme.colors.accent,
                            shadowColor: theme.colors.text,
                        },
                    ] }
                    activeOpacity={ 0.85 }
                    onPress={ () => navigation.navigate( 'NewChatModal' ) }
                >
                    <Ionicons name="chatbubble-ellipses-outline" size={ 24 } color={ theme.colors.text } />
                </TouchableOpacity>
            </View>
        </View>
    );
};
export default Home;

const styles = StyleSheet.create( {
    homeHeader:{
        paddingHorizontal: 16,
        paddingBottom: 12
    },
    userContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    userAvatarContainer:{
        borderWidth: 1,
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
        borderWidth: 0.5,
        borderStyle: 'solid',
        borderColor: '#ffffff'
    },
    username:{
        fontSize: 16,
        lineHeight: 22
    },
    homeContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    searchContainer:{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative'
    },
    iconContainer:{
        position: 'absolute',
        left: 10,
        zIndex: 1
    },
    searchInput:{
        paddingLeft: 44,
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    recipentProfile:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 12,
        borderBottomWidth: 1
    },
    recipentAvatarContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 40,
        overflow: 'hidden'
    },
    recipentAvatarText:{
        fontSize: 20,
        lineHeight: 26
    },
    messageContent:{
        flex: 1
    },
    messageHeader:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    recipentName:{
        fontSize: 16,
        lineHeight: 22
    },
    lastMessage:{
        flex: 1,
        fontSize: 12,
        lineHeight: 16,
        marginTop: 4
    },
    time:{
        flexShrink: 0,
        fontSize: 12,
        lineHeight: 16
    }
} );