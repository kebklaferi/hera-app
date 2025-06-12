import {SQLiteDatabase} from "expo-sqlite";
import {CycleContextData, UserContextData} from "@/util/interfaces";
import {
    decryptFromStringToDate,
    decryptNumber,
} from "@/util/security";
import {addDays, differenceInDays} from "date-fns";
import {CycleModel} from "@/util/models";
import {fromDateString, refactorDateToDate} from "@/util/dateHelpers";
import {generateCycleData} from "@/util/cycles-utils";

export const initUserCycle = async (db: SQLiteDatabase, user: UserContextData, period_start_date: Date): Promise<CycleContextData | null> => {
    try {
        const currentDate = refactorDateToDate(new Date());
        const periodStartDate = refactorDateToDate(period_start_date);

        if (periodStartDate > currentDate) return null;
        if (!user.default_cycle_length) return null;

        // cycles can be inconsistent; can be longer than default_cycle_length
        const expectedCycleEndDate = addDays(periodStartDate, user.default_cycle_length - 1);
        const cycleEndDate = expectedCycleEndDate < currentDate ? currentDate : expectedCycleEndDate;

        // + 1; first day also included in length
        const actualCycleLength = differenceInDays(cycleEndDate, periodStartDate) + 1;

        const cycleData = generateCycleData(cycleEndDate, periodStartDate, user, actualCycleLength);

        if (!cycleData || !cycleData.dbCycleValues || !cycleData.contextCycle) return null;

        const result = await db.runAsync(`
                    INSERT INTO Cycle (id,
                                       cycle_start_date,
                                       cycle_start_date_plain,
                                       cycle_end_date,
                                       period_end_date,
                                       follicular_end_date,
                                       ovulation_end_date,
                                       cycle_length,
                                       period_length,
                                       created_at,
                                       user_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            cycleData.dbCycleValues
        );
        if (result.changes > 0) {
            return cycleData.contextCycle;
        } else return null;

    } catch (error) {
        console.warn(error);
        return null;
    }
}
export const createUserCycle = async (db: SQLiteDatabase, user: UserContextData, period_start_date: Date): Promise<CycleContextData | null> => {
    try {
        const currentDate = refactorDateToDate(new Date());
        if (period_start_date > currentDate) return null;
        if (!user.default_period_length || !user.default_cycle_length) return null;

        const periodStartDate = refactorDateToDate(period_start_date);
        const cycleEndDate = addDays(periodStartDate, user.default_cycle_length - 1);

        const cycleData = generateCycleData(cycleEndDate, periodStartDate, user, user.default_cycle_length);

        if (!cycleData || !cycleData.dbCycleValues || !cycleData.contextCycle) return null;

        console.log('here')
        const result = await db.runAsync(`
                    INSERT INTO Cycle (id,
                                       cycle_start_date,
                                       cycle_start_date_plain,
                                       cycle_end_date,
                                       period_end_date,
                                       follicular_end_date,
                                       ovulation_end_date,
                                       cycle_length,
                                       period_length,
                                       created_at,
                                       user_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            cycleData.dbCycleValues
        );
        if (result.changes > 0) {
            return cycleData.contextCycle;
        } else return null;

    } catch (error) {
        console.warn(error);
        return null;
    }
}
export const fetchLatestCycles = async (db: SQLiteDatabase): Promise<CycleContextData[]> => {
    try {
        const rows = await db.getAllAsync<CycleModel>(
            `SELECT *
             FROM Cycle
             ORDER BY cycle_start_date_plain 
             DESC LIMIT 6`
        );
        const cycles: CycleContextData[] = rows.map(row => ({
            id: row.id,
            cycle_start_date: decryptFromStringToDate(row.cycle_start_date),
            cycle_end_date: decryptFromStringToDate(row.cycle_end_date),
            period_end_date: decryptFromStringToDate(row.period_end_date),
            follicular_end_date: decryptFromStringToDate(row.follicular_end_date),
            ovulation_end_date: decryptFromStringToDate(row.ovulation_end_date),
            cycle_length: decryptNumber(row.cycle_length),
            period_length: decryptNumber(row.period_length),
        }));

        return cycles;
    } catch (error) {
        console.error("Failed to fetch latest cycles:", error);
        return [];
    }
};

export const updatePeriodEndDate = async (db: SQLiteDatabase, user: UserContextData, currentCycle: CycleContextData, cycleId: string, newPeriodEndDate: Date): Promise<CycleContextData| null>  => {
    try {
        const periodEndDate = refactorDateToDate(newPeriodEndDate);
        const periodStartDate = currentCycle.cycle_start_date;

        const prevCycleLength = currentCycle.cycle_length;
        const newPeriodLength = differenceInDays(periodEndDate, periodStartDate) + 1;

        const addToCycle = newPeriodLength > prevCycleLength  ? (newPeriodLength - prevCycleLength) : 0;

        const updatedCycleLength = prevCycleLength + addToCycle;
        const updatedCycleEndDate = addDays(periodStartDate, updatedCycleLength - 1);

        const updatedCycleData = generateCycleData(
            updatedCycleEndDate,
            periodStartDate,
            user,
            updatedCycleLength
        );

        if (!updatedCycleData?.dbCycleValues) {
            console.warn("Failed to generate updated cycle data.");
            return null;
        }
        const valuesWithoutId = updatedCycleData.dbCycleValues.slice(1); // skip the first (id)
        const finalUpdateValues = [...valuesWithoutId, updatedCycleData.dbCycleValues[0]];
        console.log(finalUpdateValues)
        const result = await db.runAsync(
            `
      UPDATE Cycle SET
        cycle_start_date = ?,
        cycle_start_date_plain = ?,
        cycle_end_date = ?,
        period_end_date = ?,
        follicular_end_date = ?,
        ovulation_end_date = ?,
        cycle_length = ?,
        period_length = ?,
        created_at = ?,
        user_id = ?
      WHERE id = ?
      `,
            finalUpdateValues
        );

        if (result.changes > 0) {
            return updatedCycleData.contextCycle;
        } else {
            console.warn("No cycle updated");
            return null;
        }
    } catch (error) {
        console.error("Failed to update cycle:", error);
        return null;
    }
}