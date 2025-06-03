import {SplashScreen, useRouter} from "expo-router";
import {useEffect} from "react";
import CustomSplashScreen from "@/components/CustomSplashScreen";
import {useSQLiteContext} from "expo-sqlite";
import {getFirstUser} from "@/db/user-service";
import {useUser} from "@/context/UserContext";

const App = () => {
    const router = useRouter();
    const db = useSQLiteContext();
    const { setUser } = useUser();

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const user = await getFirstUser(db);
            await SplashScreen.hideAsync();
            if (user) {
                setUser(user);
                router.replace("/(auth)/log-in");
            } else {
                router.replace("/(auth)/introduction");
            }

            // router.replace("/(tabs)/home");
        }
        prepare();
    }, []);
    return <CustomSplashScreen />
}
export default App;