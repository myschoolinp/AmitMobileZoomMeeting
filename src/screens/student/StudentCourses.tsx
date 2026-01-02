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
import { getUser } from '../../utils/storage';

const StudentCourses = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const db = getFirestore();

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        const user = await getUser();
        if (!user?.id) return;

        const userRef = doc(db, 'users', user.id);
        const userSnap = await getDoc(userRef);
        const subscribedIds = userSnap.data()?.subscribedBatches || [];

        if (subscribedIds.length === 0) return;

        const q = query(
            collection(db, 'batches'),
            where('__name__', 'in', subscribedIds)
        );

        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
        }));

        setCourses(list);
    };

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

        const supported = await Linking.canOpenURL(link);
        if (supported) {
            Linking.openURL(link);
        } else {
            Alert.alert('Error', 'Invalid Zoom link');
        }
    };
    /* ---------- UI ---------- */

    const renderItem = ({ item }: any) => (
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
                style={styles.joinBtn}
                onPress={() => joinMeeting(item.zoomLink)}
            >
                <Text style={styles.btnText}>Join Meeting</Text>
            </TouchableOpacity>
        </View>
    );

    return (
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
});

export default StudentCourses;
