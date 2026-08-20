import { useState } from "react";
import { Text, View, StyleSheet, Image, ScrollView, Platform, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/theme/ThemeContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import GoogleButton from "@/components/ui/GoogleButton";

const ForgotPassword = () => {
    const { theme } = useTheme();
    const [ email, setEmail ] = useState( '' );
    const [ errorMessage, setErrorMessage ] = useState( '' );
    return(
        <SafeAreaView style={ { flex: 1 } }>
            <KeyboardAvoidingView style={ { flex: 1 } } behavior={ Platform.OS === 'ios' ? 'padding' : undefined }>
                <ScrollView showsVerticalScrollIndicator={ false } keyboardShouldPersistTaps="handled" contentContainerStyle={ styles.scrollContainer }>
                    <View style={ styles.forgotPasswordContainer }>
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
                                onChangeText={ text => {
                                    setEmail( text );
                                    if( errorMessage ) setErrorMessage( '' );
                                } }
                            />
                             <Button>
                                Send Reset Link
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
    }
} );