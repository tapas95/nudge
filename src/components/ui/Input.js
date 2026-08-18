import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';

const Input = props => {
    const { theme } = useTheme();
    return (
        <View style={ styles.inputContainer }>
            <Text style={ [ styles.inputLabel, { color: theme.colors.text, marginBottom: theme.spacing.sm } ] }>{ props.label }</Text>
            <TextInput
                placeholder={ props.placeholder }
                style={
                    [
                        styles.input,
                        {
                            fontFamily: theme.typography.fontFamily.regular,
                            color: theme.colors.text,
                            backgroundColor: theme.colors.inputBackground,
                            paddingHorizontal: theme.spacing.lg,
                            paddingVertical: theme.spacing.md,
                            borderColor: theme.colors.border,
                            borderRadius: theme.radii.lg,
                        }
                    ]
                }
                placeholderTextColor={ theme.colors.textMuted }
                { ...props }
            />
        </View>
    )
}
export default Input;

const styles = StyleSheet.create( {
    input:{
        borderWidth: 2
    }
} );