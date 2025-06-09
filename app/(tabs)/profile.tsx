import {ScrollView, Switch, Text, View, StyleSheet} from "react-native";
import {useEffect, useState} from "react";
import {ProfileData} from "@/util/interfaces";
import {getProfileData} from "@/db/user-service";
import {useSQLiteContext} from "expo-sqlite";
import {useUser} from "@/context/UserContext";

const ProfileScreen = () => {
    const { user, updateUser } = useUser();
    const db = useSQLiteContext();

    const toggleNotes = async () => {
        if (!user) return;

        const newValue = !user.notes_enabled;

        // Update context
        updateUser({ notes_enabled: newValue });

        //todo need to save to database
        // Persist to DB
        /*
        await updateUserInDb(db, {
            id: user.id,
            notes_enabled: newValue
        });

         */
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Profile Settings</Text>

            <View style={styles.section}>
                <Text style={styles.label}>Default Cycle Length</Text>
                {user?.default_cycle_length !== undefined ? (
                    <Text style={styles.value}>
                        {user.default_cycle_length} days
                    </Text>
                ) : (
                    <Text style={styles.undefinedValue}>
                        No default cycle length set.
                    </Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>Default Period Length</Text>
                {user?.default_period_length !== undefined ? (
                    <Text style={styles.value}>
                        {user.default_period_length} days
                    </Text>
                ) : (
                    <Text style={styles.undefinedValue}>
                        No default period length set.
                    </Text>
                )}
            </View>

            <View style={styles.divider} />

            <View style={styles.toggleSection}>
                <Text style={styles.label}>Enable Notes</Text>
                <Switch
                    value={!!user?.notes_enabled}
                    onValueChange={toggleNotes}
                />
            </View>
        </ScrollView>
    );
}
export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: "#fff",
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: "center",
    },
    section: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: "#333",
    },
    undefinedValue: {
        fontSize: 14,
        color: "gray"
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 24,
    },
    toggleSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
});