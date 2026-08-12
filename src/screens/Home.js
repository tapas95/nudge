import { View, Text, StyleSheet } from "react-native";

const Home = () => {
    return (
        <View style={ styles.homeContainer }>
            <Text>Home</Text>
        </View>
    );
};
export default Home;

const styles = StyleSheet.create( {
    homeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
} );