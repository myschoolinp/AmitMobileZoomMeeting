import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';

const StudentProfile = () => {
    // Dummy initial data
    const [name, setName] = useState('John Doe');
    const [mobile, setMobile] = useState('1234567890');
    const [email] = useState('johndoe@example.com'); // non-editable
    const [password, setPassword] = useState('********');
    const [address, setAddress] = useState('123 Main St, City');

    const handleUpdate = () => {
        // You can integrate Firebase update here
        Alert.alert('Profile Updated', 'Your profile has been successfully updated!');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Profile</Text>

            {/* Name */}
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter Name"
            />

            {/* Mobile Number */}
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Enter Mobile Number"
                keyboardType="phone-pad"
            />

            {/* Email (non-editable) */}
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={[styles.input, { backgroundColor: '#e0e0e0' }]}
                value={email}
                editable={false}
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter Password"
            />

            {/* Address */}
            <Text style={styles.label}>Address</Text>
            <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter Address"
                multiline
            />

            {/* Update Button */}
            <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.updateText}>Update</Text>
            </TouchableOpacity>
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
        marginBottom: 20,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        marginTop: 10,
    },

    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },

    updateButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 10,
        marginTop: 30,
        alignItems: 'center',
    },

    updateText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default StudentProfile;
