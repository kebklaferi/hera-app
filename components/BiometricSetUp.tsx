import {BiometricSetUpProps} from "@/util/interfaces";
import {Alert, TouchableOpacity, View, Text} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

export const BiometricSetUp = ({ onSetupComplete }: BiometricSetUpProps) => {
    const setupBiometricAuth = async () => {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Confirm fingerprint",
        });

        if (result.success) {
            Alert.alert("Biometric Enabled", "Biometric authentication is now active.");
            onSetupComplete();
        } else {
            Alert.alert("Failed", "Authentication was canceled or failed.");
        }
    };

    return (
        <View className="items-center my-4">
            <TouchableOpacity
                onPress={setupBiometricAuth}
                className="bg-burnt-sienna py-2 px-8 rounded-2xl"
            >
                <Text className="text-white text-lg">Set Up Biometric Auth</Text>
            </TouchableOpacity>
        </View>
    );
};
