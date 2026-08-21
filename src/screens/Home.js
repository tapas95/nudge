import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { View, Text, StyleSheet } from "react-native";

const Home = () => {
    const { logout } = useAuth();
    const handleLogout = async () => {
        try{
            await logout();
        } catch( err ){
            console.log( err );
        }
    }
    return (
        <View style={ styles.homeContainer }>
            <Text>Home</Text>
            <Button onPress={ handleLogout }>Logout</Button>
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