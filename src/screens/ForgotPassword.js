import { useState } from "react";
import { Text, View, StyleSheet, Image, ScrollView, Keyboard, TouchableOpacity, Platform, KeyboardAvoidingView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import GoogleButton from "@/components/ui/GoogleButton";
import Ionicons from '@expo/vector-icons/Ionicons';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ForgotPassword = ( { navigation } ) => {
    const { theme } = useTheme();
    const { resetPassword } = useAuth();
    const [ email, setEmail ] = useState( '' );
    const [ errorMessage, setErrorMessage ] = useState( '' );
    const [ loading, setLoading ] = useState( false );
    const [ isSubmitted, setIsSubmitted ] = useState( false );
    const handleForgotPassword = async () => {
        Keyboard.dismiss();
        setErrorMessage( '' );
        if( !email.trim() ){
            setErrorMessage( 'Please enter email address.' );
            return;
        }
        if( !EMAIL_REGEX.test( email.trim() ) ){
            setErrorMessage( 'Please enter a valid email address.' );
            return;
        }
        setLoading( true );
        try{
            const result = await resetPassword( email.trim() );
            if ( !result.success ) {
                setErrorMessage( result.error || 'Failed to send reset link. Please try again.' );
                return;
            }
            setIsSubmitted( true );
        } catch( err ){
            setErrorMessage( err.message || 'An unexpected error occurred.' );
        } finally{
            setLoading( false );
        }
    }
    return(
        <SafeAreaView style={ { flex: 1 } } edges={ [ 'bottom' ] }>
            <KeyboardAvoidingView style={ { flex: 1 } } behavior={ Platform.OS === 'ios' ? 'padding' : undefined }>
                <ScrollView showsVerticalScrollIndicator={ false } keyboardShouldPersistTaps="handled" contentContainerStyle={ styles.scrollContainer }>
                    <View style={ styles.forgotPasswordContainer }>
                        { !isSubmitted ? (
                            <>
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
                                            Forgot
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
                                            Password?
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
                                        No worries! Enter your email and we'll send you a link to reset your password.
                                    </Text>
                                </View>
                                <View style={ styles.formContainer }>
                                    { errorMessage ? (
                                        <View
                                            style={ [
                                                styles.errorMessageContainer,
                                                {
                                                    backgroundColor: theme.colors.accentMuted,
                                                    paddingHorizontal: theme.spacing.lg,
                                                    paddingVertical: theme.spacing.sm,
                                                    borderColor: theme.colors.danger || '#EF4444',
                                                    borderRadius: theme.radii.xs
                                                },
                                            ] }
                                        >
                                            <Text
                                                style={ [
                                                    styles.errorText,
                                                    {
                                                        fontFamily: theme.typography.fontFamily.medium,
                                                        fontSize: theme.spacing.md,
                                                        lineHeight: theme.spacing.lg,
                                                        color: theme.colors.danger || '#EF4444',
                                                    },
                                                ] }
                                            >
                                                { errorMessage }
                                            </Text>
                                        </View>
                                    ) : null }
                                    <Input
                                        placeholder="Enter Your Email"
                                        label="Email"
                                        value={ email }
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={ false }
                                        textContentType="emailAddress"
                                        returnKeyType="done"
                                        onChangeText={ text => {
                                            setEmail( text );
                                            if( errorMessage ) setErrorMessage( '' );
                                        } }
                                        onSubmitEditing={ handleForgotPassword }
                                    />
                                    <Button disabled={ loading } onPress={ handleForgotPassword }>
                                        { loading ? <ActivityIndicator size={ theme.spacing.xl } color={ theme.colors.text } /> : 'Send Reset Link' }
                                    </Button>
                                </View>
                                <View style={ styles.orContainer }>
                                    <View style={ [ styles.border, { backgroundColor: theme.colors.border } ] }></View>
                                    <Text style={ [
                                        styles.orText,
                                        {
                                            fontFamily: theme.typography.fontFamily.regular,
                                            fontSize: theme.spacing.md,
                                            lineHeight: theme.spacing.lg,
                                            color: theme.colors.textSecondary
                                        }
                                    ] }>
                                        or continue with
                                    </Text>
                                    <View style={ [ styles.border, { backgroundColor: theme.colors.border } ] }></View>
                                </View>
                                <GoogleButton></GoogleButton>
                            </>
                        ) : (
                            <View>
                                <Ionicons style={ styles.successIcon } name="checkmark-circle-outline" size={ 100 } color={ theme.colors.success } />
                                <Text style={ [
                                    styles.resetPasswordTitle,
                                    {
                                        fontFamily: theme.typography.fontFamily.bold,
                                        color: theme.colors.success
                                    }
                                ] }>
                                    Check Your Email
                                </Text>
                                <Text style={ [
                                    styles.resetPasswordSubTitle,
                                    {
                                        fontFamily: theme.typography.fontFamily.regular,
                                        color: theme.colors.textSecondary
                                    }
                                ] }>
                                    A password reset link has been sent to{ '\n' }
                                    <Text style={ { fontFamily: theme.typography.fontFamily.bold, color: theme.colors.text } }>
                                        { email.trim() }
                                    </Text>
                                </Text>
                                <Button onPress={ () => navigation?.navigate( 'Login' ) }>
                                    Return to Login
                                </Button>
                                <TouchableOpacity
                                    onPress={ () => setIsSubmitted( false ) }
                                    activeOpacity={ 0.75 }
                                    hitSlop={ { top: 10, bottom: 10, left: 10, right: 10 } }
                                    style={ styles.resendPasswordResetEmail }
                                >
                                    <Text style={ [
                                        styles.resendPasswordResetEmailText,
                                        {
                                            fontFamily: theme.typography.fontFamily.medium,
                                            color: theme.colors.primary
                                        }
                                    ] }>
                                        Didn't receive the email? Try again
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ) }
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
export default ForgotPassword;

const styles = StyleSheet.create( {
    scrollContainer:{
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 24
    },
    forgotPasswordContainer:{
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
    formContainer:{
        gap: 16
    },
    orContainer:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    border:{
        flex: 1,
        height: 1
    },
    orText:{
        paddingHorizontal: 8,
        textTransform: 'uppercase'
    },
    successIcon:{
        alignSelf: 'center',
        marginBottom: 32
    },
    resetPasswordTitle:{
        fontSize: 32,
        lineHeight: 38,
        textAlign: 'center',
        marginBottom: 8
    },
    resetPasswordSubTitle:{
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24
    },
    resendPasswordResetEmail:{
        alignItems: 'center',
        marginTop: 32
    },
    resendPasswordResetEmailText:{
        fontSize: 14,
        lineHeight: 20,
    }
} );