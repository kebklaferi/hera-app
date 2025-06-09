import {Tabs} from 'expo-router';
import {Pressable, Text, TouchableOpacity, View} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
interface TabIconProps {
    iconName: any,
    focused: any
}

const TabIcon = ({iconName, focused}: TabIconProps) => {
    return (
        <View className="">
            <Ionicons name={iconName} size={26} color={focused ? `#F47251` : `black`} />
        </View>
    )
}
const CustomTabButton = (props: any) => (
    <Pressable
        {...props}
        android_ripple={null}
        className="flex-1 items-center justify-center"
    />
);
export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    paddingTop: 5
                }
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                        <TabIcon iconName="home" focused={focused}/>
                    ),
                    tabBarButton: (props) => <CustomTabButton {...props} />,
                }}
            />
            <Tabs.Screen
                name="period-calendar"
                options={{
                    title: 'PeriodCalendar',
                    headerShown: false,
                    lazy: false,
                    tabBarIcon: ({focused}) => (
                        <TabIcon iconName="calendar" focused={focused}/>
                    ),
                    tabBarButton: (props) => <CustomTabButton {...props} />,
            }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({focused}) => (
                        <TabIcon iconName="person-sharp" focused={focused}/>
                    ),
                    tabBarButton: (props) => <CustomTabButton {...props} />,
            }}
            />
        </Tabs>
    );
}
