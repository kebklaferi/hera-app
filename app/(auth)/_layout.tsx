import {Stack} from "expo-router";

const AuthLayout = () => {

    return (
        <Stack>
            <Stack.Screen
                name={"log-in"}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name={"sign-up-password"}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name={"sign-up-biometrics"}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name={"sign-up-done"}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name={"introduction"}
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    );

}

export default AuthLayout;