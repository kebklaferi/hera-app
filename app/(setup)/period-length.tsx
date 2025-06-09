import { SafeAreaView, Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "@/context/UserContext";

const PeriodLength = () => {
    const [periodLength, setPeriodLength] = useState<string>("");
    const router = useRouter();
    const { updateUser } = useUser();

    const isValid = () => {
        return /^[1-9]\d*$/.test(periodLength);
    };

    const handleNext = () => {
        if (!isValid()) {
            Alert.alert("Invalid Input", "Please enter a valid positive number.");
            return;
        }

        updateUser({ default_period_length: Number(periodLength) });
        router.push("/(setup)/last-period-date");
    };

    return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
            <Text className="text-3xl font-bold mb-6 text-center">How long does your period usually last?</Text>

            <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 w-full text-lg text-center"
                keyboardType="numeric"
                value={periodLength}
                onChangeText={setPeriodLength}
                placeholder="e.g. 5"
            />

            <TouchableOpacity
                className="bg-burnt-sienna py-3 px-8 rounded-2xl mt-6"
                onPress={handleNext}
            >
                <Text className="text-white text-xl">Continue</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default PeriodLength;
