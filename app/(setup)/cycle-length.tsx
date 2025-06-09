import { Text, TextInput, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "expo-router";

const CycleLength = () => {
    const [input, setInput] = useState<string>("");
    const { updateUser } = useUser();
    const router = useRouter();

    const handleNext = () => {
        const parsed = parseInt(input, 10);

        if (isNaN(parsed) || parsed <= 0) {
            Alert.alert("Invalid Input", "Please enter a positive number.");
            return;
        }

        updateUser({ default_cycle_length: parsed });
        router.push("/(setup)/period-length");
    };

    return (
        <SafeAreaView className="flex-1 bg-white px-6 justify-center">
            <Text className="text-3xl font-bold text-center mb-6">What's your average cycle length?</Text>

            <TextInput
                keyboardType="number-pad"
                value={input}
                onChangeText={setInput}
                placeholder="e.g., 28"
                className="border border-gray-300 rounded-xl px-4 py-3 text-lg mb-4"
            />

            <TouchableOpacity
                className="bg-burnt-sienna py-3 rounded-2xl mt-4"
                onPress={handleNext}
            >
                <Text className="text-white text-xl text-center">Continue</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default CycleLength;
