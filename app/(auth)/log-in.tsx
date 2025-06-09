import {Button, Text, View, StyleSheet, Pressable, BackHandler} from "react-native";
import {useFocusEffect, useNavigation, usePathname, useRouter} from "expo-router";
import {useCallback, useEffect} from "react";
import {useUser} from "@/context/UserContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import {authenticateBiometric, checkBiometricSupport, isBiometricEnrolled} from "@/util/biometrics";

const LogIn = () => {
    const { user } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if(user?.biometric_key){
            autoBiometricLogin();
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => true; // Block back press
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [])
    );
    const autoBiometricLogin = async () => {
        const supported = await checkBiometricSupport();
        const enrolled = await isBiometricEnrolled();
        if(supported && enrolled) {
            const success = await authenticateBiometric("Login with touch id");
            if (success) {
                console.log('autobiometriclogin', pathname);
                router.replace("/(tabs)/home");
            }
        }
    }

    const handlePasswordLogin = () => {
      //todo implementiraj password login
    }

    return (
        !user?.biometric_key
                ?
                <View>
                    <Text style={styles.label}>Enter your password:</Text>
                    <Button title="Log In with Password" onPress={handlePasswordLogin} />
                </View>
                :
                <View style={styles.container}>
                    <Text style={styles.header}>Welcome back!</Text>
                    <Text style={styles.label}>Enter your password:</Text>
                    <Button title="Log In with Password" onPress={handlePasswordLogin} />
                    <Text style={styles.divider}>OR</Text>
                    <Pressable
                        onPress={autoBiometricLogin}
                        style={styles.touchIcon}
                    >
                        <Ionicons name="finger-print" size={60} color="black" />
                    </Pressable>
                </View>
    );
}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#fff",
    },
    touchIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    error: {
        color: "red",
        marginBottom: 10,
    },
    divider: {
        textAlign: "center",
        marginVertical: 15,
        fontSize: 16,
    },
});


export default LogIn;