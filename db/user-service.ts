import {SQLiteDatabase} from "expo-sqlite";
import {ISignUpForm, ProfileData, UserContextData} from "@/util/interfaces";
import {
    decryptNumber,
    decryptString,
    encryptDate,
    encryptNumber,
    encryptString,
    generateUUID,
    hashPassword
} from "@/util/security";
import {User} from "@/util/models";

export const createUser = async (database: SQLiteDatabase, form: ISignUpForm): Promise<UserContextData> => {
    try {
        const hashedPassword: string = await hashPassword(form.password);
        const userId = generateUUID();
        const result = await database.runAsync(
            'INSERT INTO User (id, password, biometric_key, created_at) VALUES (?, ?, ?, ?)',
            [userId, hashedPassword, form.biometricSetUp, new Date().toISOString()])
        if(result.changes > 0){
            return {
                id: userId,
                biometric_key: form.biometricSetUp,
                default_period_length: undefined,
                default_cycle_length: undefined,
            };
        }
    } catch (e) {

    }
}

export const getFirstUser = async (db: SQLiteDatabase): Promise<UserContextData | null> => {
    try{
        const result = await db.getFirstAsync("SELECT * FROM User LIMIT 1");
        if(!result || !result.default_period_length || !result.default_cycle_length) return null;
        const decryptedUser: UserContextData = {
            id: result.id,
            biometric_key: result?.biometric_key,
            default_cycle_length: decryptNumber(result.default_cycle_length),
            default_period_length: decryptNumber(result?.default_period_length)
        }
        return decryptedUser;
    } catch (error) {
        console.error("Error fetching first user:", error);
        return null;
    }
};

export const updateUser = async (db: SQLiteDatabase, user: UserContextData): Promise<boolean> => {
    try {
        if(user.default_cycle_length && user.default_period_length){
            await db.runAsync(
                `UPDATE User SET default_cycle_length = ?, default_period_length = ?, updated_at = datetime('now') WHERE id = ?`,
                [
                    encryptNumber(user.default_cycle_length),
                    encryptNumber(user.default_period_length),
                    user.id
                ]
            );
        }
        return true;
    } catch (error) {
        console.error("Failed to update user", error);
        return false;
    }
};

export const getProfileData = async (db: SQLiteDatabase): Promise<ProfileData | null> => {
    const result = await db.getFirstAsync(
        `SELECT notes_enabled, default_cycle_length, default_period_length FROM User LIMIT 1`
    );

    if (!result) return null;

    return {
        notes_enabled: !!result.notes_enabled,
        default_cycle_length: decryptNumber(result.default_cycle_length),
        default_period_length: decryptNumber(result.default_period_length),
    };
};