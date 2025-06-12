import {View, Text, TouchableOpacity, SafeAreaView, Alert} from "react-native";
import {useState} from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useRouter} from "expo-router";
import {updateUser} from "@/db/user-service";
import {createUserCycle, initUserCycle} from "@/db/cycle-service";
import {useUser} from "@/context/UserContext";
import {useSQLiteContext} from "expo-sqlite";
import {useCycle} from "@/context/CycleContext";

const LastPeriodDate = () => {
    const [date, setDate] = useState<Date | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const db = useSQLiteContext();
    const { user } = useUser();
    const { addCycle } = useCycle();
    const router = useRouter();

    const handleConfirm = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleNext = async () => {
        if (!date) {
            Alert.alert("Missing Date", "Please select your last period start date.");
            return;
        }
        if (user) {
            await updateUser(db, user);
            const createdCycle = await initUserCycle(db, user, date);
            if (!createdCycle) return null;
            console.log('Initialized first user cycle: ', createdCycle)
            addCycle(createdCycle);
        }
        router.push({
            pathname: "/(setup)/set-up-done"
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
            <Text className="text-3xl font-bold mb-6 text-center">When did your last period start?</Text>

            <TouchableOpacity
                className="border border-gray-300 rounded-xl px-4 py-3 mb-4"
                onPress={() => setShowPicker(true)}
            >
                <Text className="text-lg">
                    {date ? date.toDateString() : "Select Date"}
                </Text>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={handleConfirm}
                />
            )}

            <TouchableOpacity
                className="bg-burnt-sienna py-3 px-8 rounded-2xl mt-6"
                onPress={handleNext}
            >
                <Text className="text-white text-xl">Continue</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default LastPeriodDate;
