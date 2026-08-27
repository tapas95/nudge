import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/theme/ThemeContext";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Input from "@/components/ui/Input";
import Ionicons from '@expo/vector-icons/Ionicons';

const Home = ( { navigation } ) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    return (
        <View style={ { flex: 1, backgroundColor: theme.colors.background } }>
            <View style={ [
                styles.homeHeader,
                {
                    paddingTop: insets.top + 12,
                    backgroundColor: theme.colors.headerBackground
                }
            ] }>
                <TouchableOpacity
                    hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                    activeOpacity={ 0.75 }
                >
                    <View style={ styles.userContainer }>
                        <View style={ [
                            styles.userAvatarContainer,
                            {
                                borderColor: theme.colors.text
                            }
                        ] }>
                            <Image
                                source={ { uri: user?.avatarUrl } }
                                width={ 32 }
                                height={ 32 }
                                resizeMode="cover"
                                style={ styles.userAvatar }
                            />
                            <View style={ [
                                styles.currentStatus,
                                {
                                    backgroundColor: user.isOnline ? theme.colors.success : theme.colors.danger
                                }
                            ] }></View>
                        </View>
                        <Text
                            style={ [
                                styles.username,
                                {
                                    fontFamily: theme.typography.fontFamily.bold,
                                    color: theme.colors.text
                                }
                            ] }
                        >
                            Hi, { user?.displayName?.split( ' ' )[ 0 ] }
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
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
        </View>
    );
};
export default Home;

const styles = StyleSheet.create( {
    homeHeader:{
        paddingHorizontal: 16,
        paddingBottom: 12
    },
    userContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    userAvatarContainer:{
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 32,
        position: 'relative'
    },
    userAvatar:{
        borderRadius: 32,
    },
    currentStatus:{
        width: 8,
        height: 8,
        borderRadius: 8,
        position: 'absolute',
        right: 0,
        bottom: 0,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#ffffff'
    },
    username:{
        fontSize: 16,
        lineHeight: 22
    },
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
        paddingLeft: 44,
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