import { Text, TouchableOpacity, StyleSheet } from "react-native";
import GoogleIcon from '@/components/ui/icons/GoogleIcon';
import { useTheme } from "@/theme/ThemeContext"; 

const GoogleButton = () => {
    const { theme } = useTheme();
    return(
        <TouchableOpacity
            style={ [
                styles.googleBtn,
                {
                    paddingHorizontal: theme.spacing.lg,
                    paddingVertical: theme.spacing.md,
                    borderColor: theme.colors.textMuted,
                    borderRadius: theme.radii.full
                }
            ] }
            activeOpacity={ 0.75 }
        >
            <GoogleIcon width={ 24 } height={ 24 }></GoogleIcon>
            <Text style={
                {
                    fontFamily: theme.typography.fontFamily.semibold,
                    fontSize: theme.spacing.lg,
                    lineHeight: theme.spacing.xl,
                    color: theme.colors.text
                }
            } >
                Continue With Google
            </Text>
        </TouchableOpacity>
    )
}
export default GoogleButton;

const styles = StyleSheet.create({
    googleBtn:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderStyle: 'solid'
    }
});