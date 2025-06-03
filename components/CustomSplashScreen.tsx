import {Image, SafeAreaView, ScrollView, Text, View} from "react-native";
import Images from "../constants/images";
import {StatusBar} from "expo-status-bar";

const CustomSplashScreen = () => {
    return (
        <SafeAreaView className="bg-burnt-sienna flex-1 justify-center items-center">
            <Image
                source={Images.logoLight}
                className="mb-6"
                style={{
                    height: 100,
                    width: 150
                }}
                resizeMode="contain"
            />
            <Text className="text-4xl text-white">
                HERA
            </Text>
            <StatusBar />
        </SafeAreaView>
    )
}

export default CustomSplashScreen;