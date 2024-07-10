import FontAwesome from '@expo/vector-icons/FontAwesome';
import {View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Button, TextInput} from 'react-native';
import {router, Tabs} from 'expo-router';
import {useState} from "react";
import {getAuth} from "firebase/auth";

export default function TabLayout() {

    const [isLoading, setIsLoading] = useState(true);


    getAuth().onAuthStateChanged((user) => {
        setIsLoading(false);
        if (!user) {
            router.replace("/landing");
        }
    });

    if (isLoading) return <Text style={{ paddingTop: 30 }}>Loading...</Text>;


    return (
        <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: 'blue' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Aufnehmen',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="microphone" color={color} />,
                }}
            />
            <Tabs.Screen
                name="friends"
                options={{
                    title: 'Freunde',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="users" color={color} />,
                }}
            />
            <Tabs.Screen
                name="files"
                options={{
                    title: 'Präsentationen',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="file-text" color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Einstellungen',
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
                }}
            />
        </Tabs>
    );
}