import {SQLiteDatabase} from "expo-sqlite";
import {ISignUpForm} from "@/util/interfaces";
import {decryptString, encryptString, generateUUID, hashPassword} from "@/util/security";
import {User} from "@/util/models";

export const createUser = async (database: SQLiteDatabase, form: ISignUpForm): Promise<string | undefined> => {
    try {
        const hashedPassword: string = await hashPassword(form.password);
        const userId = generateUUID();
        const result = await database.runAsync(
            'INSERT INTO User (id, password, biometric_key, created_at) VALUES (?, ?, ?, ?)',
            [userId, hashedPassword, form.biometricSetUp, new Date().toISOString()])
        if(result.changes > 0){
            return "SUCCESS";
        }
        return undefined;
    } catch (e) {

    }
}

export const getFirstUser = async (db: SQLiteDatabase): Promise<User | null> => {
    try{
        const result = await db.getFirstAsync("SELECT * FROM User LIMIT 1") as User;
        if(!result) return null;
        const decryptedUser: User = {
            id: result.id,
            biometric_key: result.biometric_key,
            //TODO dodaj se ostala polja
        }
        console.log('biometric status', result.biometric_key)
        return decryptedUser;
    } catch (error) {
        console.error("Error fetching first user:", error);
        return null;
    }
};


