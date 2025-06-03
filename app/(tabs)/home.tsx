import { Text, View, StyleSheet, FlatList } from 'react-native';
import { Link } from 'expo-router';
import {getCurrentMonthAndYear, getSurroundingDays} from '@/util/dateHelpers';
import CycleCircle from "@/components/CycleCircle";

export default function HomeScreen() {
    const days = getSurroundingDays();
    const headerData = getCurrentMonthAndYear();
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.yearText}>{headerData.year}</Text>
                <Text style={styles.monthText}>{headerData.month}</Text>
            </View>
            <View style={styles.flatListWrapper}>
                <FlatList
                    horizontal
                    data={days}
                    keyExtractor={(item) => item.date.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContent}
                    renderItem={({ item }) => (
                        <View style={styles.dateItem}>
                            <View style={styles.circle}>
                                <Text style={styles.date}>{item.date}</Text>
                            </View>
                            <Text style={styles.day}>{item.day}</Text>
                        </View>
                    )}
                />
            </View>
            <CycleCircle />
            <Text>
                Cycle phase here
            </Text>
            <Text className="text-3xl">
                Day x
            </Text>
            <Link href="./calendar" style={styles.button}>
                Go to Calendar screen
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    flatListWrapper: {
        width: '100%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    flatListContent: {
        flexGrow: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
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
        alignItems: 'center',
        marginBottom: 16,
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
});
