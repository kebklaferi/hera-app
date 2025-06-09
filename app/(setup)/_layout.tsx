import {Stack} from "expo-router";

const SetupLayout = () => {
    return(
        <Stack>
            <Stack.Screen
                name={"cycle-length"}
                options={{
                    headerShown: false
                }}
            />
            <Stack.Screen
                name={"last-period-date"}
                options={{
                    headerShown: false
                }}
            /><Stack.Screen
                name={"period-length"}
                options={{
                    headerShown: false
                }}
            /><Stack.Screen
                name={"set-up-done"}
                options={{
                    headerShown: false
                }}
            />
        </Stack>
    )
}

export default SetupLayout;