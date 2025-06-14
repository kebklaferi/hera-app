import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import {useCycle} from "@/context/CycleContext";
import {CalendarList} from "react-native-calendars";
import {useEffect, useState} from "react";
import {eachDayOfInterval} from "date-fns";
import {toDateString} from "@/util/dateHelpers";

export default function PeriodCalendar() {
    const { cycles } = useCycle();

    if(!cycles)
        return (
            <View style={styles.container}>
                <Text style={styles.text}>No cycle data found. Please log your period.</Text>
            </View>
        );

    const markedDates = cycles.reduce((acc, cycle) => {
        const range = eachDayOfInterval({
            start: cycle.cycle_start_date,
            end: cycle.period_end_date,
        });

        range.forEach((date, index) => {
            const formatted = toDateString(date);
            acc[formatted] = {
                color: '#F28B82',
                textColor: 'white',
                ...(index === 0 && { startingDay: true }),
                ...(index === range.length - 1 && { endingDay: true }),
            };
        })
        return acc;
    }, {} as Record<string, any>);

    return (
        <View style={{flex: 1}}>
            <CalendarList
                markingType="period"
                markedDates={markedDates}
                theme={{
                    todayTextColor: 'black',
                    selectedDayBackgroundColor: 'black',
                }}
                pastScrollRange={6}
                futureScrollRange={12}
                scrollEnabled={true}
                showScrollIndicator={true}
                horizontal={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
    },
});
