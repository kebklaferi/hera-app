import {BackHandler, Image, Text, TouchableOpacity, View} from "react-native";
import Images from "../../constants/images";
import {useEffect, useState} from "react";
import {useRouter} from "expo-router";

const IntroductionScreen = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            () => true
        );

        return () => backHandler.remove();
    }, []);


    return (
        <View className="flex-1 items-center bg-white justify-center">
            <Image
                source={Images.heraBg}
                style={{
                    width: 300,
                    height: 300
                }}
                resizeMode="contain"
            />
            <View className="items-center">
                <Text className="text-3xl mt-20 mb-4">
                    Welcome to Hera
                </Text>
                <Text>Your secure period tracking app.</Text>

                <TouchableOpacity
                    className={`bg-burnt-sienna mt-20 py-2 px-8 rounded-2xl ${loading && 'opacity-50'}`}
                    activeOpacity={0.7}
                    onPress={() => router.push("/(auth)/sign-up")}
                    disabled={loading}
                >
                    <Text className="text-white text-xl">Lets start!</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default IntroductionScreen;