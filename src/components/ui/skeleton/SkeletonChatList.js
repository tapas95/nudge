import { useEffect } from "react";
import { useTheme } from "@/theme/ThemeContext";
import { View, StyleSheet, Animated, useAnimatedValue } from "react-native"

const SkeletonChatList = () => {
    const { theme } = useTheme();
    const pulseAnim = useAnimatedValue( 0.3 );
    useEffect( () => {
        const pulse = Animated.loop(
            Animated.sequence( [
                Animated.timing( pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                } ),
                Animated.timing( pulseAnim, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true
                } )
            ] )
        );
        pulse.start();
        return () => pulse.stop();
    }, [ pulseAnim ] )
    const skeletonColor = theme.colors.border;
    return (
        <View style={ styles.chatItemSkeleton }>
            <Animated.View style={ [
                styles.avatarSkeleton,
                { 
                    backgroundColor: skeletonColor,
                    opacity: pulseAnim
                 }
            ] } />
            <View style={ { flex: 1 } }>
                <View style={ styles.chatHeaderContainer }>
                    <Animated.View style={ [
                        styles.nameSkeleton,
                        { 
                            backgroundColor: skeletonColor,
                            opacity: pulseAnim
                        }
                    ] } />
                    <Animated.View style={ [
                        styles.timeSkeleton,
                        { 
                            backgroundColor: skeletonColor,
                            opacity: pulseAnim
                        }
                    ] } />
                </View>
                <Animated.View style={ [
                    styles.messageSkeleton,
                    { 
                        backgroundColor: skeletonColor,
                        opacity: pulseAnim
                    }
                ] } />
            </View>
        </View>
    )
}
export default SkeletonChatList;

const styles = StyleSheet.create( {
    chatItemSkeleton:{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 12
    },
    avatarSkeleton:{
        width: 50,
        height: 50,
        borderRadius: 25
    },
    chatHeaderContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    nameSkeleton:{
        width: '40%',
        height: 22,
        borderRadius: 4,
        marginBottom: 6
    },
    messageSkeleton:{
        width: '60%',
        height: 14,
        borderRadius: 4
    },
    timeSkeleton:{
        width: 30,
        height: 14,
        borderRadius: 4,
    }
} );