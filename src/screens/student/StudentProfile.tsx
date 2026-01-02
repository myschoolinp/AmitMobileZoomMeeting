import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { getUser, saveUser } from '../../utils/storage';
import { doc, updateDoc, getFirestore } from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused } from '@react-navigation/native';

const StudentProfile = () => {
    const [message, updateMessage] = useState('');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState(''); // non-editable
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [dob, setDob] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    // Validation errors
    const [errors, setErrors] = useState<any>({});
    const [user, setUser] = useState<any>({});
    const isFocused = useIsFocused(); // detects when screen is focused

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            updateMessage('');
            if (user) {
                setName(user.name || '');
                setMobile(user.mobile || '');
                setEmail(user.email || '');
                setPassword(user.password || '');
                setAddress(user.address || '');
                setDob(user.dob)
            }
        };
        if (isFocused) {
            fetchUser();
        }
    }, [isFocused]);

    const validateFields = () => {
        const newErrors: any = {};

        if (!name.trim()) newErrors.name = 'Name is required';
        if (!mobile.trim()) newErrors.mobile = 'Mobile number is required';
        else if (!/^\d{10}$/.test(mobile)) newErrors.mobile = 'Mobile must be 10 digits';
        if (!address.trim()) newErrors.address = 'Address is required';
        // 🔐 Password validation ONLY if user is trying to change it
        if (password.trim().length > 0) {
            if (password.length < 6) {
                newErrors.password = 'Minimum 6 characters required';
            }

            if (!confirmPassword.trim()) {
                newErrors.confirmPassword = 'Confirm password is required';
            } else if (password !== confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async () => {
        if (!validateFields()) return;

        try {
            const db = getFirestore();
            const userRef = doc(db, "users", email);
            // Base update object
            const updateData: any = {
                name,
                mobile,
                address,
            };

            // 🔐 Only update password if user entered it
            if (password.trim().length > 0) {
                updateData.password = password;
            }
            await updateDoc(userRef, updateData);

            updateMessage('Your profile has been successfully updated!');

            // Update AsyncStorage without password
            await saveUser({ id: email.toLowerCase(), name, mobile, email, address, dob: dob, role: 'student' });


        } catch (error: any) {
            updateMessage('Error updating profile');
        }
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) setDob(selectedDate);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Profile</Text>
            {message ? <Text style={{ color: 'green', marginBottom: 10 }}>{message}</Text> : null}

            {/* Name */}
            <Text style={styles.label}>Name</Text>
            <TextInput
                style={[styles.input, errors.name && styles.errorInput]}
                value={name}
                onChangeText={setName}
                placeholder="Enter Name"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            {/* Mobile Number */}
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
                style={[styles.input, errors.mobile && styles.errorInput]}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Enter Mobile Number"
                keyboardType="phone-pad"
            />
            {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}

            {/* Email (non-editable) */}
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={[styles.input, { backgroundColor: '#e0e0e0' }]}
                value={email}
                editable={false}
            />



            {/* Address */}
            <Text style={styles.label}>Address</Text>
            <TextInput
                style={[styles.input, errors.address && styles.errorInput]}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter Address"
                multiline
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

            {/* DOB */}
            {/* <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
                style={[styles.input, { justifyContent: 'center' }, errors.dob && styles.errorInput]}
                onPress={() => setShowDatePicker(true)}
            >
                <Text>{dob.toDateString()}</Text>
            </TouchableOpacity>
            {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

            {showDatePicker && (
                <DateTimePicker
                    value={dob}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={onChangeDate}
                />
            )} */}
            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <TextInput
                style={[styles.input, errors.password && styles.errorInput]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter Password"
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
                style={[styles.input, errors.confirmPassword && styles.errorInput]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm Password"
            />
            {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

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

    errorText: {
        color: 'red',
        marginTop: 4,
    },

    errorInput: {
        borderColor: 'red',
    },
});

export default StudentProfile;
