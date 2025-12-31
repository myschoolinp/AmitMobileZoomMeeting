import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentHome from '../screens/student/StudentHome';
import StudentBatch from '../screens/student/StudentBatch';
import StudentCourses from '../screens/student/StudentCourses';
import StudentProfile from '../screens/student/StudentProfile';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { clearUser } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
const Tab = createBottomTabNavigator();

const StudentTabNavigator = () => {
    return (

        <Tab.Navigator
            screenOptions={{
                headerTitle: 'Amit Technical Institute',
                headerTitleAlign: 'center',
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
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
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
                component={StudentHome}

            />
            <Tab.Screen
                name="Batch"
                component={StudentBatch}

            />
            <Tab.Screen
                name="Courses"
                component={StudentCourses}

            />
            <Tab.Screen
                name="Profile"
                component={StudentProfile}

            />
        </Tab.Navigator>
    );
};

export default StudentTabNavigator;
