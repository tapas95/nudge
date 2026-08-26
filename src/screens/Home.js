import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeContext";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Ionicons from '@expo/vector-icons/Ionicons';

const Home = ( { navigation } ) => {
    const { logout } = useAuth();
    const { theme } = useTheme();
    const handleLogout = async () => {
        try{
            await logout();
        } catch( err ){
            console.log( err );
        }
    }
    return (
        <SafeAreaView style={ { flex: 1 } } edges={ [ "bottom" ] }>
            <View style={ styles.homeContainer }>
                <View style={ styles.searchContainer }>
                    <TouchableOpacity
                        style={ styles.iconContainer }
                        hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                        activeOpacity={ 0.75 }
                    >
                        <Ionicons style={ styles.searchIcon } name="search-outline" size={ 24 } color={ theme.colors.text } />
                    </TouchableOpacity>
                    <Input
                        placeholder="Search messages or people"
                        style={ styles.searchInput }
                        placeholderTextColor={ theme.colors.textMuted }
                    />
                </View>
                <Button onPress={ handleLogout }>Logout</Button>
                <TouchableOpacity
                    style={[
                        styles.fab,
                        {
                            backgroundColor: theme.colors.accent,
                            shadowColor: theme.colors.text,
                        },
                    ]}
                    activeOpacity={ 0.85 }
                    onPress={ () => navigation.navigate( 'NewChatModal' ) }
                >
                    <Ionicons name="chatbubble-ellipses-outline" size={ 24 } color={ theme.colors.text } />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
export default Home;

const styles = StyleSheet.create( {
    homeContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16
    },
    searchContainer:{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative'
    },
    iconContainer:{
        position: 'absolute',
        left: 10,
        zIndex: 1
    },
    searchInput:{
        flex: 1,
        paddingLeft: 44,
        width: '100%'
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
} );