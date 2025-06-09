import {CryptoDigestAlgorithm, digestStringAsync, randomUUID} from "expo-crypto";
import CryptoJS from 'react-native-crypto-js';

export const generateUUID = (): string => {
    return randomUUID();
}
export const hashPassword = async (password: string): Promise<string> => {
    try {
        const hashedPassword = await digestStringAsync(
            CryptoDigestAlgorithm.SHA256,
            password
        );
        console.log("Hashed Password:", hashedPassword);
        return hashedPassword;
    } catch (error) {
        console.error("Hashing failed", error);
        throw new Error("Error hashing password");
    }
}

const SECRET_KEY = "*>4LiX>pa&g=2U6SuW;S`|oG^c*&6uw*QWBe?O=z";
export const encryptString = (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export const decryptString = (data: string): string => {
    const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export const encryptNumber = (num: number): string => {
    return encryptString(num.toString());
};

export const decryptNumber = (data: string): number => {
    const decrypted = decryptString(data);
    return parseInt(decrypted, 10);
};