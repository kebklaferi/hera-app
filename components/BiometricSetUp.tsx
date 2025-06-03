import {TouchableOpacity, View, Text, Alert} from "react-native";
import {useEffect, useState} from "react";
import {authenticateBiometric, checkBiometricSupport, isBiometricEnrolled} from "@/util/biometrics";
interface BiometricSetupProps {
    onSetupComplete?: () => void; // Callback when setup is successfully completed
}
export const BiometricSetUp = ({onSetupComplete}: BiometricSetupProps) => {
    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    useEffect( () => {
        const checkDeviceBiometrics = async () => {
            const result = await checkBiometricSupport();
            setIsBiometricSupported(result);
        }
        checkDeviceBiometrics();
    }, [])


    const setupBiometricAuth = async () => {
        if (!isBiometricSupported) {
            Alert.alert(
                "Touch ID Not Supported",
                "Your device does not support Touch ID."
            );
            return;
        }
        const savedBiometrics = await isBiometricEnrolled();
        if (!savedBiometrics) {
            Alert.alert(
                "No Touch ID Records",
                "Please set up Touch ID on your device first."
            );
            return;
        }

        const result = await authenticateBiometric("Add touch id authentication", false);

        if (result) {
            Alert.alert("Success", "Touch ID has been set up!");
            onSetupComplete && onSetupComplete(); // Trigger callback if defined
        } else {
            Alert.alert(
                "Failed",
                "Touch ID setup was canceled or failed."
            );

        }
    }
    return(
        <View className="my-4 items-center">
            <TouchableOpacity
                className={`bg-burnt-sienna py-2 px-8 rounded-2xl ${!isBiometricSupported && "opacity-50"}`}
                activeOpacity={0.7}
                onPress={setupBiometricAuth}
                disabled={!isBiometricSupported}
            >
                <Text className="text-white text-xl">
                    Set up Biometric Auth
                </Text>
            </TouchableOpacity>
        </View>
    );
}