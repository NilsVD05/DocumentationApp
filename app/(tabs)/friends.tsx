import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, Button, Modal} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';


interface User {
    id: string;
    name: string;
    profilePicture: string;
}

const testDataFriends: User[] = [
    { id: '1', name: 'Alice', profilePicture: 'https://xsgames.co/randomusers/assets/avatars/male/20.jpg' },
    { id: '2', name: 'Bob', profilePicture: 'https://xsgames.co/randomusers/assets/avatars/male/21.jpg' },
    { id: '5', name: 'Mauro', profilePicture: 'https://xsgames.co/randomusers/assets/avatars/male/24.jpg' },
    { id: '6', name: 'Colini', profilePicture: 'https://xsgames.co/randomusers/assets/avatars/male/25.jpg' },
];

const testDataRequests: User[] = [
    { id: '3', name: 'Charlie', profilePicture: 'https://xsgames.co/randomusers/assets/avatars/male/22.jpg' },
    { id: '4', name: 'Dave', profilePicture: 'https://xsgames.co/randomusers/assets/avatars/male/23.jpg' },
    { id: '7', name: 'Noah', profilePicture: 'https://xsgames.co/randomusers/assets/avatars/male/26.jpg' },
    { id: '8', name: 'Nick', profilePicture: 'https://xsgames.co/randomusers/assets/avatars/male/27.jpg' },
];

const Friends: React.FC = () => {
    const [friends, setFriends] = useState<User[]>(testDataFriends);
    const [requests, setRequests] = useState<User[]>(testDataRequests);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);


    useEffect(() => {
        fetchFriendsAndRequests();
    }, []);

    const fetchFriendsAndRequests = async () => {
        try {
            // Example of fetching data from an API
            // const friendsResponse = await fetch('https://api.example.com/friends');
            // const requestsResponse = await fetch('https://api.example.com/requests');
            // const friendsData = await friendsResponse.json();
            // const requestsData = await requestsResponse.json();
            // setFriends(friendsData);
            // setRequests(requestsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const acceptRequest = (userId: string) => {
        const acceptedUser = requests.find(user => user.id === userId);
        if (acceptedUser) {
            setFriends([...friends, acceptedUser]);
            setRequests(requests.filter(user => user.id !== userId));
        }
    };

    const rejectRequest = (userId: string) => {
        setRequests(requests.filter(user => user.id !== userId));
    };

    const deleteFriend = (userId: string) => {
        setFriends(friends.filter(user => user.id !== userId));
    };

    const openProfilePicture = (user: User) => {
        setSelectedUser(user);
    };

    const closeProfilePicture = () => {
        setSelectedUser(null);
    };

    const renderUser = (user: User, isRequest: boolean) => (
        <View>
            <View style={styles.userContainer}>
                <TouchableOpacity onPress={() => openProfilePicture(user)}>
                    <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
                </TouchableOpacity>
                <Text style={styles.userName}>{user.name}</Text>
                {isRequest ? (
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => acceptRequest(user.id)} style={styles.iconSpacing}>
                            <FontAwesome name="check" size={24} color="#4AA75E" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => rejectRequest(user.id)}>
                            <FontAwesome name="times" size={24} color="#FE1B1B" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => deleteFriend(user.id)}>
                        <FontAwesome name="trash" size={24} color="#FE1B1B" />
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.separator} />
        </View>
    );


    const renderHeader = () => (
        <>
            <Text style={styles.title}>Freunde</Text>
            <View style={styles.sectionContainer}>
                <FlatList
                    data={friends}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => renderUser(item, false)}
                />
            </View>
            <Text style={styles.title}>Anfragen</Text>
            <View style={styles.sectionContainer}>
                <FlatList
                    data={requests}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => renderUser(item, true)}
                />
            </View>
        </>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={[]}
                renderItem={() => null}
                ListHeaderComponent={renderHeader}
            />
            <Modal
                visible={!!selectedUser}
                transparent={true}
                animationType="fade"
                onRequestClose={closeProfilePicture}
            >
                <BlurView intensity={50} style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Image
                            source={{ uri: selectedUser?.profilePicture }}
                            style={styles.modalImage}
                        />
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeProfilePicture}
                        >
                            <Text style={styles.buttonText}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    closeButton: {
        backgroundColor: '#0b6efe',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 10, // Add a little space above the button
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
        marginTop: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    sectionContainer: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
        backgroundColor: 'transparent',
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    userName: {
        flex: 1,
        fontSize: 18,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconSpacing: {
        marginRight: 10,
    },
    separator: {
        height: 1,
        backgroundColor: 'black',
        marginVertical: 5,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Damit der Hintergrund etwas dunkler wird
    },
    modalContent: {
        alignItems: 'center',
        backgroundColor: 'transparent', // Hintergrund transparent machen
    },

    modalImage: {
        width: 300,
        height: 300,
        borderRadius: 150,
    },

});

export default Friends;
