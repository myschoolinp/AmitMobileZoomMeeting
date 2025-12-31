import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StudentHome from '../screens/student/StudentHome';
import StudentBatch from '../screens/student/StudentBatch';
import StudentCourses from '../screens/student/StudentCourses';
import StudentProfile from '../screens/student/StudentProfile';

const Tab = createBottomTabNavigator();

const StudentTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerTitle: 'Amit Technical Institute', // Static header title
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: '#ff9500', // Blue background
                },
                headerTitleStyle: {
                    color: '#fff', // White text
                    fontWeight: 'bold',
                    fontSize: 18,
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
