import { useState } from "react";
import { View, Text, StyleSheet, Image, Keyboard, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useTheme } from "@/theme/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import GoogleButton from "@/components/ui/GoogleButton";
import { SafeAreaView } from "react-native-safe-area-context";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = ( { navigation } ) => {
    const { theme } = useTheme();
    const { login } = useAuth();
    const [ email, setEmail ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ loading, setLoading ] = useState( false );
    const [ errorMessage, setErrorMessage ] = useState( '' );
    const validateForm = () => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        if( !trimmedEmail || !trimmedPassword ){
            setErrorMessage( 'Please fill in all fields.' );
            return false;
        }
        if( !EMAIL_REGEX.test( trimmedEmail ) ){
            setErrorMessage( 'Please enter a valid email address.' );
            return false;
        }
        if( trimmedPassword.length < 6 ){
            setErrorMessage( 'Password must be at least 6 characters long.' );
            return false;
        }
        return true;
    }
    const handleLogin = async () => {
        Keyboard.dismiss();
        setErrorMessage( '' );
        if( !validateForm() ) return;
        setLoading( true );
        try{
            const result = await login( email.trim(), password.trim() );
            if( !result.success ){
                setErrorMessage( result.error || 'Failed to log in. Please try again.' );
            }
        } catch( err ){
            setErrorMessage( err.message || 'An unexpected error occurred.' );
        } finally{
            setLoading( false );
        }
    }

    return (
        <SafeAreaView style={ { flex: 1 } }>
            <KeyboardAvoidingView style={ { flex: 1 } } behavior={ Platform.OS === 'ios' ? 'padding' : undefined }>
                <ScrollView showsVerticalScrollIndicator={ false } keyboardShouldPersistTaps="handled" contentContainerStyle={ styles.scrollContainer }>
                    <View style={ styles.loginContainer }>
                        <View style={ styles.brandTextContainer }>
                            <Image style={ styles.logo } source={ require( '../../assets/nudge-logo.png' ) } resizeMode="contain" />
                            <Text style={ [
                                styles.brand,
                                {
                                    fontFamily: theme.typography.fontFamily.bold,
                                    fontSize: theme.spacing.huge,
                                    color: theme.colors.text
                                }
                            ] }>
                                Nudge
                            </Text>
                            <View style={ styles.subTitleContainer }>
                                <Text style={ [
                                    styles.subTitle,
                                    {
                                        fontFamily: theme.typography.fontFamily.medium,
                                        fontSize: theme.spacing.md,
                                        lineHeight: theme.spacing.lg,
                                        color: theme.colors.textSecondary
                                    }
                                ] }>
                                    Chat
                                </Text>
                                <View style={ [
                                    styles.dot,
                                    {
                                        backgroundColor: theme.colors.accent
                                    }
                                ] }>
                                </View>
                                <Text style={ [
                                    styles.subTitle,
                                    {
                                        fontFamily: theme.typography.fontFamily.medium,
                                        fontSize: theme.spacing.md,
                                        lineHeight: theme.spacing.lg,
                                        color: theme.colors.textSecondary
                                    }
                                ] }>
                                    Connect
                                </Text>
                                <View style={ [
                                    styles.dot,
                                    { backgroundColor: theme.colors.accent }
                                ] }>
                                </View>
                                <Text style={ [
                                    styles.subTitle,
                                    {
                                        fontFamily: theme.typography.fontFamily.medium,
                                        fontSize: theme.spacing.md,
                                        lineHeight: theme.spacing.lg,
                                        color: theme.colors.textSecondary
                                    }
                                ] }>
                                    Be Closer
                                </Text>
                            </View>
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
                                textContentType="emailAddress"
                                autoCapitalize="none"
                                autoCorrect={ false }
                                returnKeyType="next"
                                onChangeText={ text => {
                                    setEmail( text );
                                    if( errorMessage ) setErrorMessage( '' );
                                } }
                            />
                            <Input
                                placeholder="Enter Your Password"
                                label="Password"
                                textContentType="password"
                                autoCapitalize="none"
                                autoCorrect={ false }
                                isPassword={ true }
                                value={ password }
                                returnKeyType="done"
                                onChangeText={ text => {
                                    setPassword( text );
                                    if( errorMessage ) setErrorMessage( '' );
                                } }
                                onSubmitEditing={ handleLogin }
                            />
                            <View style={ styles.actionContainer }>
                                <TouchableOpacity
                                    onPress={ () => navigation.navigate( 'ForgotPassword' ) }
                                    activeOpacity={ 0.75 }
                                    hitSlop={ { top: 5, right: 5, bottom: 5, left: 5 } }
                                >
                                    <Text style={ [ 
                                        styles.forgotPassword,
                                        {
                                            fontFamily: theme.typography.fontFamily.semibold,
                                            color: theme.colors.primary
                                        }
                                    ] }>
                                        Forgot Password?
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Button disabled={ loading } onPress={ handleLogin }>
                                { loading ? <ActivityIndicator size={ theme.spacing.xl } color={ theme.colors.text } /> : 'Login' }
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
                        <View style={ styles.signUpContainer }>
                            <Text style={ [
                                styles.signUpLink,
                                {
                                    fontFamily: theme.typography.fontFamily.regular,
                                    color: theme.colors.text
                                }
                            ] }>
                                Don't have an account?
                            </Text>
                            <TouchableOpacity
                                onPress={ () => navigation.navigate( 'Register' ) }
                                activeOpacity={ 0.75 }
                                hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                            >
                                <Text style={ { fontFamily: theme.typography.fontFamily.bold, color: theme.colors.primary } }>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
export default Login;

const styles = StyleSheet.create({
    scrollContainer:{
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 24
    },
    loginContainer:{
        gap: 24
    },
    brandTextContainer:{
        alignItems: 'center'
    },
    logo:{
        width: 100,
        height: 100,
        marginBottom: 16
    },
    brand:{
        lineHeight: 58,
        textAlign: 'center',
        marginBottom: 8
    },
    subTitleContainer:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12
    },
    subTitle:{
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    dot:{
        width: 6,
        height: 6,
        borderRadius: 6
    },
    formContainer:{
        gap: 16
    },
    actionContainer:{
        alignItems: 'flex-end'
    },
    forgotPassword:{
        textAlign: 'right'
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
    signUpContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6
    },
    signUpLink:{
        textAlign: 'center'
    },
    errorMessageContainer:{
        borderWidth: 1,
        borderStyle: 'solid'
    }
});