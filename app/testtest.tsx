import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import {router} from "expo-router";


export default function Testtest(){
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder="Recording name"
            />
            <TouchableOpacity style={styles.saveButton} >
                <Text style={styles.buttonText} onPress={router.back}>Save Recording</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginTop: 20,
        width: '80%',
        alignItems: 'flex-start',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        width: '100%',
        paddingHorizontal: 10,
    },
    saveButton: {
        backgroundColor: '#42f554',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginLeft: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});