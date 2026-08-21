import { useState } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity, Platform, ScrollView, KeyboardAvoidingView, ActivityIndicator, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import GoogleButton from "@/components/ui/GoogleButton";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = ( { navigation } ) => {
    const { theme } = useTheme();
    const { register } = useAuth();
    const [ name, setName ] = useState( '' );
    const [ email, setEmail ] = useState( '' );
    // const [ phone, setPhone ] = useState( '' );
    const [ password, setPassword ] = useState( '' );
    const [ confirmPassword, setConfirmPassword ] = useState( '' );
    const [ loading, setLoading ] = useState( false );
    const [ errorMessage, setErrorMessage ] = useState( '' );

    const clearError = () => errorMessage && setErrorMessage( '' );
    const validateForm = () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        // const trimmedPhone = phone.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();
        if( !trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword ){
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
        if( trimmedPassword !== trimmedConfirmPassword ){
            setErrorMessage( 'Password and Confirm Password must match.' );
            return false;
        }
        return true;
    }

    const handleRegister = async () => {
        Keyboard.dismiss();
        setErrorMessage( '' );
        if( !validateForm() ) return;
        setLoading( true );
        try{
            const result = await register( email.trim(), password.trim(), name.trim() );
            if( !result.success ){
                setErrorMessage( result.error || 'Failed to create account.' );
            }
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
                    <View style={ styles.registerContainer }>
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
                                    Create
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
                                    Your Account
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
                                Join Nudge and start connecting with the people who matter.
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
                                placeholder="Enter Full Name"
                                label="Full Name"
                                value={ name }
                                autoCorrect={ false }
                                autoCapitalize="words"
                                textContentType="name"
                                returnKeyType="next"
                                onChangeText={ text => {
                                    setName( text );
                                    clearError();
                                } }
                            />
                            <Input
                                placeholder="Enter Your Email"
                                label="Email"
                                value={ email }
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={ false }
                                textContentType="emailAddress"
                                returnKeyType="next"
                                onChangeText={ text => {
                                    setEmail( text.toLowerCase() );
                                    clearError();
                                } }
                            />
                            {/* <Input
                                placeholder="Enter Phone Number"
                                label="Phone"
                                value={ phone }
                                keyboardType="phone-pad"
                                autoCorrect={ false }
                                textContentType="telephoneNumber"
                                maxLength={ 10 }
                                onChangeText={ text => {
                                    setPhone( text );
                                } }
                            /> */}
                            <Input
                                placeholder="Enter Your Password"
                                label="Password"
                                textContentType="newPassword"
                                autoCapitalize="none"
                                autoCorrect={ false }
                                isPassword={ true }
                                value={ password }
                                returnKeyType="next"
                                onChangeText={ text => {
                                    setPassword( text );
                                    clearError();
                                } }
                            />
                            <Input
                                placeholder="Enter Password Again"
                                label="Confirm Password"
                                textContentType="newPassword"
                                autoCapitalize="none"
                                autoCorrect={ false }
                                isPassword={ true }
                                value={ confirmPassword }
                                returnKeyType="done"
                                onChangeText={ text => {
                                    setConfirmPassword( text );
                                    clearError();
                                } }
                                onSubmitEditing={ handleRegister }
                            />
                            <Button disabled={ loading } onPress={ handleRegister }>
                                { loading ? <ActivityIndicator size={ theme.spacing.xl } color={ theme.colors.text } /> : 'Create Account' }
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
                        <View style={ styles.loginContainer }>
                            <Text style={ [
                                styles.loginLink,
                                {
                                    fontFamily: theme.typography.fontFamily.regular,
                                    color: theme.colors.text
                                }
                            ] }>
                                Already have an account?
                            </Text>
                            <TouchableOpacity
                                onPress={ () => navigation.navigate( 'Login' ) }
                                activeOpacity={ 0.75 }
                                hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                            >
                                <Text style={ { fontFamily: theme.typography.fontFamily.bold, color: theme.colors.primary } }>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}
export default Register;

const styles = StyleSheet.create( {
    scrollContainer:{
        flexGrow: 1,
        justifyContent: 'center',
        paddingVertical: 24
    },
    registerContainer:{
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
    loginContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6
    },
    loginLink:{
        textAlign: 'center'
    },
    errorMessageContainer:{
        borderWidth: 1,
        borderStyle: 'solid'
    }
} );