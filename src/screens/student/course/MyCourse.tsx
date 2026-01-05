import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';
import { getUser } from '../../../utils/storage';
import { Timestamp } from '@react-native-firebase/firestore';
import { useLoader } from '../../../context/LoaderContext';

const MyCourses = () => {
    const [myCourses, setMyCourses] = useState<any[]>([]);
    const db = getFirestore();
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        const fetchMyCourses = async () => {
            showLoader();
            const user = await getUser();
            if (!user?.id) {
                setMyCourses([]);
                hideLoader();
                return;
            }

            const userRef = doc(db, 'users', user.id);
            const snap: any = await getDoc(userRef);

            if (snap.exists()) {
                const myCoursesObj = snap.data()?.myCourses || {};
                const coursesData: any[] = [];

                for (let courseId in myCoursesObj) {
                    const courseSnap: any = await getDoc(doc(db, 'courses', courseId));
                    if (courseSnap.exists) {
                        coursesData.push({
                            id: courseSnap.id,
                            ...courseSnap.data(),
                            purchasedOn: myCoursesObj[courseId].purchasedOn,
                        });
                    }
                }

                setMyCourses(coursesData);
            }
            hideLoader();
        };
        fetchMyCourses();
    }, []);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '';
        if (timestamp.toDate) return timestamp.toDate().toDateString();
        if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toDateString();
        return new Date(timestamp).toDateString();
    };



    if (myCourses.length === 0) {
        return (
            <View style={styles.center}>
                <Text style={styles.noCourseText}>You have not purchased any courses yet.</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={myCourses}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
                <View style={styles.card}>
                    <Text style={styles.title}>{item.courseName}</Text>
                    <Text>{item.description}</Text>
                    <Text>Duration: {item.duration}</Text>
                    <Text>Price: ₹{item.price}</Text>
                    <Text>Purchased on: {formatDate(item.purchasedOn)}</Text>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    noCourseText: { fontSize: 16, color: '#555', textAlign: 'center' },
    card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3 },
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
});

export default MyCourses;
