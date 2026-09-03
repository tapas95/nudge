import { Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@/theme/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

const Button = ( props ) => {
    const { theme } = useTheme();
    return (
        <Pressable 
            onPress={ props.onPress }
            android_ripple={ { color: theme.colors.primaryDark } }
            style={ ( { pressed } ) => [
                {
                    borderRadius: theme.radii.xl,
                    overflow: 'hidden',
                },
                pressed && styles.pressed
            ] }
            disabled={ props.disabled }
        >
            <LinearGradient
                style={ [
                    styles.btnContainer,
                    {
                        borderRadius: theme.radii.xl,
                        paddingHorizontal: theme.spacing.lg,
                        paddingVertical: theme.spacing.lg
                    },
                    props.style
                ] }
                colors={ [ theme.colors.primary, theme.colors.accent ] }
                start={ { x: 0, y: 0.5 } }
                end={ { x: 1, y: 0.5 } }
            >
                <Text
                    style={ [
                        styles.buttonText,
                        { 
                            fontFamily: theme.typography.fontFamily.bold,
                            color: theme.colors.badgeText,
                            fontSize: theme.spacing.lg,
                            lineHeight: theme.spacing.xl
                        }
                    ] }
                >
                    { props.children }
                </Text>
            </LinearGradient>
        </Pressable>
    );
}
export default Button;

const styles = StyleSheet.create( {
    btnContainer:{
        alignItems: 'center'
    },
    buttonText:{
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    pressed:{
        opacity: 0.75,
    }
});