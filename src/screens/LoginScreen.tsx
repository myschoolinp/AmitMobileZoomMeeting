import React, { useRef, useState } from 'react';
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
  StyleSheet,
  Keyboard,
  TouchableOpacity,
} from 'react-native';

import {
  collection,
  query,
  where,
  getFirestore,
  getDocs,
} from '@react-native-firebase/firestore';

import { saveUser, simpleHash } from '../utils/storage';
import { useLoader } from '../context/LoaderContext';

type Props = {
  navigation: any;
};

const LoginScreen = ({ navigation }: Props) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef<TextInput>(null);
  const { showLoader, hideLoader } = useLoader();

  const handleLogin = async () => {
    let isValid = true;

    setIdentifierError('');
    setPasswordError('');

    if (!identifier.trim()) {
      setIdentifierError('Email or mobile number is required');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!isValid) return;

    try {
      showLoader();
      Keyboard.dismiss();

      const db = getFirestore();
      const isEmail = identifier.includes('@');

      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where(isEmail ? 'email' : 'mobile', '==', identifier.trim())
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        Alert.alert('Invalid email/mobile or password');
        return;
      }

      const userDoc = snapshot.docs[0];
      const userData: any = userDoc.data();

      if (userData.password !== simpleHash(password)) {
        Alert.alert('Invalid email/mobile or password');
        return;
      }

      delete userData.password;
      await saveUser({ id: userDoc.id, ...userData });

      setIdentifier('');
      setPassword('');

      if (userData.role === 'admin') {
        navigation.replace('AdminDashboard');
      } else {
        navigation.replace('StudentDashboard');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      hideLoader();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Welcome Back</Text>

        <View style={styles.form}>
          {/* Email / Mobile */}
          <TextInput
            placeholder="Email or Mobile Number"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (identifierError) setIdentifierError('');
            }}
            style={[styles.input, identifierError && styles.errorInput]}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          {identifierError ? (
            <Text style={styles.errorText}>{identifierError}</Text>
          ) : null}

          {/* Password with SHOW / HIDE */}
          <View style={[styles.passwordContainer, passwordError && styles.errorInput]}>
            <TextInput
              ref={passwordRef}
              placeholder="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showText}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <Button title="Login" onPress={handleLogin} />

          <Text
            style={styles.registerText}
            onPress={() => navigation.navigate('Register')}
          >
            Don’t have an account? Register here
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 150,
  },

  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  form: {
    width: '100%',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },

  showText: {
    color: '#007AFF',
    fontWeight: '600',
    paddingLeft: 10,
  },

  errorInput: {
    borderColor: 'red',
  },

  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },

  registerText: {
    marginTop: 25,
    color: '#007AFF',
    textAlign: 'center',
  },
});
