import { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import * as Contacts from 'expo-contacts';
import { useTheme } from "@/theme/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

const NewChat = () => {
    const { theme } = useTheme();
    const [ contacts, setContacts ] = useState( [] );
    const [ loading, setLoading ] = useState( true );
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
                // sort: Contacts.SortTypes.email,
            } );
            setContacts( data );
            // console.log('Fetched Contacts:', JSON.stringify( data[4], null, 2 ));
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
    if ( loading ) {
        return (
            <View style={[ styles.center, { backgroundColor: theme.colors.background } ]}>
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
                        style={ [ styles.contactRow, { borderBottomColor: theme.colors.border } ] }
                        activeOpacity={ 0.75 }
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
                                    color: theme.colors.text
                                }
                            ] }>
                                { item.name }
                            </Text>
                            <Text style={ [
                                styles.phone,
                                {
                                    color: theme.colors.textSecondary
                                }
                            ] }>
                                { item.phoneNumbers?.[ 0 ]?.number || 'No number' }
                            </Text>
                            { item.emails?.[ 0 ]?.email ? (
                                <Text style={ [
                                    styles.email,
                                    {
                                        color: theme.colors.textSecondary
                                    }
                                ] }>
                                    { item.email }
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
    contactRow: {
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
        fontSize: 16
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
    },
    phone: {
        fontSize: 13,
        marginTop: 2,
    },
} )