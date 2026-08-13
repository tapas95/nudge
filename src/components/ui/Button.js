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
                    borderRadius: theme.radii.xs,
                    overflow: 'hidden',
                },
                pressed && styles.pressed
            ] }
            disabled={ props.disabled }
        >
            <LinearGradient
                style={ {
                    borderRadius: theme.radii.xs,
                    paddingHorizontal: theme.spacing.xl,
                    paddingVertical: theme.spacing.md,
                } }
                colors={ [ theme.colors.primary, theme.colors.primaryDark ] }
            >
                <Text
                    style={ [
                        styles.buttonText,
                        { 
                            color: theme.colors.badgeText,
                            fontFamily: theme.typography.fontFamily.bold,
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

const styles = StyleSheet.create({
    buttonText:{
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    pressed:{
        opacity: 0.75,
    }
});