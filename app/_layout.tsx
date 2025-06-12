import "../global.css";
import {Slot} from "expo-router";
import {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";
import {SQLiteProvider} from "expo-sqlite";
import {initializeDatabase} from "@/db/db-init";
import {UserProvider} from "@/context/UserContext";
import {CycleProvider} from "@/context/CycleContext";
import {Asset} from "expo-asset";
import images from "@/constants/images";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

const RootNavigation = () => {

    useEffect(() => {
        const prepare = async () => {
            await SplashScreen.hideAsync();
            const imageModules = Object.values(images);
            await Asset.loadAsync(imageModules);
            await Font.loadAsync(Ionicons.font);
        };

        prepare();
    }, []);

    return (
        <Slot />
    )
};


const RootLayout = () => {
    return (
        <SQLiteProvider databaseName="hera.db" onInit={initializeDatabase}>
            <UserProvider>
                <CycleProvider>
                   <RootNavigation />
                </CycleProvider>
            </UserProvider>
        </SQLiteProvider>
    );
};

export default RootLayout;
