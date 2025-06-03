import { Text, View, StyleSheet } from 'react-native';
import {Link} from "expo-router";

export default function Calendar() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is calendar screen.</Text>
            <Link href={"./home"} />
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
