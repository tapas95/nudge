import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "../../theme/ThemeContext";

const Button = ( props ) => {
    const { theme } = useTheme();
    return (
        <Pressable onPress={ props.onPress }>
            <View style={ [ styles.buttonContainer, { backgroundColor: theme.colors.primary }, props.styles ] }>
                <Text style={ [ styles.buttonText, { color: theme.colors.badgeText } ] }>{ props.children }</Text>
            </View>
        </Pressable>
    );
}
export default Button;

const styles = StyleSheet.create({
    buttonContainer:{
        // flex: 1
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonText:{
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    }
});