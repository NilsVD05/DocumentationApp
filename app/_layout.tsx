import { Stack } from 'expo-router/stack';
import React from "react";
import firebase from "firebase/compat";
import initializeApp = firebase.initializeApp;
import {getReactNavigationConfig} from "expo-router/build/getReactNavigationConfig";
import { initializeAuth, getReactNativePersistence} from 'firebase/auth';
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";



const firebaseConfig = {
    apiKey: "AIzaSyCuUu8eN4UPdrJgWP5gBGVDIygzHQ7bhlY",
    authDomain: "documentationapp-a4e19.firebaseapp.com",
    projectId: "documentationapp-a4e19",
    storageBucket: "documentationapp-a4e19.appspot.com",
    messagingSenderId: "361582726724",
    appId: "1:361582726724:web:ed01a53e3c1d5fad26b611",
    measurementId: "G-2XD1577RBB"
};


const app = initializeApp(firebaseConfig);
initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export default function Layout() {


    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="testtest" options={{ headerShown: true }} />
        </Stack>
    );
}