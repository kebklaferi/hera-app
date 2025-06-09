import { useUser } from "@/context/UserContext";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter, useLocalSearchParams } from "expo-router";
import { updateUser } from "@/db/user-service";
import { createUserCycle } from "@/db/cycle-service";
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useState } from "react";

const SetUpDone = () => {
    const { user } = useUser();
    const db = useSQLiteContext();
    const router = useRouter();
    const { lastPeriod } = useLocalSearchParams();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFinish = async () => {
        if (!user || typeof lastPeriod !== "string") {
            Alert.alert("Error", "Missing user info or period start date.");
            return;
        }

        try {
            setIsSubmitting(true);

            await updateUser(db, user);

            await createUserCycle(db, {
                userId: user.id,
                startDate: new Date(lastPeriod),
                cycleLength: user.default_cycle_length,
                periodLength: user.default_period_length,
            });

            router.replace("/(tabs)/home");
        } catch (e) {
            console.error("Setup error:", e);
            Alert.alert("Error", "Something went wrong finishing setup.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
            <Text className="text-4xl font-bold mb-6 text-center">You're all set!</Text>
            <Text className="text-lg text-center mb-10">Welcome to the app 🎉</Text>

            <TouchableOpacity
                onPress={handleFinish}
                disabled={isSubmitting}
                className={`bg-burnt-sienna py-3 px-10 rounded-2xl ${isSubmitting ? "opacity-50" : ""}`}
            >
                <Text className="text-white text-xl">
                    {isSubmitting ? "Setting things up..." : "Finish Setup"}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SetUpDone;
