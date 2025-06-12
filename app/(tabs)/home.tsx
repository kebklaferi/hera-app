import {Text, View, StyleSheet, Button, Modal, Pressable} from 'react-native';
import {fromDateString, getCurrentMonthAndYear, toDateString} from '@/util/dateHelpers';
import {useCycle} from "@/context/CycleContext";
import {getCycleDay, getPhaseForDay} from "@/util/cycleCircleHelpers";
import CycleCircle from "@/components/CycleCircle";
import {useEffect, useState} from "react";
import {Calendar, CalendarList, DateData} from "react-native-calendars";
import {useUser} from "@/context/UserContext";
import {createUserCycle, updatePeriodEndDate} from "@/db/cycle-service";
import {SQLiteDatabase, useSQLiteContext} from "expo-sqlite";
import {CycleContextData} from "@/util/interfaces";
import Ionicons from '@expo/vector-icons/Ionicons';
import {eachDayOfInterval} from "date-fns";


export default function HomeScreen() {
    const {currentCycle, addCycle, setCycles} = useCycle();
    const {user} = useUser();
    const db = useSQLiteContext();
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedEditDate, setSelectedEditDate] = useState<Date>();
    const [homeCycleData, setHomeCycleData] = useState<{ day: number, phase: string }>({day: 0, phase: ''})
    const headerData = getCurrentMonthAndYear();
    const today = fromDateString(toDateString(new Date()));
    const [showEditModal, setShowEditModal] = useState(false);


    useEffect(() => {
        if (currentCycle) {
            console.log('cycle loop', currentCycle.cycle_start_date)
            const home_phase = getPhaseForDay(today, currentCycle);
            const home_day = getCycleDay(today, currentCycle.cycle_start_date) + 1;
            setHomeCycleData((prev) => ({
                ...prev,
                phase: home_phase,
                day: home_day
            }))
        }
    }, [currentCycle])

    const onCreateCycle = async () => {
        try {
            if (!user) {
                console.warn("User not found");
                return;
            }

            console.log("Creating new cycle starting on", selectedDate);

            const newCycle = await createUserCycle(db, user, selectedDate);

            if (newCycle) {
                addCycle(newCycle);
                setShowModal(false);
                setSelectedDate(new Date());
                console.log("Cycle created successfully");
            } else {
                console.error("Failed to create cycle.");
            }
        } catch (err) {
            console.error("Error creating cycle:", err);
        }
    };

    const onUpdateCycle = async () => {
        console.log("Would update current cycle to:", selectedDate);
        if(!user || !currentCycle) return;
        const updatedCycle = await updatePeriodEndDate(db, user, currentCycle, currentCycle.id, selectedDate);
        if (updatedCycle) {
            setCycles((prev: CycleContextData[]) =>
                prev.map(cycle => cycle.id === updatedCycle.id ? updatedCycle : cycle)
            );
        }
        setShowEditModal(false);
    }

    const getTodayDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const getPreviousMonthDate = () => {
        const today = new Date();
        today.setMonth(today.getMonth() - 1);
        return today.toISOString().split('T')[0];
    };
    const getMarkedDates = () => {
        const start = currentCycle?.cycle_start_date;
        const end = selectedEditDate ?? currentCycle?.period_end_date;

        if (!start || !end) return {};

        const range = eachDayOfInterval({
            start,
            end,
        });

        return range.reduce((acc, date, index) => {
            const formatted = toDateString(date);
            acc[formatted] = {
                color: '#F28B82',
                textColor: 'white',
                ...(index === 0 && { startingDay: true }),
                ...(index === range.length - 1 && { endingDay: true }),
            };
            return acc;
        }, {} as Record<string, any>);
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.yearText}>{headerData.year}</Text>
                <Text style={styles.monthText}>{headerData.month}</Text>
            </View>
            <CycleCircle/>
            <Text className="my-2 text-3xl uppercase">
                {`${homeCycleData.phase} phase`}
            </Text>
            <Text className="uppercase text-3xl">
                {`day ${homeCycleData.day}`}
            </Text>
            <View style={styles.presscontainer}>
                <Pressable onPress={() => setShowEditModal(true)}>
                    <Ionicons name="pencil" size={30} color="black" />
                </Pressable>
                <Pressable onPress={() => setShowModal(true)}>
                    <Ionicons name="add-circle-outline" size={30} color="black" />
                </Pressable>
            </View>

            <Modal visible={showModal} transparent={true} animationType="slide">
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <View style={{backgroundColor: 'white', padding: 20, borderRadius: 12, width: 330}}>
                        <Text style={{fontSize: 18, marginBottom: 10}}>
                            Select the day your period started:
                        </Text>

                        <Calendar
                            current={new Date().toISOString()}
                            onDayPress={(day: DateData) => {
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
                            hideExtraDays={true}
                            enableSwipeMonths={false}
                            minDate={getPreviousMonthDate()}
                            maxDate={getTodayDate()}
                        />
                        <Pressable onPress={onCreateCycle} style={{marginTop: 20}}>
                            <Text style={{
                                textAlign: 'center',
                                color: 'white',
                                backgroundColor: '#F28B82',
                                padding: 10,
                                borderRadius: 6
                            }}>
                                Start New Cycle
                            </Text>
                        </Pressable>
                        <Pressable onPress={() => setShowModal(false)} style={{marginTop: 10}}>
                            <Text style={{textAlign: 'center', color: 'gray'}}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
            <Modal visible={showEditModal} transparent={true} animationType="slide">
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <View style={{backgroundColor: 'white', padding: 20, borderRadius: 12, width: 330}}>
                        <Text style={{fontSize: 18, marginBottom: 10}}>
                            Update end date for current cycle:
                        </Text>

                        <Calendar
                            current={toDateString(currentCycle?.cycle_start_date ?? new Date())}
                            onDayPress={(day: DateData) => {
                                const pickedDate = new Date(day.dateString);
                                setSelectedEditDate(pickedDate);
                            }}
                            markedDates={getMarkedDates()}
                            markingType="period"
                            minDate={toDateString(currentCycle?.cycle_start_date ?? new Date())}
                            hideExtraDays={true}
                            enableSwipeMonths={false}
                            theme={{
                                selectedDayBackgroundColor: '#F28B82',
                                todayTextColor: 'black',
                            }}
                        />
                        <Pressable
                            onPress={onUpdateCycle}
                            style={{marginTop: 20}}
                        >
                            <Text style={{
                                textAlign: 'center',
                                color: 'white',
                                backgroundColor: '#F28B82',
                                padding: 10,
                                borderRadius: 6
                            }}>
                                Save Changes
                            </Text>
                        </Pressable>

                        <Pressable onPress={() => {setSelectedEditDate(undefined); setShowEditModal(false)}} style={{marginTop: 10}}>
                            <Text style={{textAlign: 'center', color: 'gray'}}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
        ;
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
    presscontainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        alignSelf: 'center',
        marginVertical: 20,
        paddingHorizontal: 16,
    },
});
