import {SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {useRouter} from "expo-router";
const SignUpDone = () => {
    const router = useRouter();
    const goToHome = () => {
        router.replace("/(setup)/cycle-length");
    };

    return (
        <SafeAreaView className="bg-white flex-1 justify-center items-center px-6">
            <Text className="text-4xl font-bold mb-6 text-center">All Done!</Text>
            <Text className="text-lg text-center mb-10">
                Your account has been successfully created. Now lets first set up!
            </Text>
            <TouchableOpacity
                className="bg-burnt-sienna py-3 px-10 rounded-2xl"
                onPress={goToHome}
            >
                <Text className="text-white text-lg">Go to Home</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default SignUpDone;