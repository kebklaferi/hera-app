import {Text, TouchableOpacity, View} from "react-native";
import {Link, useRouter} from "expo-router";

const SetUp = () => {
    const router = useRouter();
    //TODO IZBRIŠI TA PAGE IN GA DAJ V SET UP DIRECTORY
    //TODO TAM DODAJ MOZNOST NASTAVITVE DEFAULT CYCLA IN PERIOD LENGHTA
    return(
        <View className="bg-red-50 flex-1 my-7 items-center">
            <Text>should push to setup page</Text>
            <TouchableOpacity
                className={`bg-burnt-sienna py-2 px-8 rounded-2xl`}
                activeOpacity={0.7}
                onPress={() => router.push('/(tabs)/home')}
            >
                <Text className="text-white text-xl">Done</Text>
            </TouchableOpacity>
        </View>
    );
}

export default SetUp;