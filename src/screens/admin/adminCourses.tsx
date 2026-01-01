import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';

type Course = {
    id: string;
    name: string;
    description: string;
    duration: string;
    fee: string;
    batchSize: number;
    mode: string;
};

const courses: Course[] = [
    {
        id: '1',
        name: 'React Native Development',
        description: 'Learn to build mobile apps using React Native from scratch.',
        duration: '3 Months',
        fee: '₹12,000',
        batchSize: 25,
        mode: 'Online',
    },
    {
        id: '2',
        name: 'Full Stack Web Development',
        description: 'Frontend + Backend development using MERN stack.',
        duration: '6 Months',
        fee: '₹25,000',
        batchSize: 30,
        mode: 'Offline',
    },
    {
        id: '3',
        name: 'Java Programming',
        description: 'Core Java, OOPs, and advanced concepts.',
        duration: '2 Months',
        fee: '₹8,000',
        batchSize: 20,
        mode: 'Online',
    },
];

const AdminCourses = ({ navigation }: any) => {
    const renderCourseCard = ({ item }: { item: Course }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>

            <Text style={styles.text}>{item.description}</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Duration:</Text>
                <Text style={styles.value}>{item.duration}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Fee:</Text>
                <Text style={styles.value}>{item.fee}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Batch Size:</Text>
                <Text style={styles.value}>{item.batchSize}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Mode:</Text>
                <Text style={styles.value}>{item.mode}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Top Add Course Button */}
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddCourse')}
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

    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
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
        width: 100,
        color: '#333',
    },

    value: {
        color: '#555',
    },
});

export default AdminCourses;
