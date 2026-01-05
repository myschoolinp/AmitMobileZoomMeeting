import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
} from 'react-native';

import {
    getFirestore,
    collection,
    onSnapshot,
    doc,
    updateDoc,
    Timestamp,
} from '@react-native-firebase/firestore';
import { getUser } from '../../../utils/storage';

type Course = {
    id: string;
    courseName: string;
    description: string;
    duration: string;
    price: number;
    discount?: number;
    isAvailableInDesktop: boolean;
    notes?: string;
    createdAt?: number; // stored as milliseconds
};

const AllCourses = ({ navigation }: any) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [userCourses, setUserCourses] = useState<{ [key: string]: any }>({}); // {courseId: { purchasedOn: timestamp }}

    const db = getFirestore();

    // 🔔 Fetch courses in real-time
    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'courses'), snapshot => {
            const list = snapshot.docs.map((doc: any) => ({
                id: doc.id,
                ...doc.data(),
            })) as Course[];
            setCourses(list);
        });

        return () => unsub();
    }, []);

    // 🔔 Fetch user's bought courses
    useEffect(() => {
        const fetchUserCourses = async () => {
            const user = await getUser();
            if (!user?.id) return;

            const userRef = doc(db, 'users', user.id);
            const snap: any = await userRef.get();
            if (snap.exists) {
                setUserCourses(snap.data()?.myCourses || {});
            }
        };
        fetchUserCourses();
    }, []);

    const buyCourse = async (course: Course) => {
        try {
            const user = await getUser();
            if (!user?.id) return;

            const userRef = doc(db, 'users', user.id);

            // 🔔 Avoid duplicate
            if (userCourses[course.id]) {
                Alert.alert('Info', 'You already bought this course');
                return;
            }

            const purchasedOn = Timestamp.now();

            await updateDoc(userRef, {
                [`myCourses.${course.id}`]: { purchasedOn },
            });

            // 🔥 Update local state immediately
            setUserCourses(prev => ({ ...prev, [course.id]: { purchasedOn } }));
            Alert.alert('Success', 'Course purchased successfully');
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    const formatDate = (timestamp?: any) => {
        if (!timestamp) return 'N/A';
        if (timestamp.toDate) return timestamp.toDate().toDateString();
        if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toDateString();
        return new Date(timestamp).toDateString();
    };

    const renderCourseCard = ({ item }: { item: Course }) => (
        <View style={styles.card}>
            <View style={styles.topicRow}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                    {item.courseName}
                </Text>
            </View>

            <Text style={styles.text}>{item.description}</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Duration:</Text>
                <Text style={styles.value}>{item.duration}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Fee:</Text>
                <Text style={styles.value}>{item.price}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Discount:</Text>
                <Text style={styles.value}>{item.discount || 0}%</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Mode:</Text>
                <Text style={styles.value}>
                    {item.isAvailableInDesktop ? 'Desktop + Mobile' : 'Mobile Only'}
                </Text>
            </View>

            {/* Buy Course Button */}
            <TouchableOpacity
                style={[
                    styles.buyBtn,
                    userCourses[item.id] && styles.disabledBtn,
                ]}
                disabled={!!userCourses[item.id]}
                onPress={() => buyCourse(item)}
            >
                <Text style={styles.buyText}>
                    {userCourses[item.id] ? 'Purchased' : 'Buy Course'}
                </Text>
            </TouchableOpacity>

            {/* Show purchase date if bought */}
            {userCourses[item.id] && (
                <Text style={styles.purchaseDate}>
                    Purchased on: {formatDate(userCourses[item.id].purchasedOn)}
                </Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={courses}
                keyExtractor={(item) => item.id}
                renderItem={renderCourseCard}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa', padding: 16 },
    list: { paddingBottom: 30 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 3 },
    topicRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    title: { fontSize: 18, fontWeight: 'bold', flex: 1 },
    text: { fontSize: 14, color: '#555', marginBottom: 12 },
    row: { flexDirection: 'row', marginBottom: 6 },
    label: { fontWeight: '600', width: 120, color: '#333' },
    value: { color: '#555' },
    buyBtn: {
        backgroundColor: '#28a745',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    buyText: { color: '#fff', fontWeight: '600', fontSize: 14 },
    disabledBtn: { backgroundColor: '#aaa' },
    purchaseDate: { marginTop: 6, fontSize: 12, color: '#555' },
});

export default AllCourses;
