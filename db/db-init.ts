import {SQLiteDatabase} from "expo-sqlite";

export async function initializeDatabase(db: SQLiteDatabase) {
    console.log("Initialization - creating database if needed.");
    await db.execAsync(`

        CREATE TABLE IF NOT EXISTS User (
            id TEXT PRIMARY KEY,
            biometric_key BOOLEAN NOT NULL,
            password BLOB NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME,
            default_period_length BLOB,
            default_cycle_length BLOB
        );

        CREATE TABLE IF NOT EXISTS Cycle (
            id TEXT PRIMARY KEY,
            cycle_start_date BLOB NOT NULL,
            cycle_end_date BLOB NOT NULL,
            period_end_date BLOB NOT NULL,
            follicular_end_date BLOB NOT NULL,
            ovulation_end_date BLOB NOT NULL,
            cycle_length BLOB NOT NULL,
            period_length BLOB NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME,
            user_id TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
            
        );
        CREATE TABLE IF NOT EXISTS Daily_log (
            id TEXT PRIMARY KEY,
            log_date BLOB,
            log_data BLOB,
            created_at DATETIME NOT NULL,
            updated_at DATETIME,
            user_id TEXT NOT NULL,
            cycle_id TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE,
            FOREIGN KEY (cycle_id) REFERENCES Cycle(id) ON DELETE CASCADE
        )
        `
    )
}

