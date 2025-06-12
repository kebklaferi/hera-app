import {Button, Text, View, StyleSheet, Pressable, BackHandler, TextInput, Modal} from "react-native";
import {useFocusEffect, useNavigation, usePathname, useRouter} from "expo-router";
import {useCallback, useEffect, useState} from "react";
import {useUser} from "@/context/UserContext";
import Ionicons from '@expo/vector-icons/Ionicons';
import {authenticateBiometric, checkBiometricSupport, isBiometricEnrolled} from "@/util/biometrics";
import {hashPassword} from "@/util/security";
import {getDbPasswordHash} from "@/db/all-service";
import {useSQLiteContext} from "expo-sqlite";

const LogIn = () => {
    const {user} = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const db = useSQLiteContext();

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.biometric_key) {
            autoBiometricLogin();
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => true; // Block back press
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [])
    );
    const autoBiometricLogin = async () => {
        const supported = await checkBiometricSupport();
        const enrolled = await isBiometricEnrolled();
        if (supported && enrolled) {
            const success = await authenticateBiometric("Login with touch id");
            if (success) {
                console.log('autobiometriclogin', pathname);
                router.replace("/(tabs)/home");
            }
        }
    }

    const handlePasswordLogin = () => {
        setShowPasswordModal(true);
    }


    const handleSubmitPassword = async () => {
        try {
            const hashedPassword = await hashPassword(passwordInput);
            const dbPassword = await getDbPasswordHash(db);
            if (hashedPassword === dbPassword){
                setLoginError(null);
                setShowPasswordModal(false);
                setPasswordInput('');
                router.replace("/(tabs)/home");
            } else {
                setLoginError("Incorrect password. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setLoginError("An unexpected error occurred.");
        }
    };

    return (
        <>
            {
                !user?.biometric_key
                    ?
                    <Button title="Log In with Password" onPress={handlePasswordLogin}/>
                    :
                    <View style={loginStyles.container}>
                        <View style={loginStyles.touchContainer}>
                            <Pressable onPress={autoBiometricLogin}>
                                <Ionicons name="finger-print" size={80} />
                            </Pressable>
                            <Text style={loginStyles.touchTitle}>Login with Touch ID</Text>
                            <Text style={loginStyles.touchSubtitle}>
                                Use your Touch ID to continue
                            </Text>

                        </View>
                        <View style={loginStyles.dividerContainer}>
                            <View style={loginStyles.dividerLine} />
                            <Text style={loginStyles.dividerText}>OR</Text>
                            <View style={loginStyles.dividerLine} />
                        </View>

                        <Pressable style={loginStyles.passwordButton} onPress={handlePasswordLogin}>
                            <Text style={loginStyles.passwordButtonText}>Log In with Password</Text>
                        </Pressable>
                    </View>
            }
            <Modal
                visible={showPasswordModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPasswordModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Enter Password</Text>

                        <TextInput
                            secureTextEntry
                            placeholder="Your password"
                            style={styles.input}
                            value={passwordInput}
                            onChangeText={setPasswordInput}
                        />

                        {loginError && <Text style={styles.error}>{loginError}</Text>}

                        <View style={styles.modalButtonContainer}>
                            <Pressable
                                style={styles.modalButton}
                                onPress={() => {
                                    setShowPasswordModal(false);
                                    setPasswordInput('');
                                    setLoginError(null);
                                }}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>

                            <Pressable style={styles.modalButton} onPress={handleSubmitPassword}>
                                <Text style={styles.buttonText}>Confirm</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </>

    );

}
const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: "center",
        flex: 1,
        backgroundColor: "#fff",
    },
    touchIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
    },
    error: {
        color: "red",
        marginBottom: 10,
    },
    divider: {
        textAlign: "center",
        marginVertical: 15,
        fontSize: 16,
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

    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },

    modalButton: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "#fff",
    },
    touchContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    touchTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginTop: 12,
    },
    touchSubtitle: {
        fontSize: 14,
        color: "gray",
        textAlign: "center",
        marginVertical: 8,
    },
    touchButton: {
        marginTop: 16,
        backgroundColor: "#4CAF50",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    touchButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 60
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#ccc",
    },
    dividerText: {
        marginHorizontal: 10,
        color: "gray",
        fontSize: 14,
    },
    passwordButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#000",
    },
    passwordButtonText: {
        fontSize: 16,
        color: "#000",
        fontWeight: "500",
    },
});



export default LogIn;