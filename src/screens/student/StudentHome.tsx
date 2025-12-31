import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

const StudentHome = ({ navigation }: any) => {
    const navCards = [
        { name: 'Courses', icon: 'book-outline', color: '#007AFF' },
        { name: 'Batch', icon: 'people-outline', color: '#28a745' },
        { name: 'Profile', icon: 'person-outline', color: '#ff9500' },
    ];
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Welcome */}
            <Text style={styles.welcomeText}>Welcome 👋</Text>
            <Text style={styles.subText}>Glad to see you back!</Text>

            {/* Announcement */}
            <View style={styles.announcementCard}>
                <Text style={styles.announcementTitle}>📢 Announcement</Text>
                <Text style={styles.announcementText}>
                    New courses have been added! Please check the Courses section and
                    complete your assignments on time.
                </Text>
            </View>

            {/* Quick Navigation */}
            <Text style={styles.sectionTitle}>Quick Access</Text>

            <View style={styles.cardRow}>
                {navCards.map((card, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.navCard, { backgroundColor: card.color }]}
                        onPress={() => navigation.navigate(card.name)}
                    >
                        <Text style={[styles.cardText, { color: '#fff' }]}>{card.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>


            {/* App Info */}
            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>📱 App Details</Text>
                <Text style={styles.infoText}>• Track your courses & batches</Text>
                <Text style={styles.infoText}>• Attend live meetings</Text>
                <Text style={styles.infoText}>• View announcements</Text>
                <Text style={styles.infoText}>• Update your profile</Text>
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f6fa',
    },

    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
    },

    subText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 20,
    },

    announcementCard: {
        backgroundColor: '#fff3cd',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },

    announcementTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },

    announcementText: {
        color: '#333',
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },

    navCard: {
        flex: 1,
        marginHorizontal: 5,
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    cardText: {
        marginTop: 8,
        fontWeight: '600',
    },

    infoCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginTop: 20,
    },

    infoTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
    },

    infoText: {
        color: '#444',
        marginBottom: 4,
    },
});

export default StudentHome;
