import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { completePhoneVerification } from '@/services/authService';
import Button from '@/components/ui/Button';

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
        <SafeAreaView style={[ styles.safeArea, { backgroundColor: theme.colors.background } ]}>
            <View style={styles.container}>
                <Text style={[ styles.title, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold } ]}>
                    Verify Phone Number
                </Text>
                
                <Text style={[ styles.subtitle, { color: theme.colors.textSecondary, fontFamily: theme.typography.fontFamily.regular } ]}>
                    Enter the 6-digit verification code sent to{'\n'}
                    <Text style={{ color: theme.colors.text, fontFamily: theme.typography.fontFamily.semibold }}>
                        { phoneNumber || user?.phoneNumber }
                    </Text>
                </Text>

                { error ? (
                    <View style={[ styles.errorBox, { backgroundColor: theme.colors.dangerMuted, borderColor: theme.colors.danger } ]}>
                        <Text style={[ styles.errorText, { color: theme.colors.danger } ]}>{ error }</Text>
                    </View>
                ) : null }

                <TextInput
                    style={[
                        styles.otpInput,
                        {
                            backgroundColor: theme.colors.surfaceVariant,
                            borderColor: theme.colors.border,
                            color: theme.colors.text,
                        }
                    ]}
                    value={ code }
                    onChangeText={ ( text ) => {
                        setCode( text.replace(/[^0-9]/g, '') );
                        if ( error ) setError( '' );
                    } }
                    keyboardType="number-pad"
                    maxLength={ 6 }
                    placeholder="123456"
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        gap: 16,
    },
    title: {
        fontSize: 26,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 8,
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
    },
});