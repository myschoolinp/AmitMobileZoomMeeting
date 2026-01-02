import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentProfile from '../screens/student/StudentProfile';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { clearUser } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import AdminHome from '../screens/admin/AdminHome';
import AdminBatches from '../screens/admin/AdminBatches';
import AdminCourses from '../screens/admin/adminCourses';
const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
    return (

        <Tab.Navigator
            screenOptions={{
                headerTitle: 'Amit Mobile & Training Center',
                headerTitleAlign: 'left',
                headerStyle: {
                    backgroundColor: '#007AFF', // Blue background
                },
                headerTitleStyle: {
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 18,
                },
                headerRight: () => {
                    const navigation: any = useNavigation();

                    const handleLogout = async () => {
                        // Clear user from AsyncStorage
                        await clearUser();

                        // Navigate to Login screen
                        navigation.replace('Login');
                    };

                    return (
                        <TouchableOpacity
                            style={{ marginRight: 15 }}
                            onPress={() =>
                                Alert.alert(
                                    'Logout',
                                    'Are you sure you want to logout?',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        { text: 'Yes', onPress: handleLogout },
                                    ]
                                )
                            }
                        >
                            <Text style={{ color: '#fff', fontSize: 16 }}>
                                Logout
                            </Text>
                        </TouchableOpacity>
                    );
                },
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                tabBarShowLabel: true,
                tabBarIconStyle: { marginBottom: -3 },
            }}
        >
            <Tab.Screen
                name="Home"
                component={AdminHome}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 18, color }}>🏠</Text>
                    ),
                }}

            />
            <Tab.Screen
                name="Batch"
                component={AdminBatches}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 18, color }}>👥</Text>
                    ),
                }}

            />
            <Tab.Screen
                name="Courses"
                component={AdminCourses}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 18, color }}>📚</Text>
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={StudentProfile}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Text style={{ fontSize: 18, color }}>👤</Text>
                    ),
                }}

            />
        </Tab.Navigator>
    );
};

export default AdminTabNavigator;
