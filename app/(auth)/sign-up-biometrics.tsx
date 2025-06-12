import {SafeAreaView, TouchableOpacity, StyleSheet, Text, View, Alert} from "react-native";
import {BiometricSetUp} from "@/components/BiometricSetUp";
import {useRouter} from "expo-router";
import {useEffect, useState} from "react";
import * as LocalAuthentication from "expo-local-authentication";
import Ionicons from "@expo/vector-icons/Ionicons";

const SignUpBiometrics = () => {
    const [biometricData, setBiometricData] = useState({
        isTouchIdAvailable: false,
        biometricSetUp: false,
        isEnrolled: false,
    });
    const router = useRouter();

    useEffect(() => {
        const checkBiometricAvailability = async () => {
            const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();
            setBiometricData((prev) => ({
                ...prev,
                isTouchIdAvailable: supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT),
                isEnrolled: enrolled,
            }));
        };
        checkBiometricAvailability();
    }, []);

    const setupBiometricAuth = async () => {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Confirm fingerprint",
        });
        if (result.success) {
            setBiometricData((prev) => ({
                ...prev,
                biometricSetUp: true
            }))
            Alert.alert("Biometric Enabled", "Biometric authentication is now active.");
        } else {
            Alert.alert("Failed", "Authentication was canceled or failed.");
        }
    };

    const proceed = () => {
        router.push({
            pathname: "/(auth)/sign-up-password",
            params: { biometricSetUp: biometricData.biometricSetUp.toString() }, // pass as string
        });
    };

    const renderContent = () => {
        if (!biometricData.isTouchIdAvailable) {
            return (
                <View className="items-center">
                    <Text className="text-base text-center mb-4">
                        Biometric authentication for Touch ID is not supported on this device.
                    </Text>
                    <Text>You will set a password for security purposes.</Text>
                    <TouchableOpacity
                        className="bg-burnt-sienna py-2 px-8 rounded-2xl mt-10"
                        onPress={proceed}
                    >
                        <Text className="text-white text-lg">Continue</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        if (!biometricData.isEnrolled) {
            return (
                <View className="items-center">
                    <Text className="text-base text-center mb-4">
                        Biometrics are supported but not set up. Enable them in settings for better security.
                    </Text>
                    <TouchableOpacity
                        className="bg-burnt-sienna py-2 px-8 rounded-2xl mt-10"
                        onPress={proceed}
                    >
                        <Text className="text-white text-lg">Continue</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return (
            <View style={styles.centered}>
                <View style={styles.fingerprintContainer}>
                    <View style={styles.fingerprintCircle} className={biometricData.biometricSetUp ? `bg-green-200` : `bg-gray-200`}>
                        <TouchableOpacity
                            onPress={setupBiometricAuth}
                        >
                            <Ionicons name="finger-print" size={80} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.button} onPress={proceed}>
                    <Text style={styles.buttonText}>
                        Continue
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView className="bg-white flex-1 justify-center items-center px-6">
            <View style={styles.container}>
                <Text style={styles.title}>Enable Touch ID</Text>
                <Text style={styles.subtitle}>
                    You can enable touch id to log in instead of password
                </Text>
                {renderContent()}
            </View>

        </SafeAreaView>
    );
}
export default SignUpBiometrics;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
    },
    button: {
        backgroundColor: '#F47251',
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    centered: {
        alignItems: "center",
    },
    successText: {
        fontSize: 16,
        color: "green",
        marginBottom: 20,
        textAlign: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        paddingVertical: 8
    },
    fingerprintContainer: {
        position: "relative",
        marginBottom: 160,
        marginTop: 90,
    },
    fingerprintCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: "center",
        justifyContent: "center",
    },
});