import {Text, View, StyleSheet, Button, Modal, Pressable} from 'react-native';
import {fromDateString, getCurrentMonthAndYear, toDateString} from '@/util/dateHelpers';
import {useCycle} from "@/context/CycleContext";
import {getCycleDay, getPhaseForDay} from "@/util/cycleCircleHelpers";
import CycleCircle from "@/components/CycleCircle";
import {useEffect, useState} from "react";
import {CalendarList} from "react-native-calendars";
import {useUser} from "@/context/UserContext";
import {createUserCycle} from "@/db/cycle-service";
import {SQLiteDatabase, useSQLiteContext} from "expo-sqlite";

export default function HomeScreen() {
    const { cycle, setCycle } = useCycle();
    const { user } = useUser();
    const db = useSQLiteContext();
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const headerData = getCurrentMonthAndYear();
    const today = fromDateString(toDateString(new Date()));
    let currentPhase = '';
    let cycleDay = 0;

    useEffect(() => {
        if (cycle){
            console.log('cycle loop', cycle.cycle_start_date)
            currentPhase = getPhaseForDay(today, cycle);
            //todo somehow cycle is not set here?????
            cycleDay = getCycleDay(today, cycle.cycle_start_date) + 1;
        }
    }, [])
    const onCreateCycle = async () => {
        if (!user) return;
        const newCycle = await createUserCycle(db, user, selectedDate);
        if (newCycle) {
            setCycle(newCycle);
            setShowModal(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.yearText}>{headerData.year}</Text>
                <Text style={styles.monthText}>{headerData.month}</Text>
            </View>
            <CycleCircle />
            <Text>
                {currentPhase}
            </Text>
            <Text className="text-3xl">
                {cycleDay}
            </Text>
            <Button  title='log in period' onPress={() => setShowModal(true)} />
            <Modal visible={showModal} transparent={true} animationType="slide">
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 12, width: 330 }}>
                        <Text style={{ fontSize: 18, marginBottom: 10 }}>
                            Select the day your period started:
                        </Text>

                        <CalendarList
                            pastScrollRange={1} // Show previous month
                            futureScrollRange={0} // No future months
                            onDayPress={(day) => {
                                const pickedDate = new Date(day.dateString);
                                setSelectedDate(pickedDate);
                            }}
                            markedDates={{
                                [toDateString(selectedDate)]: {
                                    selected: true,
                                    selectedColor: '#F28B82',
                                }
                            }}
                            theme={{
                                selectedDayBackgroundColor: '#F28B82',
                                todayTextColor: 'black',
                            }}
                        />

                        <Pressable onPress={onCreateCycle} style={{ marginTop: 20 }}>
                            <Text style={{ textAlign: 'center', color: 'white', backgroundColor: '#F28B82', padding: 10, borderRadius: 6 }}>
                                Start New Cycle
                            </Text>
                        </Pressable>

                        <Pressable onPress={() => setShowModal(false)} style={{ marginTop: 10 }}>
                            <Text style={{ textAlign: 'center', color: 'gray' }}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
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
