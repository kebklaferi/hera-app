import {refactorDateToDate, toDateString} from "@/util/dateHelpers";
import {addDays, subDays} from "date-fns";
import {encryptDateToString, encryptNumber, generateUUID} from "@/util/security";
import {CycleContextData, GeneratedCycle, UserContextData} from "@/util/interfaces";

export const generateCycleData = (cycleEndDate: Date, periodStartDate: Date, user: UserContextData, actualCycleLength: number): GeneratedCycle | null => {

    if (!user.default_period_length || !user.default_cycle_length) return null;

    const ovulationDate = refactorDateToDate(subDays(cycleEndDate, 14));
    const ovulationEndDate = refactorDateToDate(addDays(ovulationDate, 1));
    const follicularEndDate = refactorDateToDate(subDays(ovulationDate, 5));
    const periodEndDate = refactorDateToDate(addDays(periodStartDate, user.default_period_length - 1));

    // encrypted values for database
    const encryptedStartDate = encryptDateToString(periodStartDate);
    const encryptedCycleEnd = encryptDateToString(cycleEndDate);
    const encryptedPeriodEnd = encryptDateToString(periodEndDate);
    const encryptedFollicularEnd = encryptDateToString(follicularEndDate);
    const encryptedOvulationEnd = encryptDateToString(ovulationEndDate);
    const encryptedCycleLength = encryptNumber(actualCycleLength);
    const encryptedPeriodLength = encryptNumber(user.default_period_length);

    const cycleId = generateUUID();
    const now = new Date().toISOString();

    const dbData = [
        cycleId,
        encryptedStartDate,
        toDateString(periodStartDate),
        encryptedCycleEnd,
        encryptedPeriodEnd,
        encryptedFollicularEnd,
        encryptedOvulationEnd,
        encryptedCycleLength,
        encryptedPeriodLength,
        now,
        user.id
    ]

    const contextData: CycleContextData = {
        id: cycleId,
        cycle_start_date: periodStartDate,
        cycle_end_date: cycleEndDate,
        period_end_date: periodEndDate,
        follicular_end_date: follicularEndDate,
        ovulation_end_date: ovulationEndDate,
        cycle_length: actualCycleLength,
        period_length: user.default_period_length
    }

    return {
        contextCycle: contextData,
        dbCycleValues: dbData,
    }
}