import { useAuth } from "@/context/AuthContext";
import { useTheme } from '@/theme/ThemeContext';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Image, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from "expo-linear-gradient";

const Profile = ( { navigation } ) => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    console.log( JSON.stringify( user, null, 2 ) );
    return (
        <View style={ styles.profileWrapper }>
            <View style={ [
                styles.profileHeader,
                {
                    paddingTop: insets.top + 12,
                    backgroundColor: theme.colors.headerBackground
                }
            ] }>
                <TouchableOpacity
                    hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                    activeOpacity={ 0.75 }
                    onPress={ () => navigation.goBack() }
                >
                    <Ionicons name="arrow-back-outline" size={ 24 } color={ theme.colors.text } />
                </TouchableOpacity>
                <Text style={ [
                    styles.headerTitle,
                    {
                        fontFamily: theme.typography.fontFamily.bold,
                        color: theme.colors.text
                    }
                ] }>
                    Profile
                </Text>
                <TouchableOpacity
                    hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                    activeOpacity={ 0.75 }
                >
                    <Ionicons name="settings-outline" size={ 24 } color={ theme.colors.text } />
                </TouchableOpacity>
            </View>
            <View style={ [
                styles.profileTopContainer
            ] }>
                <LinearGradient
                    style={ styles.avatarGradient }
                    colors={ [ theme.colors.accent, theme.colors.primary ] }
                >
                    <View style={ [
                        styles.avatarContainer,
                        {
                            backgroundColor: theme.colors.background
                        }
                    ] }>
                        <Image source={ { uri: user?.avatarUrl } } resizeMode="cover" style={ styles.avatarImage } />
                    </View>
                    <TouchableOpacity
                        hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                        activeOpacity={ 0.75 }
                        style={ [
                            styles.avatarEditButton,
                            {
                                backgroundColor: theme.colors.primary
                            }
                        ] }
                    >
                        <Ionicons name="camera-outline" size={ 20 } color={ theme.colors.text } />
                    </TouchableOpacity>
                </LinearGradient>
                <View style={ styles.userNameContainer }>
                    <Text style={ [
                        styles.userName,
                        {
                            fontFamily: theme.typography.fontFamily.bold,
                            color: theme.colors.text
                        }
                    ] }>
                        { user?.displayName }
                    </Text>
                    <TouchableOpacity
                        hitSlop={ { top: 10, right: 10, bottom: 10, left: 10 } }
                        activeOpacity={ 0.75 }
                    >
                        <Ionicons name="pencil" size={ 20 } color={ theme.colors.text } />
                    </TouchableOpacity>
                </View>
                <Text style={ [
                    styles.userabout,
                    {
                        fontFamily: theme.typography.fontFamily.regular,
                        color: theme.colors.textMuted
                    }
                ] }>
                    { user?.about }
                </Text>
                { user?.isOnline && (
                    <Text
                        style={ [
                            styles.userOnline,
                            {
                                fontFamily: theme.typography.fontFamily.medium,
                                backgroundColor: theme.colors.success,
                                color: theme.colors.text
                            }
                        ] }
                    >
                        Online
                    </Text>
                ) }
            </View>
            <ScrollView style={ styles.settingsContainer }>
                <TouchableOpacity
                    activeOpacity={ 0.75 }
                    style={ [
                        styles.settingOption,
                        {
                            backgroundColor: theme.colors.surface,
                            borderRadius: theme.radii.md,
                        }
                    ] }
                >
                    <View style={ [
                        styles.iconContainer,
                        {
                            backgroundColor: theme.colors.primaryMuted,
                            borderRadius: theme.radii.sm
                        }
                    ] }>
                        <Ionicons name="person-outline" size={ 24 } color={ theme.colors.primary } />
                    </View>
                    <View>
                        <Text style={ [
                            styles.settingTitle,
                            {
                                fontFamily: theme.typography.fontFamily.semibold,
                                color: theme.colors.text
                            }
                        ] }>
                            Account
                        </Text>
                        <Text style={ [
                            styles.settingInfo,
                            {
                                fontFamily: theme.typography.fontFamily.regular,
                                color: theme.colors.textSecondary
                            }
                        ] }>
                            Manage your personal info
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" style={ styles.settingAction } size={ 24 } color={ theme.colors.textSecondary } />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={ 0.75 }
                    style={ [
                        styles.settingOption,
                        {
                            backgroundColor: theme.colors.surface,
                            borderRadius: theme.radii.md,
                        }
                    ] }
                >
                    <View style={ [
                        styles.iconContainer,
                        {
                            backgroundColor: theme.colors.primaryMuted,
                            borderRadius: theme.radii.sm
                        }
                    ] }>
                        <Ionicons name="lock-open-outline" size={ 24 } color={ theme.colors.primary } />
                    </View>
                    <View>
                        <Text style={ [
                            styles.settingTitle,
                            {
                                fontFamily: theme.typography.fontFamily.semibold,
                                color: theme.colors.text
                            }
                        ] }>
                            Privary
                        </Text>
                        <Text style={ [
                            styles.settingInfo,
                            {
                                fontFamily: theme.typography.fontFamily.regular,
                                color: theme.colors.textSecondary
                            }
                        ] }>
                            Control your privacy settings
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" style={ styles.settingAction } size={ 24 } color={ theme.colors.textSecondary } />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={ 0.75 }
                    style={ [
                        styles.settingOption,
                        {
                            backgroundColor: theme.colors.surface,
                            borderRadius: theme.radii.md,
                        }
                    ] }
                >
                    <View style={ [
                        styles.iconContainer,
                        {
                            backgroundColor: theme.colors.primaryMuted,
                            borderRadius: theme.radii.sm
                        }
                    ] }>
                        <Ionicons name="notifications-outline" size={ 24 } color={ theme.colors.primary } />
                    </View>
                    <View>
                        <Text style={ [
                            styles.settingTitle,
                            {
                                fontFamily: theme.typography.fontFamily.semibold,
                                color: theme.colors.text
                            }
                        ] }>
                            Notifications
                        </Text>
                        <Text style={ [
                            styles.settingInfo,
                            {
                                fontFamily: theme.typography.fontFamily.regular,
                                color: theme.colors.textSecondary
                            }
                        ] }>
                            Customize your notification
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" style={ styles.settingAction } size={ 24 } color={ theme.colors.textSecondary } />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={ 0.75 }
                    style={ [
                        styles.settingOption,
                        {
                            backgroundColor: theme.colors.surface,
                            borderRadius: theme.radii.md,
                        }
                    ] }
                >
                    <View style={ [
                        styles.iconContainer,
                        {
                            backgroundColor: theme.colors.primaryMuted,
                            borderRadius: theme.radii.sm
                        }
                    ] }>
                        <Ionicons name="color-palette-outline" size={ 24 } color={ theme.colors.primary } />
                    </View>
                    <View>
                        <Text style={ [
                            styles.settingTitle,
                            {
                                fontFamily: theme.typography.fontFamily.semibold,
                                color: theme.colors.text
                            }
                        ] }>
                            Appearance
                        </Text>
                        <Text style={ [
                            styles.settingInfo,
                            {
                                fontFamily: theme.typography.fontFamily.regular,
                                color: theme.colors.textSecondary
                            }
                        ] }>
                            Theme, wallpapers, and more
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" style={ styles.settingAction } size={ 24 } color={ theme.colors.textSecondary } />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={ 0.75 }
                    style={ [
                        styles.settingOption,
                        {
                            backgroundColor: theme.colors.surface,
                            borderRadius: theme.radii.md,
                        }
                    ] }
                    onPress={ () => logout() }
                >
                    <View style={ [
                        styles.iconContainer,
                        {
                            backgroundColor: theme.colors.dangerMuted,
                            borderRadius: theme.radii.sm
                        }
                    ] }>
                        <Ionicons name="log-out-outline" size={ 24 } color={ theme.colors.danger } />
                    </View>
                    <View>
                        <Text style={ [
                            styles.settingTitle,
                            {
                                fontFamily: theme.typography.fontFamily.semibold,
                                color: theme.colors.text
                            }
                        ] }>
                            Log Out
                        </Text>
                        <Text style={ [
                            styles.settingInfo,
                            {
                                fontFamily: theme.typography.fontFamily.regular,
                                color: theme.colors.textSecondary
                            }
                        ] }>
                            Sign out from your account
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" style={ styles.settingAction } size={ 24 } color={ theme.colors.textSecondary } />
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}
export default Profile;

const styles = StyleSheet.create( {
    profileWrapper:{
        flex: 1,
    },
    profileHeader:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingHorizontal: 16,
        paddingBottom: 12
    },
    headerTitle:{
        fontSize: 20,
        lineHeight: 24,
    },
    profileTopContainer:{
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    avatarGradient:{
        padding: 3,
        marginBottom: 16,
        borderRadius: 100,
        position: 'relative',
    },
    avatarContainer: {
        width: 100,
        height: 100,
        padding: 4,
        backgroundColor: '#fff',
        borderRadius: 50,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    avatarEditButton:{
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 0,
        right: 0
    },
    userOnline:{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderTopLeftRadius: 4,
        marginTop: 8,
        fontSize: 14,
        lineHeight: 18,
    },
    userNameContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    userName:{
        fontSize: 24,
        lineHeight: 28,
    },
    userabout:{
        fontSize: 16,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 4,
    },
    settingsContainer:{
        flex: 1,
        paddingHorizontal: 16,
    },
    settingOption:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        marginBottom: 8
    },
    iconContainer:{
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    settingTitle:{
        fontSize: 16,
        lineHeight: 20,
    },
    settingInfo:{
        fontSize: 12,
        lineHeight: 18,
    },
    settingAction:{
        marginLeft: 'auto'
    }
} );