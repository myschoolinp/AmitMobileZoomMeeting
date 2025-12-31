import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';

type Props = {
  navigation: any;
};
const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');




  const handleLogin = async () => {
    let isValid = true;

    // Reset errors
    setEmailError('');
    setPasswordError('');

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setEmailError('Enter a valid email address');
        isValid = false;
      }
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (!isValid) return;

    try {
      // Clear fields after success
      setEmail('');
      setPassword('');

      if (email === 'admin@gmail.com') {
        navigation.navigate('AdminDashboard');
      } else {
        navigation.navigate('StudentDashboard');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };




  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          paddingBottom: 250
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <Image
          source={require('../assets/logo.png')}
          style={{ width: 200, height: 200, marginBottom: 10 }}
          resizeMode="contain"
        />

        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
          Welcome Back
        </Text>

        {/* Form */}
        <View style={{ width: '100%' }}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            style={[
              styles.input,
              emailError ? styles.errorInput : null,
            ]}
          />

          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}


          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
            }}
            secureTextEntry
            style={[
              styles.input,
              passwordError ? styles.errorInput : null,
            ]}
          />

          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}



          <Button title="Login" onPress={handleLogin} />

          <Text
            style={{ marginTop: 25, color: '#007AFF', textAlign: 'center' }}
            onPress={() => navigation.navigate('Register')}
          >
            Don’t have an account? Register here
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );

};
const styles = StyleSheet.create({
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

export default LoginScreen;
