import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const CYCLE_DAYS = 29;
const RADIUS = 140;
const DOT_RADIUS = 12;
const SVG_SIZE = 2 * RADIUS + DOT_RADIUS * 2 + 6;
const CENTER = SVG_SIZE / 2;

const userCycle = {
    startDate: new Date('2025-05-28'),
    cycleLength: 29,
    periodLength: 6,
};

function getCycleDay(today: Date, startDate: Date, cycleLength: number): number {
    const diff = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return ((diff % cycleLength) + cycleLength) % cycleLength; // safe mod
}

function getPhaseForDay(day: number, periodLength = 5): string {
    if (day < periodLength) return 'menstrual';
    if (day < 14) return 'follicular';
    if (day === 14) return 'ovulation';
    return 'luteal';
}
function getCycleDots(startDate: Date, cycleLength: number, periodLength: number): { day: number, phase: string }[] {
    return Array.from({ length: cycleLength }, (_, i) => {
        const phase = getPhaseForDay(i, periodLength);
        return { day: i, phase };
    });
}
const CycleCircle = () => {
    const today = new Date();
    const currentDay = getCycleDay(today, userCycle.startDate, userCycle.cycleLength);
    const cycleDots = getCycleDots(userCycle.startDate, userCycle.cycleLength, userCycle.periodLength);

// Rotate the dots array so today is at the top (index 0)
    const rotatedDots = [...cycleDots.slice(currentDay), ...cycleDots.slice(0, currentDay)];

    const dots = rotatedDots.map((dot, i) => {
        const angle = (2 * Math.PI * i) / userCycle.cycleLength - Math.PI / 2;
        const x = RADIUS * Math.cos(angle) + CENTER;
        const y = RADIUS * Math.sin(angle) + CENTER;

        const fill = {
            menstrual: '#e74c3c',
            follicular: '#f39c12',
            ovulation: '#8e44ad',
            luteal: '#f1c40f',
        }[dot.phase];

        const isToday = i === 0;

        return (
            <Circle
                key={dot.day}
                cx={x}
                cy={y}
                r={DOT_RADIUS}
                fill={fill}
                stroke={isToday ? 'black' : 'none'}
                strokeWidth={isToday ? 3 : 0}
            />
        );
    });

    return (
        <View style={styles.wrapper}>
            <Svg height={SVG_SIZE} width={SVG_SIZE}>
                {dots}
            </Svg>
            <View style={styles.circleContainer}>
                <Image
                    source={require('@/assets/images/aphrodite.png')}
                    style={styles.centerImage}

                />
            </View>
        </View>
    );
}
export default CycleCircle;

const styles = StyleSheet.create({
    wrapper: {
        width: SVG_SIZE,
        height: SVG_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerImage: {
        width: 200,
        height: 350,
        position: 'absolute',
        bottom: -150,
    },
    circleContainer: {
        width: 230,
        height: 230,
        borderRadius: 120,
        overflow: 'hidden',
        alignItems: 'center',
        zIndex: 1,
        position: 'absolute',
    },
});
