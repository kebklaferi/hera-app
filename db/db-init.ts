import {SQLiteDatabase} from "expo-sqlite";
{
    /*
            DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Cycle;
drop table if EXISTS Daily_log;
     */
}
export async function initializeDatabase(db: SQLiteDatabase) {
    console.log("Initialization - creating database if needed.");
    await db.execAsync(`

        DROP TABLE IF EXISTS User;
        DROP TABLE IF EXISTS Cycle;
        drop table if EXISTS Daily_log;

        CREATE TABLE IF NOT EXISTS User (
            id TEXT PRIMARY KEY,
            biometric_key INTEGER NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME,
            default_period_length TEXT,
            default_cycle_length TEXT,
            notes_enabled INTEGER DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS Cycle (
            id TEXT PRIMARY KEY,
            cycle_start_date TEXT NOT NULL,
            cycle_start_date_plain TEXT NOT NULL ,
            cycle_end_date TEXT NOT NULL,
            period_end_date TEXT NOT NULL,
            follicular_end_date TEXT NOT NULL,
            ovulation_end_date TEXT NOT NULL,
            cycle_length TEXT NOT NULL,
            period_length TEXT NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME,
            user_id TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS Daily_log (
            id TEXT PRIMARY KEY,
            log_date BLOB,
            log_data TEXT,
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

