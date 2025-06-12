import {SQLiteDatabase} from "expo-sqlite";

export const getExportData = async (db: SQLiteDatabase): Promise<any> => {
    const cycles = await db.getAllAsync('SELECT * FROM Cycle');
    const notes = await db.getAllAsync('SELECT * FROM User');
    return {
        cycles,
        notes,
    };
}

export const setImportData = async () => {

}

export const getDbPasswordHash = async (db: SQLiteDatabase): Promise<string | null> => {
    try{
        const result = await db.getFirstAsync<{ password: string }>('SELECT password FROM User LIMIT 1');
        return result?.password ?? null;
    } catch (error) {
        console.error(error);
        return null;
    }
}