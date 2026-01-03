import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal, TextInput, Button, Alert
} from 'react-native';
import { getUser } from '../../utils/storage';
import { useIsFocused } from '@react-navigation/native';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
} from '@react-native-firebase/firestore';
import { useLoader } from '../../context/LoaderContext';

const AdminHome = ({ navigation }: any) => {
    const [user, setUser] = useState<any>({});
    const isFocused = useIsFocused(); // detects when screen is focused
    const [announcement, setAnnouncement] = useState<any>({});
    const [contact, setContact] = useState<any>({});

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalField, setModalField] = useState('');
    const [modalType, setModalType] = useState<'announcement' | 'contact'>('announcement');
    const { showLoader, hideLoader } = useLoader();

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
            if (announcementSnap.exists()) setAnnouncement(announcementSnap.data());

            const contactSnap = await getDoc(doc(db, 'settings', 'contact'));
            if (contactSnap.exists()) setContact(contactSnap.data());
        };
        fetchSettings();
    }, []);
    const navCards = [
        { name: 'Batch', icon: 'people-outline', color: '#28a745' },
        { name: 'Courses', icon: 'book-outline', color: '#007AFF' },
        { name: 'Profile', icon: 'person-outline', color: '#ff9500' },
    ];
    const openModal = (type: 'announcement' | 'contact') => {
        setModalType(type);
        if (type === 'announcement') {
            setModalTitle('Edit Announcement');
            setModalField(announcement.message || '');
        } else {
            setModalTitle('Edit Contact');
            setModalField(
                contact
                    ? [
                        contact.name,
                        contact.line1,
                        contact.line2,
                        contact.cityState,
                        contact.pincode,
                        contact.phone,
                        contact.email,
                    ]
                        .filter(Boolean) // removes undefined/null
                        .join(',')
                    : ''
            );
        }
        setModalVisible(true);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Welcome */}
            <Text style={styles.welcomeText}>Welcome {user.name}👋</Text>
            <Text style={styles.subText}>Glad to see you back!</Text>

            {/* Announcement */}
            {/* <View style={styles.announcementCard}>
                <Text style={styles.announcementTitle}>📢 Announcement</Text>
                <Text style={styles.announcementText}>
                    New courses have been added! Please check the Courses section and
                    complete your assignments on time.
                </Text>
            </View> */}
            {/* Announcement */}
            <View style={styles.announcementCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.announcementTitle}>{announcement.title}</Text>
                    <TouchableOpacity onPress={() => openModal('announcement')}>
                        <Text style={{ fontSize: 18 }}>✏️</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.announcementText}>{announcement.message}</Text>
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
            {/* Contact Details Section */}
            <View style={styles.contactCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.sectionTitle}>📞 Contact Details</Text>
                    <TouchableOpacity onPress={() => openModal('contact')}>
                        <Text style={{ fontSize: 18 }}>✏️</Text>
                    </TouchableOpacity>
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

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: '90%',
                        backgroundColor: '#fff',
                        padding: 20,
                        borderRadius: 12
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                            {modalTitle}
                        </Text>
                        <TextInput
                            value={modalField}
                            onChangeText={setModalField}
                            multiline
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                padding: 10,
                                borderRadius: 6,
                                height: 100,
                                textAlignVertical: 'top'
                            }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 }}>
                            <Button title="Cancel" onPress={() => setModalVisible(false)} />
                            <View style={{ width: 10 }} />
                            <Button title="Save" onPress={async () => {
                                try {
                                    if (modalType === 'announcement') {
                                        await setDoc(doc(db, 'settings', 'announcement'), {
                                            title: '📢 Announcement',
                                            message: modalField
                                        });
                                        setAnnouncement({ title: '📢 Announcement', message: modalField });
                                    } else {
                                        const parts = modalField.split(',');
                                        if (parts.length < 6) { Alert.alert('Enter all contact fields separated by comma'); return; }
                                        const [name, line1, line2, cityState, pincode, phone, email] = parts;

                                        showLoader();
                                        await setDoc(doc(db, 'settings', 'contact'), {
                                            name, line1, line2, cityState, pincode, phone, email
                                        });


                                        setContact({ name, line1, line2, cityState, pincode, phone, email });
                                    }
                                    setModalVisible(false);
                                    hideLoader();
                                    Alert.alert('Success', 'Updated successfully');
                                } catch (err: any) {
                                    hideLoader();
                                    Alert.alert('Error', err.message);
                                }
                            }} />
                        </View>
                    </View>
                </View>
            </Modal>

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

    infoTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
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

export default AdminHome;
