import {Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {InputField} from "@/components/InputField";
import {useState} from "react";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useSQLiteContext} from "expo-sqlite";
import {createUser} from "@/db/user-service";
import {useUser} from "@/context/UserContext";

const SignUpPassword = () => {
    const {biometricSetUp} = useLocalSearchParams();
    const [password, setPassword] = useState<string>("");
    const database = useSQLiteContext();
    const {setUser} = useUser();
    const router = useRouter();
    const validateForm = (): boolean => password.length > 6;
    const submit = async () => {
        if (!validateForm()) {
            Alert.alert("Incomplete Form", "Please complete all required fields.");
            return;
        }
        try {
            const form = {
                password,
                biometricSetUp: biometricSetUp === "true",
            };
            const result = await createUser(database, form);
            if (result) {
                setUser(result);
                router.push("/(auth)/sign-up-done");
            } else {
                console.log("Error - something went wrong with user creation.")
            }

        } catch (e) {
            console.error("Error occurred:", e);
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Enter your password</Text>
            <InputField
                title="Password"
                value={password}
                styling="my-20"
                handleChangeText={(e) => setPassword(e)}
            />

            <View className="my-7 items-center">
                <TouchableOpacity
                    className={`bg-burnt-sienna py-2 px-8 rounded-2xl ${!validateForm() && "opacity-50"}`}
                    activeOpacity={0.7}
                    onPress={submit}
                >
                    <Text className="text-white text-xl">Done</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default SignUpPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 16,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#2ecc71",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});