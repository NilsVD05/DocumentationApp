// firestore.tsx
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCuUu8eN4UPdrJgWP5gBGVDIygzHQ7bhlY",
    authDomain: "documentationapp-a4e19.firebaseapp.com",
    projectId: "documentationapp-a4e19",
    storageBucket: "documentationapp-a4e19.appspot.com",
    messagingSenderId: "361582726724",
    appId: "1:361582726724:web:ed01a53e3c1d5fad26b611",
    measurementId: "G-2XD1577RBB"
};

let app;

if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
} else {
    app = firebase.app();
}


const firestore = firebase.firestore();

export { firestore };


