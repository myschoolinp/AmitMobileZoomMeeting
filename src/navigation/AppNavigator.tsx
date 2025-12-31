import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';
import StudentDashboard from '../screens/student/StudentDashboard';
import ScheduleMeetingScreen from '../screens/admin/ScheduleMeetingScreen';
import RegisterScreen from '../screens/RegisterScreen';
import StudentTabNavigator from './StudentTabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{
          title: 'Login',
          headerTitleAlign: 'center', // ✅ center horizontally
        }} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: true, title: 'Dashboard' }} />
        <Stack.Screen
          name="ScheduleMeeting"
          component={ScheduleMeetingScreen}
          options={{ headerShown: true, title: 'Schedule Meeting' }} // Register here
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Register' }}
        />
        <Stack.Screen
          name="StudentDashboard"
          component={StudentTabNavigator}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
