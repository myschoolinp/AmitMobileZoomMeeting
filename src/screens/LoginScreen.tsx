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
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { doc, setDoc, collection, query, where, getDoc, getFirestore, getDocs } from '@react-native-firebase/firestore';
import { saveUser, simpleHash } from '../utils/storage';
import { useLoader } from '../context/LoaderContext';

type Props = {
  navigation: any;
};
const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [identifier, setIdentifier] = useState(''); // email OR mobile
  const passwordRef = useRef<TextInput>(null);
  const { showLoader, hideLoader } = useLoader();




  const handleLogin = async () => {

    let isValid = true;
    setEmailError('');
    setPasswordError('');

    if (!identifier.trim()) {
      setEmailError('Email or mobile number is required');
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
      hideLoader(); // 🔥 always stop loader
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
          paddingBottom: 150
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
            placeholder="Email or Mobile Number"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (emailError) setEmailError('');
            }}
            style={[styles.input, emailError && styles.errorInput]}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            blurOnSubmit={false}
          />

          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}


          <TextInput
            ref={passwordRef}
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
            }}
            secureTextEntry
            style={[styles.input, passwordError && styles.errorInput]}
            returnKeyType="done"
            onSubmitEditing={handleLogin}   // 🔥 LOGIN ON ENTER
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
