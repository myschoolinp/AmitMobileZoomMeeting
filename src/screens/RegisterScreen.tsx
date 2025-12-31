import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
const RegisterScreen = ({ navigation }: any) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        dob: '',
        address: '',
        password: '',
    });

    const [errors, setErrors] = useState<any>({});

    const handleChange = (key: string, value: string) => {
        setForm({ ...form, [key]: value });
        setErrors({ ...errors, [key]: '' });
    };

    const validate = () => {
        let valid = true;
        let newErrors: any = {};

        if (!form.name.trim()) {
            newErrors.name = 'Name is required';
            valid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email.trim()) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!emailRegex.test(form.email)) {
            newErrors.email = 'Invalid email';
            valid = false;
        }

        if (!form.mobile.trim()) {
            newErrors.mobile = 'Mobile number is required';
            valid = false;
        } else if (!/^\d{10}$/.test(form.mobile)) {
            newErrors.mobile = 'Enter valid 10-digit mobile number';
            valid = false;
        }

        if (!form.dob.trim()) {
            newErrors.dob = 'Date of birth is required';
            valid = false;
        }

        if (!form.address.trim()) {
            newErrors.address = 'Address is required';
            valid = false;
        }

        if (!form.password.trim()) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (form.password.length < 6) {
            newErrors.password = 'Minimum 6 characters required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleRegister = () => {
        if (!validate()) return;

        console.log('Registered user:', form);

        navigation.goBack(); // back to login
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <TextInput
                    placeholder="Full Name"
                    value={form.name}
                    onChangeText={(t) => handleChange('name', t)}
                    style={[styles.input, errors.name && styles.errorInput]}
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                <TextInput
                    placeholder="Email"
                    value={form.email}
                    onChangeText={(t) => handleChange('email', t)}
                    keyboardType="email-address"
                    style={[styles.input, errors.email && styles.errorInput]}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                <TextInput
                    placeholder="Mobile Number"
                    value={form.mobile}
                    onChangeText={(t) => handleChange('mobile', t)}
                    keyboardType="number-pad"
                    maxLength={10}
                    style={[styles.input, errors.mobile && styles.errorInput]}
                />
                {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}

                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <TextInput
                        placeholder="Date of Birth"
                        value={form.dob}
                        editable={false}
                        style={[styles.input, errors.dob && styles.errorInput]}
                    />
                </TouchableOpacity>

                {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}

                {showDatePicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        maximumDate={new Date()}
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) {
                                const formattedDate = selectedDate.toISOString().split('T')[0];
                                handleChange('dob', formattedDate);
                            }
                        }}
                    />
                )}


                <TextInput
                    placeholder="Address"
                    value={form.address}
                    onChangeText={(t) => handleChange('address', t)}
                    style={[styles.input, errors.address && styles.errorInput]}
                    multiline
                />
                {errors.address && (
                    <Text style={styles.errorText}>{errors.address}</Text>
                )}

                <TextInput
                    placeholder="Password"
                    value={form.password}
                    onChangeText={(t) => handleChange('password', t)}
                    secureTextEntry
                    style={[styles.input, errors.password && styles.errorInput]}
                />
                {errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <Button title="Register" onPress={handleRegister} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    errorInput: {
        borderColor: 'red',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
});

export default RegisterScreen;
