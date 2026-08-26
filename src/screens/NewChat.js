import { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import { db } from "@/services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import * as Contacts from 'expo-contacts';
import { useTheme } from "@/theme/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { normalizePhoneNumber } from "@/util/phone";
import { getChatId } from "@/util/generateChatId";

const NewChat = ( { navigation } ) => {
    const { theme } = useTheme();
    const { user: currentUser } = useAuth();
    const [ contacts, setContacts ] = useState( [] );
    const [ loading, setLoading ] = useState( true );
    const [ checkingUser, setCheckingUser ] = useState( false );
    const [ selectednumber, setSelectedNumber ] = useState( '' );
    useEffect( () => {
        loadDeviceContacts();
    }, [] );
    const loadDeviceContacts = async () => {
        try{
            const { status } = await Contacts.requestPermissionsAsync();
            if ( status !== 'granted' ) {
                Alert.alert(
                    'Permission Denied',
                    'Permission to access your contacts is required to start a chat.'
                );
                setLoading( false );
                return;
            }
            const { data } = await Contacts.getContactsAsync( {
                fields: [ Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails, Contacts.Fields.Image ],
                sort: Contacts.SortTypes.FirstName
            } );
            const isPhoneNumber = ( str ) => {
                if (!str) return false;
                const cleaned = str.replace(/[\s\-\(\)\+]/g, '');
                return /^\d+$/.test(cleaned);
            };
            const validContacts = data.filter( ( contact ) => {
                const hasValidPhoneNumber = Array.isArray( contact.phoneNumbers ) && contact.phoneNumbers.length > 0;
                const rawName = contact.name?.trim();
                const isInvalidName = !rawName || rawName.toLowerCase() === 'null null' || rawName.toLowerCase() === 'null';
                const isNameJustNumber = isPhoneNumber( rawName );
                return hasValidPhoneNumber && !isInvalidName && !isNameJustNumber;
            } )
            setContacts( validContacts );
        } catch( err ){
            console.error( 'Error fetching contacts:', err );
            Alert.alert( 'Error', 'Failed to load contacts from your device.' );
        }
        finally {
            setLoading( false );
        }
    }
    const generateAvatar = name => {
        if( !name ) return '?';
        const avatarName = name.split( ' ' );
        if( avatarName.length >= 2 ){
            return `${ avatarName[ 0 ][ 0 ] }${ avatarName[ 1 ][ 0 ] }`.toUpperCase();
        }
        return avatarName[ 0 ][ 0 ].toUpperCase();
    }
    const handleSelectPhoneNumber = async ( contact ) => {
        const rawNumber = contact.phoneNumbers?.[ 0 ]?.number;
        const normalizeNumber = normalizePhoneNumber( rawNumber, 'IN' );
        if ( !normalizeNumber ) {
            Alert.alert( 'Invalid Number', 'This contact does not have a valid phone number format.' );
            return;
        }
        if ( currentUser?.phoneNumber === normalizeNumber ) {
            Alert.alert( 'Notice', 'You cannot start a chat with yourself.' );
            return;
        }
        try{
            setCheckingUser( true );
            const usersRef = collection( db, 'users' );
            const q = query( usersRef, where( 'phoneNumber', '==', normalizeNumber ) );
            const snapshot = await getDocs( q );
            if( !snapshot.empty ){
                const docData = snapshot.docs[ 0 ];
                const targetUser = { id: docData.id, ...docData.data() };
                const chatId = getChatId( currentUser.uid, targetUser.id );
                navigation.navigate( 'ChatScreen', {
                    chatId,
                    recipient: {
                        id: targetUser.id,
                        name: contact.name || targetUser.displayName || 'Nudge User',
                        phoneNumber: normalizeNumber,
                        avatarUrl: targetUser.avatarUrl || null,
                    },
                } );
            } else{
                Alert.alert(
                    'Invite to Nudge',
                    `${ contact.name || 'This contact' } is not on Nudge yet. Would you like to invite them?`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                            text: 'Invite', 
                            onPress: () => {
                                console.log( 'Trigger SMS/Share for:', normalizeNumber );
                                // We can hook up expo-sms or Share API here later
                            } 
                        },
                    ]
                );
            }
        } catch( error ){
            console.error( 'Error querying user:', error );
            Alert.alert( 'Error', 'Failed to verify contact status. Please try again.' );
        } finally{
            setCheckingUser( false );
        }
    }
    if ( loading ) {
        return (
            <View style={ [ styles.loadingContainer, { backgroundColor: theme.colors.background } ] }>
                <ActivityIndicator size="large" color={ theme.colors.primary } />
                <Text style={{ color: theme.colors.textSecondary, marginTop: 12 }}>
                    Loading contacts...
                </Text>
            </View>
        );
    }
    return(
        <SafeAreaView style={ { flex: 1 } } edges={ [ 'bottom' ] }>
            <FlatList
                data={ contacts }
                keyExtractor={ ( item ) => item.id }
                renderItem={ ( { item } ) => (
                    <TouchableOpacity
                        style={ [
                            styles.contact,
                            {
                                borderBottomColor: theme.colors.border
                            }
                        ] }
                        activeOpacity={ 0.75 }
                        disabled={ checkingUser }
                        onPress={ () => handleSelectPhoneNumber( item ) }
                    >
                        <View style={ [
                            styles.avatarContainer,
                            {
                                backgroundColor: theme.colors.primary
                            }
                        ] }>
                            { item.imageAvailable && item.image?.uri ? 
                                (
                                    <Image source={ { uri: item.image?.uri } } width={ 48 } height={ 48 } resizeMode="cover" />
                                ) : (
                                    <Text style={ [
                                        styles.avatarText,
                                        {
                                            fontFamily: theme.typography.fontFamily.semibold,
                                            color: theme.colors.text
                                        }
                                    ] }>
                                        { generateAvatar( item.name ) }
                                    </Text>
                                )
                            }
                        </View>
                        <View>
                            <Text style={ [
                                styles.name,
                                {
                                    fontFamily: theme.typography.fontFamily.semibold,
                                    color: theme.colors.text
                                }
                            ] }>
                                { item.name }
                            </Text>
                            <Text style={ [
                                styles.phone,
                                {
                                    fontFamily: theme.typography.fontFamily.medium,
                                    color: theme.colors.textSecondary
                                }
                            ] }>
                                { item.phoneNumbers?.[ 0 ]?.number || 'No number' }
                            </Text>
                            { item.emails?.[ 0 ]?.email ? (
                                <Text style={ [
                                    styles.email,
                                    {
                                        fontFamily: theme.typography.fontFamily.medium,
                                        color: theme.colors.textSecondary
                                    }
                                ] }>
                                    { item.emails[ 0 ].email }
                                </Text>
                            ) : null }
                        </View>
                    </TouchableOpacity>
                ) }
            />
        </SafeAreaView>
    )
}
export default NewChat;

const styles = StyleSheet.create( {
    loadingContainer:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contact:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
    },
    avatarContainer:{
        width: 48,
        height: 48,
        borderRadius: 32,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarText:{
        fontSize: 18
    },
    name: {
        fontSize: 16,
    },
    phone: {
        fontSize: 12,
        marginTop: 2,
    },
    email:{
        fontSize: 12,
        marginTop: 2
    }
} )