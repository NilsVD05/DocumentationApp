import React, { useEffect, useState } from 'react';
import { firestore } from "../../db/firestore";
import { Text, View, FlatList, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { useFocusEffect } from '@react-navigation/native';
import 'firebase/auth';
import firebase from "firebase/compat";

interface Document {
    id: string;
    Titel: string;
    Inhalt: string;
}

const Files: React.FC = () => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useFocusEffect(
        React.useCallback(() => {
            const fetchDocuments = async (): Promise<void> => {
                try {
                    const userId = firebase.auth().currentUser?.uid; // Get the current user's ID
                    if (userId) {
                        const userDocumentsSnapshot = await firestore.collection('Documents')
                            .where('userId', '==', userId) // Filter documents by user ID
                            .get();

                        const userDocuments = userDocumentsSnapshot.docs.map(doc => ({
                            id: doc.id,
                            Titel: doc.data().Titel, // Add this line
                            Inhalt: doc.data().Inhalt, // Add this line
                        }));

                        setDocuments(userDocuments); // Update your state with the fetched documents
                    }
                } catch (error) {
                    console.error("Failed to load user's documents", error);
                }
            };
            fetchDocuments();
        }, [])
    );

    const generatePdf = async (document: Document, action: 'open' | 'share') => {
        const html = `
            <html>
              <body>
                <h1>${document.Titel}</h1>
                <p>${document.Inhalt}</p>
              </body>
            </html>
        `;

        try {
            const file = await printToFileAsync({
                html: html,
                base64: false,
            });

            const newFileName = `${FileSystem.documentDirectory}${document.Titel.replace(/\s+/g, '_')}.pdf`;
            await FileSystem.moveAsync({
                from: file.uri,
                to: newFileName,
            });

            if (action === 'open') {
                const contentUri = await FileSystem.getContentUriAsync(newFileName);
                IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                    data: contentUri,
                    flags: 1,
                    type: 'application/pdf',
                });
            } else if (action === 'share') {
                await shareAsync(newFileName);
            }
        } catch (error) {
            console.error(`Error ${action === 'open' ? 'opening' : 'sharing'} PDF: `, error);
        }
    };

    const deleteDocument = async (id: string) => {
        try {
            await firestore.collection('Documents').doc(id).delete();
            setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== id));
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const renderItem = ({ item }: { item: Document }) => (
        <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => generatePdf(item, 'open')}>
                <FontAwesome name="file-pdf-o" size={24} color="black" style={styles.icon} />
            </TouchableOpacity>
            <Text style={styles.title}>{item.Titel}</Text>
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => generatePdf(item, 'share')}>
                    <FontAwesome name="paper-plane" size={24} color="blue" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteDocument(item.id)}>
                    <FontAwesome name="trash" size={24} color="red" style={styles.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Files</Text>
            <TextInput
                style={styles.searchBar}
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <FlatList
                data={documents.filter(doc => doc.Titel.toLowerCase().includes(searchQuery.toLowerCase()))}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
        marginTop: 30,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    list: {
        flexGrow: 1,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        marginHorizontal: 8,
    },
    title: {
        flex: 1,
        fontSize: 18,
    },
    iconContainer: {
        flexDirection: 'row',
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 8,
        marginBottom: 16,
    },
});

export default Files;
