import {SQLiteDatabase} from "expo-sqlite";
import {ISignUpForm, ProfileData, UserContextData} from "@/util/interfaces";
import {
    decryptNumber,
    encryptNumber,
    generateUUID,
    hashPassword
} from "@/util/security";
import {UserModel} from "@/util/models";

export const createUser = async (database: SQLiteDatabase, form: ISignUpForm): Promise<UserContextData | null> => {
    try {
        const hashedPassword: string = await hashPassword(form.password);
        const userId = generateUUID();
        const result = await database.runAsync(
            'INSERT INTO User (id, password, biometric_key, default_period_length, default_cycle_length, notes_enabled, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, hashedPassword, form.biometricSetUp, 0, 0, true, new Date().toISOString()])
        if(result.changes > 0){
            const createdUser: UserContextData = {
                id: userId,
                biometric_key: form.biometricSetUp,
                default_period_length: 0,
                default_cycle_length: 0,
                notes_enabled: true
            }
            return createdUser;
        } else return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getFirstUser = async (db: SQLiteDatabase): Promise<UserContextData | null> => {
    try{
        const result = await db.getFirstAsync("SELECT * FROM User LIMIT 1") as UserModel;

        if(!result) return null;

        const decryptedUser: UserContextData = {
            id: result.id,
            biometric_key: result.biometric_key === 1,
            default_cycle_length: result.default_cycle_length ? decryptNumber(result.default_cycle_length) : 0,
            default_period_length: result.default_period_length ? decryptNumber(result.default_period_length) : 0,
            notes_enabled: result.notes_enabled === 1,
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
                `UPDATE User SET default_cycle_length = ?, default_period_length = ?, notes_enabled = ?, updated_at = datetime('now') WHERE id = ?`,
                [
                    encryptNumber(user.default_cycle_length),
                    encryptNumber(user.default_period_length),
                    user.notes_enabled,
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