import {Modal, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View} from "react-native";
import {useSQLiteContext} from "expo-sqlite";
import {useUser} from "@/context/UserContext";
import {useState} from "react";
import {encryptData} from "@/util/security";
import {getExportData} from "@/db/all-service";
import {exportDataToFile} from "@/util/file-utils";

const ProfileScreen = () => {
    const {user, updateUser} = useUser();
    const [password, setPassword] = useState<string>('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalAction, setModalAction] = useState<'export' | 'import' | null>(null);

    const db = useSQLiteContext();

    const toggleNotes = async () => {
        if (!user) return;

        const newValue = !user.notes_enabled;

        //todo need to save to database
        // Persist to DB
        /*
        await updateUserInDb(db, {
            id: user.id,
            notes_enabled: newValue
        });

         */
    };

    const onPressExport = () => {
        setModalAction('export');
        setModalVisible(true);
    }

    const onPressImport = () => {
        setModalAction('import');
        setModalVisible(true);
    }

    const handleExport = async (password: string) => {
        try{
            console.log('here')
            const exportData = await getExportData(db);
            const encrypted = encryptData(exportData, password);
            await exportDataToFile(encrypted);
            alert('Data exported.');
        } catch (error) {
            console.warn(error);
            alert('Failed to export data.');
        }
    }

    const handleImport = (password: string) => {

    }

    const openPasswordModal = () => {

    }

    return (
        <View>
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

                <View style={styles.divider}/>

                <View style={styles.toggleSection}>
                    <Text style={styles.label}>Enable Notes</Text>
                    <Switch
                        value={!!user?.notes_enabled}
                        onValueChange={toggleNotes}
                    />
                </View>

                <View style={styles.divider}/>

                <View style={styles.inlineSection}>
                    <Text style={styles.label}>Export Cycle Data</Text>
                    <Pressable style={styles.buttonSmall} onPress={() => onPressExport()}>
                        <Text style={styles.buttonText}>Export</Text>
                    </Pressable>
                </View>

                <View style={styles.divider}/>

                <View style={styles.inlineSection}>
                    <Text style={styles.label}>Import Cycle Data</Text>
                    <Pressable style={styles.buttonSmall} onPress={() => onPressImport()}>
                        <Text style={styles.buttonText}>Import</Text>
                    </Pressable>
                </View>
            </ScrollView>
            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Enter Password</Text>
                        <TextInput
                            secureTextEntry
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                        />
                        <View style={styles.modalButtons}>
                            <Pressable
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    setPassword('');
                                }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={styles.modalButton}
                                onPress={() => {
                                    if (modalAction === 'export') {
                                        handleExport(password);
                                        setModalVisible(false);
                                    } else {
                                        handleImport(password);
                                        setModalVisible(false);
                                    }
                                    setPassword('');
                                    setModalAction(null);
                                }}
                            >
                                <Text style={styles.buttonText}>Confirm</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
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
        alignItems: "center"
    },
    inlineSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    buttonSmall: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: "#007AFF",
        borderRadius: 6,
    },

    buttonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        width: '80%',
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },

    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    modalButton: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
});