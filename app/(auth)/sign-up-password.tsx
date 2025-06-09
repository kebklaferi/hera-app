import {Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {InputField} from "@/components/InputField";
import Images from "@/constants/images";
import {useState} from "react";
import {useLocalSearchParams, useRouter} from "expo-router";
import {useSQLiteContext} from "expo-sqlite";
import {createUser} from "@/db/user-service";
import {useUser} from "@/context/UserContext";
const SignUpPassword = () => {
    const { biometricSetUp } = useLocalSearchParams();
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
        try{
            const form = {
                password,
                biometricSetUp: biometricSetUp === "true",
            };
            const result = await createUser(database, form);
            if (result) {
                setUser(result);
                router.push("/(auth)/sign-up-done");
            } else{
                console.log("Error - something went wrong with user creation.")
            }

        } catch (e) {
            console.error("Error occurred:", e);
        }
    }
    return (
        <SafeAreaView className="bg-white flex-1">
            <ScrollView>
                <View className="items-center">
                    <Text className="text-4xl my-10 uppercase">
                        sign up
                    </Text>
                    <Image
                        source={Images.persephoneBg}
                        style={{
                            width: 300,
                            height: 300
                        }}
                        resizeMode="contain"
                    />
                </View>
                <View className="my-10">
                    <InputField
                        title="Password"
                        value={password}
                        styling="my-4"
                        handleChangeText={(e) => setPassword(e)}
                    />
                </View>
                <View className="bg-red-50 flex-1 my-7 items-center">
                    <TouchableOpacity
                        className={`bg-burnt-sienna py-2 px-8 rounded-2xl ${!validateForm() && "opacity-50"}`}
                        activeOpacity={0.7}
                        onPress={submit}
                    >
                        <Text className="text-white text-xl">Done</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default SignUpPassword;