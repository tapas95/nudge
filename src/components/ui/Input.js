import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';

const Input = ( { label, placeholder, isPassword = false, style, ...restProps } ) => {
    const { theme } = useTheme();
    const [ showPassword, setShowPassword ] = useState( false );
    return (
        <View style={ styles.inputContainer }>
            { label ? (
                <Text style={ [ styles.inputLabel, { color: theme.colors.text, marginBottom: theme.spacing.sm } ] }>{ label }</Text>
            ) : null }
            <View style={ styles.fieldContainer }>
                <TextInput
                    placeholder={ placeholder }
                    style={
                        [
                            styles.input,
                            {
                                fontFamily: theme.typography.fontFamily.regular,
                                color: theme.colors.text,
                                backgroundColor: theme.colors.inputBackground,
                                paddingLeft: theme.spacing.lg,
                                paddingRight: isPassword ? 52 : theme.spacing.lg,
                                paddingVertical: theme.spacing.md,
                                borderColor: theme.colors.border,
                                borderRadius: theme.radii.lg,
                            },
                            style
                        ]
                    }
                    placeholderTextColor={ theme.colors.textMuted }
                    secureTextEntry={ isPassword ? !showPassword : false }
                    { ...restProps }
                />
                { isPassword ? 
                    (
                        <TouchableOpacity onPress={ () => setShowPassword( prev => !prev ) } style={ styles.passwordToggle } activeOpacity={ 0.5 } hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }>
                            <Ionicons name={ showPassword ? 'eye-off-outline' : 'eye-outline' } size={ 20 } color={ theme.colors.textSecondary } />
                        </TouchableOpacity>
                    )
                : null }
            </View>
        </View>
    )
}
export default Input;

const styles = StyleSheet.create( {
    fieldContainer:{
        position: 'relative'
    },
    input:{
        borderWidth: 2
    },
    passwordToggle:{
        position: 'absolute',
        top: '50%',
        right: 16,
        marginTop: -10
    }
} );