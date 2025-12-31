import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';

// Dummy subscribed courses data
const subscribedCourses = [
    {
        id: '1',
        courseName: 'React Native Beginner',
        startDate: '2025-02-01',
        time: '10:00 AM - 12:00 PM',
        instructor: 'John Doe',
    },
    {
        id: '2',
        courseName: 'Advanced JavaScript',
        startDate: '2025-02-05',
        time: '2:00 PM - 4:00 PM',
        instructor: 'Jane Smith',
    },
    {
        id: '3',
        courseName: 'UI/UX Design',
        startDate: '2025-02-10',
        time: '11:00 AM - 1:00 PM',
        instructor: 'Alice Brown',
    },
];

const StudentCourses = () => {
    const handleJoinMeeting = (courseName: string) => {
        Alert.alert('Join Meeting', `Joining meeting for ${courseName}`);
        // Here you can integrate real meeting link or navigation
    };

    const renderCourseCard = ({ item }: any) => (
        <View style={styles.card}>
            <Text style={styles.courseName}>{item.courseName}</Text>
            <Text style={styles.detail}>📅 Start Date: {item.startDate}</Text>
            <Text style={styles.detail}>⏰ Time: {item.time}</Text>
            <Text style={styles.detail}>👨‍🏫 Instructor: {item.instructor}</Text>

            <TouchableOpacity
                style={styles.joinButton}
                onPress={() => handleJoinMeeting(item.courseName)}
            >
                <Text style={styles.joinText}>Join Meeting</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Subscribed Courses</Text>

            <FlatList
                data={subscribedCourses}
                keyExtractor={(item) => item.id}
                renderItem={renderCourseCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f6fa',
        paddingBottom: 50,
    },

    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },

    listContainer: {
        paddingBottom: 20,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
        elevation: 3, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },

    courseName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },

    detail: {
        fontSize: 14,
        marginBottom: 4,
        color: '#555',
    },

    joinButton: {
        marginTop: 12,
        backgroundColor: '#28a745',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },

    joinText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default StudentCourses;
