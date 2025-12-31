import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getUser } from '../utils/storage';

const AuthLoading = ({ navigation }: any) => {
    useEffect(() => {
        const checkUser = async () => {
            const user = await getUser();

            if (user) {
                if (user.role === 'admin') {
                    navigation.replace('AdminDashboard');
                } else {
                    navigation.replace('StudentDashboard');
                }
            } else {
                navigation.replace('Login');
            }
        };

        checkUser();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#007AFF" />
        </View>
    );
};

export default AuthLoading;
