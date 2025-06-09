import {SQLiteDatabase} from "expo-sqlite";
import {CycleContextData, UserContextData} from "@/util/interfaces";
import {decryptNumber, decryptString, encryptNumber, encryptString, generateUUID} from "@/util/security";
import {addDays, differenceInDays, subDays} from "date-fns";
import {CycleModel} from "@/util/models";
import {fromDateString, toDateString} from "@/util/dateHelpers";

export const createUserCycle = async (db: SQLiteDatabase, user: UserContextData, period_start_date: Date): Promise<CycleContextData | null> => {
    try {
        if (!user.default_cycle_length || !user.default_period_length) return;
        const cycleId = generateUUID();

        // need to remove time from dates
        // calculate theoretical end date based on default cycle length
        // if the current date is past the expected end, use today as fallback
        // const cycleEndDate = today > expectedCycleEndDate ? today : expectedCycleEndDate;
        // cycle phases logic
        // cycle_end_date == luteal_end_date
        // ovulation 2 weeks before next period; fertile window ovulation_day + 1 && -5
        // fertile window start date - 1; 6 days long fertile window
        const normalized_period_start_date = toDateString(period_start_date);
        const expectedCycleEndDate = toDateString(addDays(normalized_period_start_date, user.default_cycle_length - 1));
        const cycleEndDate = expectedCycleEndDate;
        const actualCycleLength = differenceInDays(cycleEndDate, normalized_period_start_date) + 1;
        const periodEndDate = toDateString(addDays(normalized_period_start_date, user.default_period_length - 1));
        const ovulationEndDate = toDateString(subDays(cycleEndDate, 13));
        const follicularEndDate = toDateString(subDays(ovulationEndDate, 7));

        // encrypted version to save to database
        const encryptedStart = encryptString(normalized_period_start_date);
        const encryptedCycleEnd = encryptString(cycleEndDate);
        const encryptedPeriodEnd = encryptString(periodEndDate);
        const encryptedFollicularEnd = encryptString(follicularEndDate);
        const encryptedOvulationEnd = encryptString(ovulationEndDate);
        const encryptedCycleLength = encryptNumber(actualCycleLength);
        const encryptedPeriodLength = encryptNumber(user.default_period_length);

        const now = new Date().toISOString();

        const result = await db.runAsync(
            `INSERT INTO Cycle (id,
                                cycle_start_date,
                                cycle_end_date,
                                period_end_date,
                                follicular_end_date,
                                ovulation_end_date,
                                cycle_length,
                                period_length,
                                created_at,
                                user_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                cycleId,
                encryptedStart,
                encryptedCycleEnd,
                encryptedPeriodEnd,
                encryptedFollicularEnd,
                encryptedOvulationEnd,
                encryptedCycleLength,
                encryptedPeriodLength,
                now,
                user.id,
            ]
        );
        if (result.changes > 0) {
            console.log("Cycle inserted successfully!");
            console.log("Inserted Cycle ID:", cycleId);
            return {
                id: cycleId,
                cycle_start_date: normalized_period_start_date,
                cycle_end_date: cycleEndDate,
                period_end_date: periodEndDate,
                follicular_end_date: follicularEndDate,
                ovulation_end_date: ovulationEndDate,
                cycle_length: actualCycleLength,
                period_length: user.default_period_length,
                created_at: now,
                updated_at: now,
                user_id: user.id,
            } as CycleContextData;
        } else {
            console.warn("No cycle was inserted.");
        }
    } catch (err) {
        console.error("Failed to create user cycle:", err);
        throw err;
    }
}

//todo also doesnt work as cycle.start_date is encrypted
// need to add cycle_start_date plain_column so i can query
export const fetchLatestCycle = async (db: SQLiteDatabase, userId: string): Promise<CycleContextData> => {
    const [latestCycle] = await db.getAllAsync(
        `SELECT *
     FROM Cycle
     WHERE user_id = ?
     ORDER BY cycle_start_date DESC LIMIT 1`,
        [userId]
    ) as CycleModel;

    return {
        id: latestCycle.id,
        cycle_start_date: fromDateString(decryptString(latestCycle.cycle_start_date)),
        cycle_end_date: fromDateString(decryptString(latestCycle.cycle_end_date)),
        period_end_date: fromDateString(decryptString(latestCycle.period_end_date)),
        follicular_end_date: fromDateString(decryptString(latestCycle.follicular_end_date)),
        ovulation_end_date: fromDateString(decryptString(latestCycle.ovulation_end_date)),
        cycle_length: decryptNumber(latestCycle.cycle_length),
        period_length: decryptNumber(latestCycle.period_length),
        created_at: latestCycle.created_at,
        updated_at: latestCycle.updated_at,
        user_id: latestCycle.user_id,
    };
};
