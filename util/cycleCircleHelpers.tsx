import {ImageSourcePropType, ImageStyle, StyleSheet, StyleProp} from "react-native";
import Images from "@/constants/images";
import {CycleContextData} from "@/util/interfaces";
import {addDays} from "date-fns";
import {fromDateString, toDateString} from "@/util/dateHelpers";

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
}
export function getCycleDots(
    cycle: CycleContextData,
    daysToShow = 29
): { day: number; date: Date; phase: string }[] {
    const dots: { day: number; date: Date; phase: string }[] = [];
    const start = cycle.cycle_start_date;
    const today = fromDateString(toDateString(new Date()));
    const currentDayIndex = getCycleDay(today, start);

    const follicularEndDay = getCycleDay(cycle.follicular_end_date, start);
    const ovulationEndDay = getCycleDay(cycle.ovulation_end_date, start);

    for (let i = 0; i < daysToShow; i++) {
        const dayOffset = currentDayIndex + i;
        const date = addDays(start, dayOffset);
        let phase: string;

        if (date <= cycle.period_end_date) {
            phase = 'menstrual';
        } else if (date <= cycle.follicular_end_date) {
            phase = 'follicular';
        } else if (date <= cycle.ovulation_end_date) {
            phase = 'ovulation';
        } else if (date <= cycle.cycle_end_date) {
            phase = 'luteal';
        } else {
            // Prediction: loop back through known structure
            const predictedDay = dayOffset % cycle.cycle_length;

            if (predictedDay < cycle.period_length) {
                phase = 'menstrual';
            } else if (predictedDay < follicularEndDay) {
                phase = 'follicular';
            } else if (predictedDay < ovulationEndDay) {
                phase = 'ovulation';
            } else {
                phase = 'luteal';
            }
        }

        dots.push({ day: dayOffset + 1, date, phase });
    }

    return dots;
}

export function getVisibleCycleDots(cycle: CycleContextData, maxDays = 29) {
    const today = fromDateString(toDateString(new Date()));
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
        const date = addDays(start, cycleLength + i);
        const phase = getPhaseByDayIndex(cycle, i);
        dots.push({ day: cycleLength + i + 1, date, phase, predicted: true });
    }

    return dots;
}

export function getPhaseByDayIndex(cycle: CycleContextData, dayIndex: number): string {
    const start = cycle.cycle_start_date;
    const date = addDays(start, dayIndex);

    if (date <= cycle.period_end_date) return 'menstrual';
    if (date <= cycle.follicular_end_date) return 'follicular';
    if (date <= cycle.ovulation_end_date) return 'ovulation';
    if (date <= cycle.cycle_end_date) return 'luteal';

    // Prediction mode: loop through pattern
    const pLen = cycle.period_length;
    const fLen = getCycleDay(cycle.follicular_end_date, start) - pLen;
    const oLen = getCycleDay(cycle.ovulation_end_date, start) - pLen - fLen;
    const lLen = cycle.cycle_length - (pLen + fLen + oLen);

    const pattern = [
        ...Array(pLen).fill('menstrual'),
        ...Array(fLen).fill('follicular'),
        ...Array(oLen).fill('ovulation'),
        ...Array(lLen).fill('luteal'),
    ];

    return pattern[dayIndex % pattern.length] || 'luteal';
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