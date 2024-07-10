import {
    Alert,
    Button,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
} from "react-native";
import {useEffect, useState} from "react";
import {Audio} from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {getAuth} from "firebase/auth";
import {firestore} from "../../db/firestore";
import * as MediaLibrary from "expo-media-library";
import firebase from "firebase/compat"; // Importing the MediaLibrary module
import { Vibration } from 'react-native';


export default function Tab() {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [seconds, setSeconds] = useState<number>(0);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [recordedUri, setRecordedUri] = useState<string | null>(null);
    const [recordings, setRecordings] = useState<Array<{ name: string, uri: string }>>([]);
    const [name, setName] = useState<string>("");
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
    const [selectedRecording, setSelectedRecording] = useState<{ name: string, uri: string } | null>(null);


    const {currentUser} = getAuth();

    useEffect(() => {
        const loadRecordings = async () => {
            try {
                const userId = firebase.auth().currentUser?.uid; // Get the current user's ID
                if (userId) {
                    const savedRecordings = await AsyncStorage.getItem(`recordings_${userId}`);
                    if (savedRecordings) {
                        setRecordings(JSON.parse(savedRecordings));
                    }
                }
            } catch (error) {
                console.error("Failed to load recordings", error);
            }
        };
        loadRecordings();
    }, []);


    const startRecording = async () => {
        setIsRecording(true);
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();

            setRecording(recording);
        } catch (err) {
            console.error("Failed to start recording", err);
        }
    };

    const stopRecording = async () => {
        if (recording) {
            setIsRecording(false);
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecordedUri(uri);
            setRecording(null);
            setModalVisible(true);
        }
    };

    const saveRecording = async () => {
        if (name && recordedUri) {
            const newRecording = { name, uri: recordedUri };
            const updatedRecordings = [...recordings, newRecording];
            setRecordings(updatedRecordings);

            const userId = firebase.auth().currentUser?.uid; // Get the current user's ID

            if (userId) {
                try {
                    await AsyncStorage.setItem(`recordings_${userId}`, JSON.stringify(updatedRecordings));
                    setName("");
                    setRecordedUri(null);
                    setSeconds(0);
                    setModalVisible(false);

                    const content = '<!DOCTYPE html>\n' +
                        '<html lang="de">\n' +
                        '<head>\n' +
                        '    <meta charset="UTF-8">\n' +
                        '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
                        '    <title>Präsentation über Expo</title>\n' +
                        '    <style>\n' +
                        '        body {\n' +
                        '            font-family: Arial, sans-serif;\n' +
                        '            line-height: 1.6;\n' +
                        '            margin: 0;\n' +
                        '            padding: 0;\n' +
                        '        }\n' +
                        '        header, section, footer {\n' +
                        '            padding: 20px;\n' +
                        '            margin: 10px;\n' +
                        '        }\n' +
                        '        header {\n' +
                        '            background: #4CAF50;\n' +
                        '            color: white;\n' +
                        '            text-align: center;\n' +
                        '        }\n' +
                        '        nav {\n' +
                        '            background: #f2f2f2;\n' +
                        '            padding: 10px;\n' +
                        '            text-align: center;\n' +
                        '        }\n' +
                        '        nav a {\n' +
                        '            margin: 0 15px;\n' +
                        '            text-decoration: none;\n' +
                        '            color: #333;\n' +
                        '        }\n' +
                        '        .container {\n' +
                        '            max-width: 800px;\n' +
                        '            margin: 0 auto;\n' +
                        '        }\n' +
                        '        section {\n' +
                        '            background: #f9f9f9;\n' +
                        '            border: 1px solid #ddd;\n' +
                        '        }\n' +
                        '        h2 {\n' +
                        '            color: #4CAF50;\n' +
                        '        }\n' +
                        '        ul {\n' +
                        '            list-style-type: square;\n' +
                        '            padding-left: 20px;\n' +
                        '        }\n' +
                        '        pre {\n' +
                        '            background: #333;\n' +
                        '            color: #f8f8f2;\n' +
                        '            padding: 10px;\n' +
                        '            overflow-x: auto;\n' +
                        '        }\n' +
                        '        code {\n' +
                        '            color: #ff79c6;\n' +
                        '        }\n' +
                        '        .code-block {\n' +
                        '            margin: 20px 0;\n' +
                        '        }\n' +
                        '        footer {\n' +
                        '            text-align: center;\n' +
                        '            font-size: 0.9em;\n' +
                        '            color: #666;\n' +
                        '        }\n' +
                        '    </style>\n' +
                        '</head>\n' +
                        '<body>\n' +
                        '\n' +
                        '<header>\n' +
                        '    <h1>Präsentation über Expo</h1>\n' +
                        '</header>\n' +
                        '\n' +
                        '<nav>\n' +
                        '    <a href="#einführung">Einführung</a>\n' +
                        '    <a href="#installation">Installation</a>\n' +
                        '    <a href="#nutzung">Nutzung</a>\n' +
                        '    <a href="#vorteile">Vorteile</a>\n' +
                        '</nav>\n' +
                        '\n' +
                        '<div class="container">\n' +
                        '\n' +
                        '<section id="einführung">\n' +
                        '    <h2>Einführung</h2>\n' +
                        '    <p>Expo ist ein Framework und eine Plattform für universelle React-Anwendungen. Mit Expo können Entwickler schnell und einfach React Native Apps für iOS und Android erstellen.</p>\n' +
                        '    <img src="expo-logo.png" alt="Expo Logo" style="max-width: 100%;">\n' +
                        '</section>\n' +
                        '\n' +
                        '<section id="installation">\n' +
                        '    <h2>Installation</h2>\n' +
                        '    <p>Um Expo zu installieren, benötigen Sie Node.js und npm auf Ihrem Rechner. Führen Sie dann den folgenden Befehl aus:</p>\n' +
                        '    <div class="code-block">\n' +
                        '        <pre><code>npm install -g expo-cli</code></pre>\n' +
                        '    </div>\n' +
                        '    <p>Mit diesem Befehl wird die Expo Command Line Interface (CLI) global auf Ihrem System installiert.</p>\n' +
                        '</section>\n' +
                        '\n' +
                        '<section id="nutzung">\n' +
                        '    <h2>Nutzung</h2>\n' +
                        '    <p>Nachdem Expo installiert ist, können Sie ein neues Projekt erstellen und starten:</p>\n' +
                        '    <div class="code-block">\n' +
                        '        <pre><code>expo init mein-projekt\n' +
                        'cd mein-projekt\n' +
                        'expo start</code></pre>\n' +
                        '    </div>\n' +
                        '    <p>Dies öffnet eine neue Seite in Ihrem Browser, auf der Sie den QR-Code scannen können, um Ihre App in der Expo Go App auf Ihrem mobilen Gerät zu sehen.</p>\n' +
                        '</section>\n' +
                        '\n' +
                        '<section id="vorteile">\n' +
                        '    <h2>Vorteile von Expo</h2>\n' +
                        '    <ul>\n' +
                        '        <li>Schnelle Entwicklung ohne native Codeänderungen</li>\n' +
                        '        <li>Einfaches Testen auf mobilen Geräten</li>\n' +
                        '        <li>Große Community und viele Bibliotheken</li>\n' +
                        '        <li>Regelmäßige Updates und neue Funktionen</li>\n' +
                        '    </ul>\n' +
                        '</section>\n' +
                        '\n' +
                        '</div>\n' +
                        '\n' +
                        '<footer>\n' +
                        '    <p>&copy; 2024 Expo Präsentation. Alle Rechte vorbehalten.</p>\n' +
                        '</footer>\n' +
                        '\n' +
                        '</body>\n' +
                        '</html>\n';


                    await firestore.collection("Documents").add({
                        Titel: name,
                        Inhalt: content,
                        userId: userId,  // Add user ID to the document
                    });
                } catch (error) {
                    console.error("Error creating document: ", error);
                    Alert.alert("Fehler", "Fehler beim Erstellen des Dokuments");
                }
            } else {
                Alert.alert("Fehler", "Benutzer nicht authentifiziert");
            }
        }
    };

    const deleteRecording = async () => {
        if (selectedRecording) {
            const updatedRecordings = recordings.filter(rec => rec.uri !== selectedRecording.uri);
            setRecordings(updatedRecordings);

            const userId = firebase.auth().currentUser?.uid;
            if (userId) {
                await AsyncStorage.setItem(`recordings_${userId}`, JSON.stringify(updatedRecordings));
                // Entfernen des Dokuments aus der Datenbank
                const snapshot = await firestore.collection("Documents")
                    .where("Titel", "==", selectedRecording.name)
                    .where("userId", "==", userId)
                    .get();
                snapshot.forEach(doc => doc.ref.delete());
            }

            setDeleteModalVisible(false);
            setSelectedRecording(null);
        }
    };




    const playSound = async (uri: string) => {
        const {sound} = await Audio.Sound.createAsync({uri});
        setSound(sound);
        await sound.playAsync();
    };

    const downloadFile = async (uri: string) => {
        try {
            const permission = await MediaLibrary.requestPermissionsAsync();
            if (permission.granted) {
                const downloadDir = FileSystem.documentDirectory + 'Download/';
                const fileName = uri.split('/').pop();
                const newUri = downloadDir + fileName;

                await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });
                await FileSystem.copyAsync({
                    from: uri,
                    to: newUri,
                });

                await MediaLibrary.createAssetAsync(newUri);
                Alert.alert("Success", "File downloaded successfully.");
            } else {
                Alert.alert("Permission denied", "Permission to access storage was denied.");
            }
        } catch (error) {
            console.error("Error downloading the file: ", error);
            Alert.alert("Error", "Error downloading the file.");
        }
    };

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (isRecording) {
            timer = setInterval(() => {
                setSeconds((prev) => prev + 100);
            }, 100);
        }
        return () => {
            if (timer) {
                clearInterval(timer);
            }
        };
    }, [isRecording]);

    function formatTime(milliseconds: number) {
        const date = new Date(milliseconds);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getSeconds();
        const ms = Math.floor(date.getUTCMilliseconds() / 10);

        const pad = (num: number, size: number) => (`000${num}`).slice(size * -1);

        let timeStr = "";
        if (hh > 0) {
            timeStr += `${pad(hh, 2)}:`;
        }

        timeStr += `${pad(mm, 2)}:${pad(ss, 2)}.${pad(ms, 2)}`;

        return timeStr;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.timer}>{formatTime(seconds)}</Text>
            <ScrollView contentContainerStyle={styles.recordingsContainer}>
                {recordings.map((item) => (
                    <TouchableOpacity
                        key={item.uri}
                        onLongPress={() => {
                            Vibration.vibrate(100); // Vibrate for 100ms
                            setSelectedRecording(item);
                            setDeleteModalVisible(true);
                        }}
                    >
                        <View style={styles.recording}>
                            <Text style={styles.recordingText}>{item.name}</Text>
                            <TouchableOpacity style={styles.playButton} onPress={() => playSound(item.uri)}>
                                <Text style={styles.buttonText}>Play</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.downloadButton} onPress={() => downloadFile(item.uri)}>
                                <Text style={styles.buttonText}>Download</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TouchableOpacity
                    style={[styles.recordButton, isRecording ? styles.recordingBorder : null]}
                    onPress={recording ? stopRecording : startRecording}
                >
                    <Text style={styles.buttonText}>
                        {recording ? "Stop Recording" : "Record"}
                    </Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="none"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => {
                    setDeleteModalVisible(!deleteModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text>Möchten Sie diese Aufnahme wirklich löschen?</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.saveButton} onPress={deleteRecording}>
                                <Text style={styles.buttonText}>Ja</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={() => setDeleteModalVisible(false)}>
                                <Text style={styles.buttonText}>Nein</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            style={styles.input}
                            placeholder="Name der Präsentation"
                            value={name}
                            onChangeText={setName}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={saveRecording}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        marginTop: 30,

    },
    timer: {
        fontSize: 48,
        marginBottom: 20,
    },
    recordingsContainer: {
        width: "100%",
        padding: 20,
    },
    inputContainer: {
        marginTop: 20,
        width: "80%",
        alignItems: "center",
    },
    recordButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginBottom: 20,
    },
    recordingBorder: {
        borderWidth: 2,
        borderColor: "#007AFF",
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 20,
        width: "100%",
        paddingHorizontal: 10,
    },
    saveButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 10,  // Added margin for better spacing
    },
    playButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginLeft: 10,
    },
    downloadButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginLeft: 10,
    },
    recording: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#e0e0e0",
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        width: "100%",
    },
    recordingText: {
        fontSize: 16,
        flex: 1,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },

});
