import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { getUser } from '../../utils/storage';
import { useIsFocused } from '@react-navigation/native';
import { getFirestore, doc, getDoc } from '@react-native-firebase/firestore';

const StudentHome = ({ navigation }: any) => {
    const [user, setUser] = useState<any>({});
    const [announcement, setAnnouncement] = useState<any>({});
    const [contact, setContact] = useState<any>({});
    const [loading, setLoading] = useState(true);

    const isFocused = useIsFocused();
    const db = getFirestore();
    useEffect(() => {
        const fetchUser = async () => {
            const storedUser = await getUser();
            if (storedUser) setUser(storedUser);
        };

        if (isFocused) {
            fetchUser();
        }
    }, [isFocused]);

    // Fetch announcement & contact
    useEffect(() => {
        const fetchSettings = async () => {
            const announcementSnap = await getDoc(doc(db, 'settings', 'announcement'));
            if (announcementSnap.exists()) {
                setAnnouncement(announcementSnap.data());
                setLoading(false);
            }

            const contactSnap = await getDoc(doc(db, 'settings', 'contact'));
            if (contactSnap.exists()) {
                setContact(contactSnap.data());
            }
        };
        fetchSettings();
    }, []);

    const navCards = [
        { name: 'Batch', icon: 'people-outline', color: '#28a745' },
        { name: 'Courses', icon: 'book-outline', color: '#007AFF' },
        { name: 'Profile', icon: 'person-outline', color: '#ff9500' },
    ];

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Welcome */}
            <Text style={styles.welcomeText}>Welcome {user.name}👋</Text>
            <Text style={styles.subText}>Glad to see you back!</Text>

            {/* Announcement */}
            <View style={styles.announcementCard}>
                <Text style={styles.announcementTitle}>📢 {announcement?.title || 'Announcement'}</Text>
                <Text style={styles.announcementText}>
                    {announcement?.message || 'No announcements yet'}
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
                <Text style={styles.sectionTitle}>📱 App Details</Text>
                <Text style={styles.infoText}>• Track your courses & batches</Text>
                <Text style={styles.infoText}>• Attend live meetings</Text>
                <Text style={styles.infoText}>• View announcements</Text>
                <Text style={styles.infoText}>• Update your profile</Text>
            </View>

            {/* Contact Details Section */}
            <View style={styles.contactCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.sectionTitle}>📞 Contact Details</Text>

                </View>

                {contact.name && (
                    <>
                        <Text style={styles.contactText}>{contact.name}</Text>
                        <Text style={styles.contactText}>{contact.line1}</Text>
                        <Text style={styles.contactText}>{contact.line2}</Text>
                        <Text style={styles.contactText}>{contact.cityState} - {contact.pincode}</Text>
                        <Text style={styles.contactText}>📱 Phone: {contact.phone}</Text>
                        <Text style={styles.contactText}>📧 Email: {contact.email}</Text>
                    </>
                )}
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
    infoText: {
        color: '#444',
        marginBottom: 4,
    },
    contactCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginTop: 20,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#007AFF',
    },
    contactText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
});

export default StudentHome;
