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
    deleteDoc
} from '@react-native-firebase/firestore';

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

const AdminCourses = ({ navigation }: any) => {
    const [courses, setCourses] = useState<Course[]>([]);

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

    const handleDeleteCourse = async (id: string) => {
        Alert.alert(
            'Delete Course',
            'Are you sure you want to delete this course?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'courses', id));
                            Alert.alert('Deleted', 'Course deleted successfully');
                        } catch (error: any) {
                            Alert.alert('Error', error.message);
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toDateString();
    };

    const renderCourseCard = ({ item }: { item: Course }) => (
        <View style={styles.card}>
            {/* Row container for topic + buttons */}
            <View style={styles.topicRow}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                    {item.courseName}
                </Text>

                <TouchableOpacity
                    style={styles.editBtnSmall}
                    onPress={() => navigation.navigate('AdminAddCourse', { course: item })}
                >
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteBtnSmall}
                    onPress={() => handleDeleteCourse(item.id)}
                >
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
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
        </View>
    );


    return (
        <View style={styles.container}>
            {/* Top Add Course Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AdminAddCourse')}
            >
                <Text style={styles.addButtonText}>+ Add Course</Text>
            </TouchableOpacity>

            {/* Course List */}
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

export default AdminCourses;

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

    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

    list: {
        paddingBottom: 30,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },

    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },

    actionButtons: {
        flexDirection: 'row',
        gap: 10,
    },



    text: {
        fontSize: 14,
        color: '#555',
        marginBottom: 12,
    },

    row: {
        flexDirection: 'row',
        marginBottom: 6,
    },

    label: {
        fontWeight: '600',
        width: 120,
        color: '#333',
    },

    value: {
        color: '#555',
    },

    editBtn: {
        backgroundColor: '#ff9500',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },



    deleteBtn: {
        backgroundColor: '#ff3b30',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },


    topicRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,              // takes available space
    },

    editBtnSmall: {
        backgroundColor: '#ff9500',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginLeft: 8,
    },

    deleteBtnSmall: {
        backgroundColor: '#ff3b30',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 6,
        marginLeft: 8,
    },

    editText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },

    deleteText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },

});
