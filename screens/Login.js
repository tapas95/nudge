import { View, Text, StyleSheet } from "react-native";
import Button from "../components/ui/Button";

const Login = () => {
    return (
        <View style={ styles.loginContainer }>
            {/* <Text>Login here</Text> */}
            <Button>Click</Button>
        </View>
    );
}
export default Login;

const styles = StyleSheet.create({
    loginContainer:{
        flex: 1,
    }
});