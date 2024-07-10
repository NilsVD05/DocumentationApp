import React, { useEffect, useState } from 'react';
import { Button, View, StyleSheet, Text } from 'react-native';
import firebase from 'firebase/compat';

const Settings: React.FC = () => {
    const [email, setEmail] = useState('');

    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            setEmail(user.email || '');
        }
    }, []);

    const handleSignOut = async () => {
        try {
            await firebase.auth().signOut();
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.emailText}>Eingeloggt als: {email}</Text>
            <Button title="Ausloggen" onPress={handleSignOut} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    emailText: {
        fontSize: 20, // Increase the font size
        marginBottom: 20, // Add space between the text and the button
    },
});

export default Settings;