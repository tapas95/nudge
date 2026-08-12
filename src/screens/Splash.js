import { View, Text, StyleSheet } from "react-native";

const Splash = () => {
    return (
        <View style={ styles.splashContainer }>
            <Text>Loading...</Text>
        </View>
    );
};
export default Splash;

const styles = StyleSheet.create( {
    splashContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
} );