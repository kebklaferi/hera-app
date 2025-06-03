import {Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {InputField} from "@/components/InputField";
import Images from "@/constants/images";
import {useEffect, useState} from "react";
import {useRouter} from "expo-router";
import {useSQLiteContext} from "expo-sqlite";
import {SignUpFormInitialState} from "@/util/initialStates";
import {ISignUpForm} from "@/util/interfaces";
import {BiometricSetUp} from "@/components/BiometricSetUp";
import * as LocalAuthentication from "expo-local-authentication";
import {createUser} from "@/db/user-service";
const SignUp = () => {
    const [form, setForm] = useState<ISignUpForm>(SignUpFormInitialState);
    const [isTouchIdAvailable, setIsTouchIdAvailable] = useState<boolean>(false);
    const database = useSQLiteContext();
    const router = useRouter();

    useEffect(() => {
        const checkBiometricAvailability = async () => {
            const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
            setIsTouchIdAvailable(supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT));
        };
        checkBiometricAvailability();
    }, [])
    const validateForm = (): boolean => {
        return form.password !== "" && form.password.length > 6 && (!isTouchIdAvailable || form.biometricSetUp);
    }
    const submit = async () => {
        if (!validateForm()) {
            Alert.alert("Incomplete Form", "Please complete all required fields.");
            return;
        }
        try{
            const result = await createUser(database, form);
            if (result) {
                console.log(result);
                router.push("/set-up")
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
                        value={form.password}
                        styling="my-4"
                        handleChangeText={(e) => setForm({...form, password: e})}
                    />
                </View>
                {isTouchIdAvailable ?
                    <View>
                        <BiometricSetUp onSetupComplete={() => setForm({...form, biometricSetUp: true})}/>
                    </View> :
                    <View className="items-center">
                        <Text className="text-base font-semibold py-2">
                            Biometric authentication is not supported on this device.
                        </Text>
                    </View>
                }
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

export default SignUp;