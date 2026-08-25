import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { completePhoneVerification } from '@/services/authService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function VerifyOtp({ route, navigation }) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { phoneNumber } = route.params || {};

    const [ code, setCode ] = useState( '' );
    const [ loading, setLoading ] = useState( false );
    const [ error, setError ] = useState( '' );
    const [ timer, setTimer ] = useState( 60 );

    useEffect( () => {
        const countdown = setInterval( () => {
            setTimer( ( prev ) => ( prev > 0 ? prev - 1 : 0 ) );
        }, 1000 );
        return () => clearInterval( countdown );
    }, [] );

    const handleVerify = async () => {
        if ( code.trim().length !== 6 ) {
            setError( 'Please enter the complete 6-digit code.' );
            return;
        }

        setLoading( true );
        setError( '' );

        try {
            // For Firebase test numbers or backend OTP confirmation:
            // Verify code against confirmationResult here if using native SMS
            const targetUid = user?.uid;
            if ( !targetUid ) throw new Error( 'No active user session found.' );

            const result = await completePhoneVerification( targetUid );
            if ( !result.success ) {
                setError( result.error || 'Verification failed.' );
            }
            // RootNavigator will automatically transition to MainTabs once phoneVerified becomes true
        } catch ( err ) {
            setError( err.message || 'Invalid verification code.' );
        } finally {
            setLoading( false );
        }
    };

    return (
        <SafeAreaView style={ { flex: 1 } } edges={ [ 'bottom' ] }>
            <KeyboardAvoidingView style={ { flex: 1 } } behavior={ Platform.OS === 'ios' ? 'padding' : undefined }>
                <ScrollView showsVerticalScrollIndicator={ false } keyboardShouldPersistTaps="handled" contentContainerStyle={ styles.scrollContainer }>
                    <View style={ styles.verifyOptContainer }>
                        <View style={ styles.brandTextContainer }>
                            <Image style={ styles.logo } source={ require( '../../assets/nudge-logo.png' ) } resizeMode="contain" />
                        </View>
                        <View>
                            <View style={ styles.titleContainer }>
                                <Text
                                    style={ [
                                        styles.title,
                                        {
                                            fontFamily: theme.typography.fontFamily.bold,
                                            color: theme.colors.text
                                        }
                                    ] }
                                >
                                    Verify
                                </Text>
                                <Text
                                    style={ [
                                        styles.title,
                                        {
                                            fontFamily: theme.typography.fontFamily.bold,
                                            color: theme.colors.primary
                                        }
                                    ] }
                                >
                                    Your Number
                                </Text>
                            </View>
                            <Text
                                style={ [
                                    styles.subTitle,
                                    {
                                        fontFamily: theme.typography.fontFamily.medium,
                                        color: theme.colors.textSecondary
                                    }
                                ] }
                            >
                                We've sent a 6-digit verification code to <Text style={ { fontFamily: theme.typography.fontFamily.semibold, color: theme.colors.primary } }>{ phoneNumber || user?.phoneNumber }</Text>. Enter the code below.
                            </Text>
                        </View>
                        { error ? (
                            <View style={[ styles.errorBox, { backgroundColor: theme.colors.dangerMuted, borderColor: theme.colors.danger } ]}>
                                <Text style={[ styles.errorText, { color: theme.colors.danger } ]}>{ error }</Text>
                            </View>
                        ) : null }
                        <Input
                            value={ code }
                            onChangeText={ ( text ) => {
                                setCode( text.replace(/[^0-9]/g, '') );
                                if ( error ) setError( '' );
                            } }
                            keyboardType="number-pad"
                            maxLength={ 6 }
                            placeholder="303367"
                            placeholderTextColor={ theme.colors.textMuted }
                            autoFocus
                        />
                        <Button disabled={ loading || code.length !== 6 } onPress={ handleVerify }>
                            { loading ? <ActivityIndicator size="small" color={ theme.colors.surface } /> : 'Verify & Continue' }
                        </Button>
                        <TouchableOpacity 
                            disabled={ timer > 0 }
                            style={ styles.resendButton }
                            onPress={ () => setTimer( 60 ) }
                        >
                            <Text style={[ styles.resendText, { color: timer > 0 ? theme.colors.textMuted : theme.colors.primary } ]}>
                                { timer > 0 ? `Resend Code in 00:${ timer < 10 ? `0${timer}` : timer }` : 'Resend Code' }
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContainer:{
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 24
    },
    verifyOptContainer:{
        gap: 24
    },
    brandTextContainer:{
        alignItems: 'center'
    },
    logo:{
        width: 100,
        height: 100
    },
    titleContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4
    },
    title:{
        textAlign: 'center',
        fontSize: 32,
        lineHeight: 38,
        marginBottom: 8
    },
    subTitle:{
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20
    },
    errorBox: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
    },
    errorText: {
        fontSize: 13,
        textAlign: 'center',
    },
    otpInput: {
        height: 56,
        borderWidth: 1,
        borderRadius: 12,
        fontSize: 24,
        letterSpacing: 10,
        textAlign: 'center',
        marginBottom: 8,
    },
    resendButton: {
        alignItems: 'center',
        marginTop: 8,
    },
    resendText: {
        fontSize: 14,
    }
});