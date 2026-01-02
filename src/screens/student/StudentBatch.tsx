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
} from '@react-native-firebase/firestore';

import { Timestamp } from 'firebase/firestore';
import { getUser } from '../../utils/storage';


const StudentBatch = ({ navigation }: any) => {
    const [batches, setBatches] = useState<any[]>([]);
    const [subscribedBatchIds, setSubscribedBatchIds] = useState<string[]>([]);
    useEffect(() => {
        const loadSubscribedBatches = async () => {
            const user = await getUser();
            if (!user?.id) return;

            const userRef = doc(db, 'users', user.id);
            const userSnap: any = await userRef.get();

            if (userSnap && userSnap.exists) {
                const data = userSnap.data();
                setSubscribedBatchIds(data?.subscribedBatches || []);
            }
        };

        loadSubscribedBatches();
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
        try {
            const user = await getUser();
            if (!user?.id) return;

            const userRef = doc(db, 'users', user.id);

            await updateDoc(userRef, {
                subscribedBatches: arrayUnion(batch.id),
            });

            // ✅ Update UI instantly
            setSubscribedBatchIds(prev => [...prev, batch.id]);

            Alert.alert('Success', 'Batch subscribed successfully');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
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

    const renderItem = ({ item }: any) => {
        const isSubscribed = subscribedBatchIds.includes(item.id);

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

                <View style={styles.row}>
                    <TouchableOpacity
                        style={[
                            styles.startBtn,
                            isSubscribed && styles.subscribedBtn,
                        ]}
                        onPress={() => subscribeBatch(item)}
                        disabled={isSubscribed}
                    >
                        <Text style={styles.btnText}>
                            {isSubscribed ? 'Subscribed' : 'Subscribe'}
                        </Text>
                    </TouchableOpacity>
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
    }
});


export default StudentBatch;
