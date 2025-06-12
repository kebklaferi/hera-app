import {ImageSourcePropType, ImageStyle, StyleSheet, StyleProp} from "react-native";
import Images from "@/constants/images";
import {CycleContextData} from "@/util/interfaces";
import {addDays, isEqual, subDays} from "date-fns";
import {fromDateString, refactorDateToDate, toDateString} from "@/util/dateHelpers";

export function getCycleDay(today: Date, startDate: Date): number {
    return Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}

export function getPhaseForDay(today: Date, cycle: CycleContextData): string {
    const cycleStart = cycle.cycle_start_date;
    const periodEnd = cycle.period_end_date;
    const follicularEnd = cycle.follicular_end_date;
    const ovulationEnd = cycle.ovulation_end_date;
    const cycleEnd = cycle.cycle_end_date;

    const day = fromDateString(toDateString(today));

    if (day >= cycleStart && day <= periodEnd) {
        return 'menstrual';
    }

    if (day > periodEnd && day <= follicularEnd) {
        return 'follicular';
    }

    if (day > follicularEnd && day <= ovulationEnd) {
        return 'ovulation';
    }

    if (day > ovulationEnd && day <= cycleEnd) {
        return 'luteal';
    }
    return 'luteal';
}

export const getPictureAndStyleByPhase = (phase: string): {imgSrc: ImageSourcePropType, imageStyle: StyleProp<ImageStyle>} => {
    switch (phase) {
        case "menstrual":
            return {
                imgSrc: Images.persephone,
                imageStyle: styles.centerImagePersephone
            }
        case "follicular":
            return {
                imgSrc: Images.artemis,
                imageStyle: styles.centerImageArtemis
            }
        case "ovulation":
            return {
                imgSrc: Images.aphrodite,
                imageStyle: styles.centerImageAphrodite
            }
        case "luteal":
            return {
                imgSrc: Images.athena,
                imageStyle: styles.centerImageAthena
            }
    }
    return {
        imgSrc: Images.athena,
        imageStyle: styles.centerImageAthena
    };
}
export function getCycleDots(cycle: CycleContextData, daysToShow = 29): { day: number; date: Date; phase: string }[] {
    const dots: { day: number; date: Date; phase: string }[] = [];
    const start = cycle.cycle_start_date;
    const today = refactorDateToDate(new Date());
    const currentDayIndex = getCycleDay(today, start);

    const ovulationDate = subDays(cycle.ovulation_end_date, 1);
    const fertileStartDate = subDays(ovulationDate, 5);

    for (let i = 0; i < daysToShow; i++) {
        const dayOffset = currentDayIndex + i;
        const date = addDays(start, dayOffset);
        let phase: string;

        if (date <= cycle.period_end_date) {
            phase = "menstrual";
        } else if (date < fertileStartDate) {
            phase = "follicular";
        } else if (date >= fertileStartDate && date < ovulationDate) {
            phase = "fertile";
        } else if (isEqual(date, ovulationDate) || isEqual(date, cycle.ovulation_end_date)) {
            phase = "ovulation";
        } else if (date <= cycle.cycle_end_date) {
            phase = "luteal";
        } else {

            // Prediction logic: wrap through synthetic pattern
            const predictedDate = addDays(start, dayOffset % cycle.cycle_length);

            if (predictedDate <= cycle.period_end_date) {
                phase = "menstrual";
            } else if (predictedDate < fertileStartDate) {
                phase = "follicular";
            } else if (predictedDate >= fertileStartDate && predictedDate < ovulationDate) {
                phase = "fertile";
            } else if (
                isEqual(predictedDate, ovulationDate) ||
                isEqual(predictedDate, cycle.ovulation_end_date)
            ) {
                phase = "ovulation";
            } else {
                phase = "luteal";
            }
        }

        dots.push({ day: dayOffset + 1, date, phase });
    }

    return dots;
}

export function getVisibleCycleDots(cycle: CycleContextData, maxDays = 29) {
    const today = refactorDateToDate(new Date());
    const start = cycle.cycle_start_date;
    const cycleLength = cycle.cycle_length;

    const todayIndex = getCycleDay(today, start); // start = 0 in array, start = day 1
    const pastDaysToShow = Math.min(10, todayIndex);
    const daysLeftInCycle = cycleLength - (todayIndex);

    const totalSoFar = pastDaysToShow + daysLeftInCycle + 1; // +1 for today
    const predictionDays = Math.max(0, maxDays - totalSoFar);

    const dots: { day: number; date: Date; phase: string; predicted: boolean }[] = [];

    // 1. Past days
    for (let i = todayIndex - pastDaysToShow; i < todayIndex; i++) {
        const date = addDays(start, i);
        const phase = getPhaseByDayIndex(cycle, i);
        dots.push({ day: i + 1, date, phase, predicted: false });
    }

    // 2. Today + rest of current cycle
    for (let i = todayIndex; i < cycleLength; i++) {
        const date = addDays(start, i);
        const phase = getPhaseByDayIndex(cycle, i);
        dots.push({ day: i + 1, date, phase, predicted: false });
    }

    // 3. Predictions into next cycle
    for (let i = 0; i < predictionDays; i++) {
        const predictedIndex = cycleLength + i;
        const date = addDays(start, predictedIndex);
        const phase = getPhaseByDayIndex(cycle, predictedIndex);
        dots.push({ day: predictedIndex + 1, date, phase, predicted: true });
    }

    return dots;
}

export function getPhaseByDayIndex(cycle: CycleContextData, dayIndex: number): string {
    const start = cycle.cycle_start_date;
    const date = addDays(start, dayIndex);

    if (date <= cycle.period_end_date) return "menstrual";

    const ovulationDate = subDays(cycle.ovulation_end_date, 1);
    const fertileStart = subDays(ovulationDate, 5);
    const fertileEnd = cycle.ovulation_end_date; // ovulation + 1

    if (date < fertileStart) return "follicular";
    if (isEqual(date, ovulationDate)) return "ovulation";
    if (date >= fertileStart && date <= fertileEnd) return "fertile";
    if (date <= cycle.cycle_end_date) return "luteal";


    const periodLength = cycle.period_length;

    // predictions - when requested index is outside the range of the actual cycle data
    const follicularLength = getCycleDay(fertileStart, start) - periodLength; // follicular length
    const fertileWindow = 5;
    const ovulationWindow = 1;
    const afterOvulationFertileWindow = 1;
    const lutealWindow = cycle.cycle_length - (periodLength + follicularLength + fertileWindow + ovulationWindow + afterOvulationFertileWindow);

    const pattern = [
        ...Array(periodLength).fill("menstrual"),
        ...Array(follicularLength).fill("follicular"),
        ...Array(fertileWindow).fill("fertile"),
        ...Array(ovulationWindow).fill("ovulation"),
        ...Array(afterOvulationFertileWindow).fill("fertile"),
        ...Array(lutealWindow).fill("luteal"),
    ];

    return pattern[dayIndex % pattern.length];
}

const styles = StyleSheet.create({
    centerImageAphrodite: {
        width: 200,
        height: 350,
        position: 'absolute',
        bottom: -150,
    },
    centerImageArtemis: {
        width: 300,
        height: 350,
        position: 'absolute',
        bottom: -125,
        left: -20
    },centerImageAthena: {
        width: 200,
        height: 360,
        position: 'absolute',
        bottom: -150,
    },centerImagePersephone: {
        width: 200,
        height: 370,
        position: 'absolute',
        bottom: -150,
    },
})