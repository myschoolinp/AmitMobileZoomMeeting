import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Linking,
    Alert,
} from 'react-native';

import {
    getFirestore,
    doc,
    getDoc,
    collection,
    where,
    query,
    getDocs,
} from '@react-native-firebase/firestore';

import { Timestamp } from 'firebase/firestore';
import { getUser } from '../../../utils/storage';
import { useIsFocused } from '@react-navigation/native';
import { onSnapshot } from '@react-native-firebase/firestore';
import { useLoader } from '../../../context/LoaderContext';

const JoinedBatches = ({ navigation }: any) => {
    const [courses, setCourses] = useState<any[]>([]);
    const isFocused = useIsFocused();
    const { showLoader, hideLoader } = useLoader();

    const db = getFirestore();


    useEffect(() => {
        const subscribeToCourses = async () => {
            showLoader();
            try {
                const user = await getUser();
                if (!user?.id) return;

                const userRef = doc(db, 'users', user.id);

                // Listen for changes in user's subscribedBatches
                const unsubscribeUser = onSnapshot(userRef, async (userSnap) => {
                    if (!userSnap.exists()) return;

                    const subscribedIds: string[] = Object.keys(userSnap.data()?.subscribedBatches || {});

                    if (subscribedIds.length === 0) {
                        setCourses([]);
                        hideLoader()
                        return;
                    }

                    // Firestore only allows max 10 in 'in', so chunk
                    const chunks = [];
                    for (let i = 0; i < subscribedIds.length; i += 10) {
                        chunks.push(subscribedIds.slice(i, i + 10));
                    }

                    let allCourses: any[] = [];

                    for (const chunk of chunks) {
                        try {
                            const q = query(collection(db, 'batches'), where('__name__', 'in', chunk));

                            // Listen to each batch in real-time
                            const unsubscribeBatch = onSnapshot(q, (snapshot) => {
                                const list = snapshot.docs.map((doc: any) => ({
                                    id: doc.id,
                                    ...doc.data(),
                                }));

                                // Merge with previous courses
                                allCourses = [...allCourses.filter(c => !list.find((l: any) => l.id === c.id)), ...list];
                                setCourses(allCourses);
                                hideLoader();
                            });
                        }
                        catch (e) {
                            hideLoader();
                        }

                        // Optional: store unsubscribeBatch if you want to stop listening later
                    }
                    hideLoader();
                });

                // Clean up listener when component unmounts
                return () => {
                    unsubscribeUser();
                };
            } catch (e) {
                hideLoader()
            };
        };


        subscribeToCourses();
    }, []);


    /* ---------- FORMATTERS ---------- */

    const formatDate = (dateField: any) => {
        if (!dateField) return '';
        if (dateField instanceof Timestamp) return dateField.toDate().toDateString();
        if (dateField instanceof Date) return dateField.toDateString();
        if (dateField._seconds)
            return new Date(dateField._seconds * 1000).toDateString();
        return dateField;
    };

    const formatTime = (timeField: any) => {
        if (!timeField) return '';
        if (timeField instanceof Timestamp)
            return timeField.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (timeField instanceof Date)
            return timeField.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (timeField._seconds)
            return new Date(timeField._seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return timeField;
    };

    /* ---------- JOIN MEETING ---------- */

    const joinMeeting = async (link: string) => {

        if (!link) {
            Alert.alert('Error', 'Zoom link not available');
            return;
        }

        try {
            await Linking.openURL(link);
        } catch (error) {
            Alert.alert('Error', 'Unable to open Zoom link');
        }

    };
    /* ---------- UI ---------- */

    const renderItem = ({ item }: any) => {
        const meetingStatus = item.meetingStatus; // 'scheduled' | 'started' | 'ended'

        // Determine button state and label
        let btnText = 'Join Meeting';
        let btnDisabled = false;
        let btnColor = '#2D8CFF';

        if (meetingStatus === 'scheduled') {
            btnText = 'Meeting not yet started';
            btnDisabled = true;
            btnColor = '#aaa';
        } else if (meetingStatus === 'started') {
            btnText = 'Meeting started - Join';
            btnDisabled = false;
            btnColor = '#2D8CFF';
        } else if (meetingStatus === 'ended') {
            btnText = 'Meeting ended';
            btnDisabled = true;
            btnColor = '#aaa';
        }

        return (
            <View style={styles.card}>
                <Text style={styles.title}>{item.topic}</Text>
                <Text style={styles.desc}>{item.description}</Text>

                {/* LEFT / RIGHT DETAILS */}
                <View style={styles.rowContainer}>
                    <View style={styles.leftColumn}>
                        <Text>📅 {formatDate(item.date)}</Text>
                        <Text>⏰ {formatTime(item.time)}</Text>
                        <Text>⏳ {item.duration}</Text>
                    </View>

                    <View style={styles.rightColumn}>
                        <Text>👥 {item.batchSize}</Text>
                        <Text>💰 ₹{item.fee}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.joinBtn, { backgroundColor: btnColor }]}
                    onPress={() => !btnDisabled && joinMeeting(item.zoomLink)}
                    disabled={btnDisabled}
                >
                    <Text style={styles.btnText}>{btnText}</Text>
                </TouchableOpacity>
            </View>
        );
    };



    return courses.length === 0 ? (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
                You have not subscribed to any courses. {'\n'}
                Go to the Batch section and subscribe to start learning.
            </Text>
        </View>
    ) : (
        <FlatList
            data={courses}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
        />
    );


};
const styles = StyleSheet.create({
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
        marginBottom: 4,
    },

    desc: {
        color: '#555',
        marginBottom: 8,
    },

    rowContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },

    leftColumn: {
        flex: 1,
    },

    rightColumn: {
        flex: 1,
        alignItems: 'flex-start',
    },

    joinBtn: {
        backgroundColor: '#2D8CFF',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 16,
        alignItems: 'center',
    },

    btnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    emptyText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },

    goBatchBtn: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
    },

    goBatchBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

});

export default JoinedBatches;
