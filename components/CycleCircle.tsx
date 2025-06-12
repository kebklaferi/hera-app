import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, Text, FlatList, ImageSourcePropType, StyleProp, ImageStyle} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import {fromDateString, getSurroundingDays, refactorDateToDate, toDateString} from "@/util/dateHelpers";
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
    const {currentCycle} = useCycle();
    const today = refactorDateToDate(new Date());
    const [imgSrc, setImgSrc] = useState<ImageSourcePropType | null>(null);
    const [imageStyle, setImageStyle] = useState<StyleProp<ImageStyle>>({});


    if (!currentCycle) {
        return (
            <View style={{padding: 20}}>
                <Text>No current cycle data found.</Text>
            </View>
        );
    }
    useEffect(() => {
        const {imgSrc, imageStyle} = getPictureAndStyleByPhase(
            getPhaseByDayIndex(currentCycle, getCycleDay(today, currentCycle.cycle_start_date))
        );
        setImageStyle(imageStyle);
        setImgSrc(imgSrc);
    }, [currentCycle])


    const visibleDots = getVisibleCycleDots(currentCycle);
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
            menstrual: '#EF3934',
            follicular: '#f8dfba',
            ovulation: '#EEBA2B',
            fertile: '#EEBA2B',
            luteal: '#332c42',
        }[dot.phase] || '#bdc3c7';
        const isToday = i === todayIndexInDots;
        return (
            <Circle
                key={toDateString(dot.date)}
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
                            <Text style={styles.date}>{item.date}</Text>
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
                    {imgSrc && imageStyle ? (
                        <Image
                            source={imgSrc}
                            style={imageStyle}
                        />
                    ) : null}
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
            date: {
            fontSize: 20,
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
