import React from 'react';
import {View, Image, StyleSheet, Text, FlatList} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import {fromDateString, getSurroundingDays, toDateString} from "@/util/dateHelpers";
import {useCycle} from "@/context/CycleContext";
import {
    getCycleDay,
    getCycleDots, getPhaseByDayIndex,
    getPhaseForDay,
    getPictureAndStyleByPhase,
    getVisibleCycleDots
} from "@/util/cycleCircleHelpers";

const RADIUS = 140;
const DOT_RADIUS = 12;
const SVG_SIZE = 2 * RADIUS + DOT_RADIUS * 2 + 6;
const CENTER = SVG_SIZE / 2;

const CycleCircle = () => {
    const { cycle } = useCycle();
    const today = fromDateString(toDateString(new Date()));

    const isOutdated = new Date() > cycle?.cycle_end_date;

    if (isOutdated) {
        return (
            <View style={{ padding: 20 }}>
                <Text>Your cycle info is outdated. Please start a new cycle.</Text>
            </View>
        );
    }

    if (!cycle) {
        return (
            <View style={{ padding: 20 }}>
                <Text>No current cycle data found.</Text>
            </View>
        );
    }
    const startDate = cycle.cycle_start_date;
    if (!(startDate instanceof Date)) {
        console.warn('Cycle start date is not a Date:', startDate);
        return null; // or a fallback view
    }
    const visibleDots = getVisibleCycleDots(cycle);
    const { imgSrc, imageStyle } = getPictureAndStyleByPhase(
        getPhaseByDayIndex(cycle, getCycleDay(today, cycle.cycle_start_date))
    );
    const days = getSurroundingDays();
    const todayIndexInDots = visibleDots.findIndex(
        (dot) =>
            !dot.predicted && toDateString(dot.date) === toDateString(today)
    );

    const dots = visibleDots.map((dot, i) => {
        const adjustedIndex = (i - todayIndexInDots + visibleDots.length) % visibleDots.length;
        const angle = (2 * Math.PI * adjustedIndex) / visibleDots.length - Math.PI / 2;

        const x = RADIUS * Math.cos(angle) + CENTER;
        const y = RADIUS * Math.sin(angle) + CENTER;
        const fill = {
            menstrual: '#e74c3c',
            follicular: '#f39c12',
            ovulation: '#8e44ad',
            luteal: '#f1c40f',
        }[dot.phase];
        const isToday = i === todayIndexInDots;
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
        <>
            <FlatList
                horizontal
                data={days}
                keyExtractor={(item) => item.date.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.flatListContent}
                renderItem={({item, index}) => {
                    const isLifted = index < 2 || index >= days.length - 2;
                    return (
                        <View
                            style={[
                                styles.dateItem,
                                isLifted && styles.liftedItem
                            ]}
                        >
                            <View style={styles.circle}>
                                <Text style={styles.date}>{item.date}</Text>
                            </View>
                            <Text style={styles.day}>{item.day}</Text>
                        </View>
                    );
                }}
            />
            <View style={styles.wrapper}>
                <Svg height={SVG_SIZE} width={SVG_SIZE}>
                    {dots}
                </Svg>
                <View style={styles.circleContainer}>
                    <Image
                        source={imgSrc}
                        style={imageStyle}
                    />
                </View>
            </View>
        </>
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
    circleContainer: {
        width: 230,
        height: 230,
        borderRadius: 120,
        overflow: 'hidden',
        alignItems: 'center',
        zIndex: 1,
        position: 'absolute',
    },
    flatListContent: {
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 90,
        paddingBottom: 15,
    },
    dateItem: {
        alignItems: 'center',
        marginHorizontal: 'auto',
    },
    circle: {
        backgroundColor: '#cce4ff',
        borderRadius: 50,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    day: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000',
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: 'black',
        marginTop: 40,
    },
    header: {
        position: 'absolute',
        top: 15,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    yearText: {
        fontSize: 24,
        fontWeight: '600',
        letterSpacing: 2,
        color: 'black',
    },
    monthText: {
        fontSize: 20,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: 'black',
        letterSpacing: 1,
    },
    liftedItem: {
        transform: [{translateY: -30}],
    },
});
