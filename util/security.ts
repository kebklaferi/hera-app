import {CryptoDigestAlgorithm, digestStringAsync, randomUUID} from "expo-crypto";
import CryptoJS from 'react-native-crypto-js';
import {fromDateString, toDateString} from "@/util/dateHelpers";

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

export const encryptDateToString = (date: Date): string => {
    const dateString = toDateString(date);
    return encryptString(dateString);
}

export const decryptFromStringToDate = (encryptedString: string): Date => {
    const stringDate = decryptString(encryptedString);
    return fromDateString(stringDate);
}

export const encryptData = async (data: object, password: string): Promise<string> => {
    const json = JSON.stringify(data);
    const hashedPassword = await digestStringAsync(
        CryptoDigestAlgorithm.SHA256,
        password
    );
    const encrypted = CryptoJS.AES.encrypt(json, hashedPassword).toString();

    return encrypted;
}

export const decryptData = async (encryptedJson: string, password: string): Promise<object | null> => {
    try {
        const { ciphertext } = JSON.parse(encryptedJson);

        const hashedPassword = await digestStringAsync(
            CryptoDigestAlgorithm.SHA256,
            password
        );

        const decrypted = CryptoJS.AES.decrypt(ciphertext, hashedPassword);
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

        return JSON.parse(decryptedText);
    } catch (e) {
        console.error('Failed to decrypt or parse data:', e);
        return null;
    }
}