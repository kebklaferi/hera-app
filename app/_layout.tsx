import "../global.css";
import {Stack} from "expo-router";
import {SQLiteProvider} from "expo-sqlite";
import {initializeDatabase} from "@/db/db-init";
import {UserProvider} from "@/context/UserContext";
const RootLayout = () => {
    return (
        <SQLiteProvider databaseName="hera.db" onInit={initializeDatabase}>
            <UserProvider>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen name="(setup)" options={{ headerShown: false }} />
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                </Stack>
            </UserProvider>
        </SQLiteProvider>
    );
}
export default RootLayout

