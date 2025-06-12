import {View, Text} from "react-native";
import CustomSplashScreen from "@/components/CustomSplashScreen";
import {usePathname, useRouter} from "expo-router";
import {useUser} from "@/context/UserContext";
import {useEffect, useRef} from "react";
import {useSQLiteContext} from "expo-sqlite";
import {useCycle} from "@/context/CycleContext";
import {getFirstUser} from "@/db/user-service";
import {fetchLatestCycles} from "@/db/cycle-service";

const App = () => {
    const router = useRouter();
    const db = useSQLiteContext();
    const {user, setUser} = useUser();
    const {currentCycle, setCycles} = useCycle();
    const hasRedirected = useRef(false);
    const pathname = usePathname();

    useEffect(() => {
        const init = async () => {
            try {
                //on warm resume
                //cycle and user context should still be saved
                console.log('user', user)
                console.log('cycle', currentCycle)
                setTimeout(() => {
                    if (user && currentCycle && pathname === '/(auth)/log-in') {
                        hasRedirected.current = true;
                        router.replace("/(auth)/log-in");
                        return;
                    }
                }, 2000)

                //on cold start if there is no user set in context
                //on cold start when user is created
                const userDb = await getFirstUser(db);
                console.log("userdb", userDb)
                if (userDb) {
                    setUser(userDb);
                    const cycleDb = await fetchLatestCycles(db);
                    console.log('cycledb', cycleDb)
                    setCycles(cycleDb);
                    setTimeout(() => {
                        if (!hasRedirected.current && pathname !== "/(auth)/log-in") {
                            hasRedirected.current = true;
                            router.replace("/(auth)/log-in");
                        }
                    }, 2000);
                } else {
                    //setting up account
                    setTimeout(() => {
                        if (!hasRedirected.current && pathname !== "/(auth)/introduction") {
                            hasRedirected.current = true;
                            router.replace("/(auth)/introduction");
                        }
                    }, 2000)
                }
            } catch (err) {
                console.warn("Failed to init", err);
            }
        };

        init();
    }, []);

    return <CustomSplashScreen/>;
}

export default App;