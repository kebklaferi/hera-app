import {router} from "expo-router";
import {Text, TouchableOpacity, SafeAreaView} from "react-native";

const SetUpDone = () => {
    const handleFinish = async () => {
        router.replace("/(tabs)/home");
    };

    return (
        <SafeAreaView className="flex-1 bg-white justify-center items-center px-6">
            <Text className="text-4xl font-bold mb-6 text-center">You're all set!</Text>
            <Text className="text-lg text-center mb-10">Welcome to the app!</Text>
            <TouchableOpacity
                onPress={handleFinish}
                className={`bg-burnt-sienna py-3 px-10 rounded-2xl`}
            >
                <Text className="text-white text-xl">
                    {"Finish Setup"}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SetUpDone;
