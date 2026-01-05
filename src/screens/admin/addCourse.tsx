import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Switch,
} from 'react-native';
import { getFirestore, collection, addDoc, doc, updateDoc } from '@react-native-firebase/firestore';

const AdminAddCourse = ({ navigation, route }: any) => {
    const courseToEdit = route.params?.course; // course object if editing

    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [isAvailableInDesktop, setIsAvailableInDesktop] = useState(false);

    const db = getFirestore();

    // Prefill form if editing
    useEffect(() => {
        if (courseToEdit) {
            setCourseName(courseToEdit.courseName || '');
            setDescription(courseToEdit.description || '');
            setPrice(courseToEdit.price?.toString() || '');
            setDiscount(courseToEdit.discount?.toString() || '');
            setDuration(courseToEdit.duration || '');
            setNotes(courseToEdit.notes || '');
            setIsAvailableInDesktop(courseToEdit.isAvailableInDesktop || false);
        }
    }, [courseToEdit]);

    const handleSaveCourse = async () => {
        if (!courseName || !description || !price || !duration) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        try {
            if (courseToEdit) {
                // 🔄 Update existing course
                const courseRef = doc(db, 'courses', courseToEdit.id);
                await updateDoc(courseRef, {
                    courseName,
                    description,
                    price: parseFloat(price),
                    discount: discount ? parseFloat(discount) : 0,
                    duration,
                    isAvailableInDesktop,
                    notes: notes || '',
                });

                Alert.alert('Success', 'Course updated successfully');
            } else {
                // ➕ Add new course
                await addDoc(collection(db, 'courses'), {
                    courseName,
                    description,
                    price: parseFloat(price),
                    discount: discount ? parseFloat(discount) : 0,
                    duration,
                    isAvailableInDesktop,
                    notes: notes || '',
                    createdAt: Date.now(), // store internally as milliseconds
                });

                Alert.alert('Success', 'Course added successfully');
            }

            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
            <Text style={styles.label}>Course Name *</Text>
            <TextInput
                style={styles.input}
                value={courseName}
                onChangeText={setCourseName}
                placeholder="Enter course name"
            />

            <Text style={styles.label}>Description *</Text>
            <TextInput
                style={[styles.input, { height: 100 }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter course description"
                multiline
            />

            <Text style={styles.label}>Price (₹) *</Text>
            <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="Enter price"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Discount (%)</Text>
            <TextInput
                style={styles.input}
                value={discount}
                onChangeText={setDiscount}
                placeholder="Enter discount"
                keyboardType="numeric"
            />

            <Text style={styles.label}>Duration *</Text>
            <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="e.g., 3 months"
            />

            <Text style={styles.label}>Available in Desktop?</Text>
            <Switch
                value={isAvailableInDesktop}
                onValueChange={setIsAvailableInDesktop}
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Optional notes"
                multiline
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveCourse}>
                <Text style={styles.saveText}>{courseToEdit ? 'Update Course' : 'Save Course'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AdminAddCourse;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        padding: 16,
    },
    label: {
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#fff',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        marginTop: 24,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
