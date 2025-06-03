import {Button, Text, View} from "react-native";
import {useRouter} from "expo-router";
import {useEffect, useState} from "react";
import {useSQLiteContext} from "expo-sqlite";
import {getFirstUser} from "@/db/user-service";
import {useUser} from "@/context/UserContext";
import {authenticateBiometric, checkBiometricSupport, isBiometricEnrolled} from "@/util/biometrics";

const LogIn = () => {
    const router = useRouter();
    const { user } = useUser();

    useEffect(() => {
        if(user?.biometric_key){
            autoBiometricLogin();
        }
    }, [])

    const autoBiometricLogin = async () => {
        const supported = await checkBiometricSupport();
        const enrolled = await isBiometricEnrolled();
        if(supported && enrolled) {
            const success = await authenticateBiometric("Login with touch id")
            if (success) {
                router.push("/(tabs)/home");
            }
        }
    }

    const handlePasswordLogin = () => {
      //todo implementiraj password login
    }

    return (
        <View>
            <Text> {user?.username}</Text>
            <Text> Log into existing account.</Text>
            <Button title={"Logging in with password"} />
            <Text> --------</Text>
            <Button title={"Logging in with touch id"} onPress={autoBiometricLogin}/>
        </View>
    );
}

export default LogIn;