import {BiometricSetUpProps} from "@/util/interfaces";
import {Alert, TouchableOpacity, View, Text, StyleSheet} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import Ionicons from "@expo/vector-icons/Ionicons";

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
        <View style={styles.fingerprintContainer}>
            <View style={styles.fingerprintCircle}>
                <TouchableOpacity
                    onPress={setupBiometricAuth}
                >
                    <Ionicons name="finger-print" size={80} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    fingerprintContainer: {
        position: "relative",
        marginBottom: 160,
        marginTop: 90,
    },
    fingerprintCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "#f2f2f2",
        alignItems: "center",
        justifyContent: "center",
    },
});