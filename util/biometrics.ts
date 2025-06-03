import * as LocalAuthentication from "expo-local-authentication";

export const checkBiometricSupport = async (): Promise<boolean> => {
    const supported = await LocalAuthentication.hasHardwareAsync();
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    return supported && types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
};

export const isBiometricEnrolled = async (): Promise<boolean> => {
    return await LocalAuthentication.isEnrolledAsync();
};

export const authenticateBiometric = async (
    promptMessage: string,
    fallbackToDevice: boolean = false
): Promise<boolean> => {
    const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        disableDeviceFallback: !fallbackToDevice,
        cancelLabel: "Cancel"
    });
    return result.success;
};
