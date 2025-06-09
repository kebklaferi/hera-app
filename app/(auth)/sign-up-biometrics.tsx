import {SafeAreaView, TouchableOpacity, Text, View} from "react-native";
import {BiometricSetUp} from "@/components/BiometricSetUp";
import {useRouter} from "expo-router";
import {useEffect, useState} from "react";
import * as LocalAuthentication from "expo-local-authentication";

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
            <View className="items-center">
                {
                    biometricData.biometricSetUp ?
                        <Text>
                            set up! daj ikono za uspešen set up al pa animacijo namesto alerta
                        </Text>
                        :
                    <BiometricSetUp onSetupComplete={() =>
                        setBiometricData((prev) => ({ ...prev, biometricSetUp: true }))
                    } />
                }
                <TouchableOpacity
                    className="bg-burnt-sienna py-2 px-8 rounded-2xl mt-10"
                    onPress={proceed}
                >
                    <Text className="text-white text-lg">Continue</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView className="bg-white flex-1 justify-center items-center px-6">
            <Text className="text-3xl mb-6 font-bold">Enable Biometric Login?</Text>
            {renderContent()}
        </SafeAreaView>
    );
}
export default SignUpBiometrics;