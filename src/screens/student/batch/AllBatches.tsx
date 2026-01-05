import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Linking,
} from 'react-native';

import {
    getFirestore,
    collection,
    onSnapshot,
    deleteDoc,
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
} from '@react-native-firebase/firestore';

import { Timestamp } from 'firebase/firestore';
import { getUser } from '../../../utils/storage';


const AllBatches = ({ navigation }: any) => {
    const [batches, setBatches] = useState<any[]>([]);
    const [subscribedBatchIds, setSubscribedBatchIds] = useState<string[]>([]);
    const [subscribedBatches, setSubscribedBatches] = useState<any>({});


    useEffect(() => {
        const fetchUserSubscriptions = async () => {
            const user = await getUser();
            if (!user?.id) return;

            const userRef = doc(db, 'users', user.id);
            const snap: any = await getDoc(userRef);

            if (snap.exists()) {
                setSubscribedBatches(snap.data().subscribedBatches || {});
            }
        };

        fetchUserSubscriptions();
    }, []);


    useEffect(() => {
        const db = getFirestore();

        const unsub = onSnapshot(collection(db, 'batches'), snapshot => {
            const list = snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBatches(list);
        });

        return () => unsub();
    }, []);


    const db = getFirestore();

    const subscribeBatch = async (batch: any) => {
        Alert.alert(
            'Subscribe',
            'Do you want to subscribe to this batch?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        try {
                            const user = await getUser();
                            if (!user?.id) return;

                            const subscribedOn = Timestamp.now();

                            const userRef = doc(db, 'users', user.id);

                            await updateDoc(userRef, {
                                [`subscribedBatches.${batch.id}`]: {
                                    subscribedOn,
                                },
                            });

                            // 🔥 IMMEDIATE UI UPDATE
                            setSubscribedBatches((prev: any) => ({
                                ...prev,
                                [batch.id]: { subscribedOn },
                            }));

                            Alert.alert('Success', 'Batch subscribed successfully');
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };


    const formatDate = (dateField: any) => {
        if (!dateField) return '';

        // Firestore Timestamp
        if (dateField instanceof Timestamp) {
            const dateCopy = dateField.toDate();
            return dateCopy.toDateString(); // or toLocaleDateString()
        }

        // Plain JS Date
        if (dateField instanceof Date) {
            const dateCopy = new Date(dateField.getTime()); // make a copy
            return dateCopy.toDateString();
        }

        // If it's a string (already formatted)
        if (typeof dateField === 'string') {
            return dateField;
        }

        // If it's a Firestore timestamp object but not instance
        if (dateField._seconds) {
            const dateCopy = new Date(dateField._seconds * 1000);
            return dateCopy.toDateString();
        }

        return ''; // fallback
    };


    const formatTime = (timeField: any) => {
        if (!timeField) return '';

        if (timeField instanceof Timestamp) {
            const timeCopy = timeField.toDate();
            return timeCopy.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        if (timeField instanceof Date) {
            const timeCopy = new Date(timeField.getTime());
            return timeCopy.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        if (typeof timeField === 'string') {
            return timeField;
        }

        if (timeField._seconds) {
            const timeCopy = new Date(timeField._seconds * 1000);
            return timeCopy.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        return '';
    };
    const isSubscribed = (batchId: string) =>
        !!subscribedBatches?.[batchId];

    const getSubscribedDate = (batchId: string) =>
        formatSubscribedDate(subscribedBatches?.[batchId]?.subscribedOn);
    const formatSubscribedDate = (value: any) => {
        if (!value) return '';

        // Firestore Timestamp
        if (value.toDate) {
            return value.toDate().toDateString();
        }

        // Firestore serialized timestamp
        if (value.seconds) {
            return new Date(value.seconds * 1000).toDateString();
        }

        // JS Date
        if (value instanceof Date) {
            return value.toDateString();
        }

        return '';
    };

    const renderItem = ({ item }: any) => {

        return (
            <View style={styles.card}>
                <Text style={styles.title}>{item.topic}</Text>
                <Text>{item.description}</Text>

                <View style={styles.rowContainer}>
                    <View style={styles.leftColumn}>
                        <Text>📅 Date: {formatDate(item.date)}</Text>
                        <Text>⏰ Time: {formatTime(item.time)}</Text>
                        <Text>⏳ Duration: {item.duration}</Text>
                    </View>

                    <View style={styles.rightColumn}>
                        <Text>👥 Batch Size: {item.batchSize}</Text>
                        <Text>💰 Fee: ₹{item.fee}</Text>
                    </View>
                </View>

                <View style={styles.subscribeRow}>
                    {/* LEFT: Button */}
                    <TouchableOpacity
                        style={[
                            styles.startBtn,
                            isSubscribed(item.id) && styles.disabledBtn,
                        ]}
                        disabled={isSubscribed(item.id)}
                        onPress={() => subscribeBatch(item)}
                    >
                        <Text style={styles.btnText}>
                            {isSubscribed(item.id) ? 'Subscribed' : 'Subscribe'}
                        </Text>
                    </TouchableOpacity>

                    {/* RIGHT: Subscription text */}
                    {isSubscribed(item.id) && (
                        <Text style={styles.subscribedText}>
                            You have subscribed on {getSubscribedDate(item.id)}
                        </Text>
                    )}
                </View>



            </View>
        );
    };


    return (
        <View style={styles.container}>

            {/* Batch List */}
            <FlatList
                data={batches}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        padding: 16,
    },

    addButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 16,
    },

    addText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        elevation: 3,
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },

    desc: {
        color: '#555',
        marginBottom: 6,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },

    startBtn: {
        backgroundColor: '#2D8CFF',
        padding: 8,
        borderRadius: 6,
    },

    btnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    rowRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',  // Push items to the right
        gap: 20,                     // Space between batch size and fee
        marginTop: 8,
    },
    rowContainer: {
        flexDirection: 'row',
        marginTop: 12,
    },

    leftColumn: {
        flex: 1,
        justifyContent: 'flex-start',
    },

    rightColumn: {
        flex: 1,
        alignItems: 'flex-start', // aligns text to right inside the right column
        justifyContent: 'flex-start',
    },
    subscribedBtn: {
        backgroundColor: '#9e9e9e',
    },


    subscribeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },

    disabledBtn: {
        backgroundColor: '#aaa',
    },

    subscribedText: {
        marginLeft: 10,
        fontSize: 12,
        color: 'green',
        flex: 1,              // pushes text to right
        flexWrap: 'wrap',
    },

});


export default AllBatches;
