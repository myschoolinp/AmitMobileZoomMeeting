import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import StudentTabNavigator from './StudentTabNavigator';
import AuthLoading from '../screens/AuthLoading';
import AdminTabNavigator from './AdminTabNavigator';
import AdminAddBatch from '../screens/admin/AdminAddBatch';
import BatchSubscribers from '../screens/admin/BatchSubscribers';
import AllUsersList from '../screens/AllUserList';
import AdminAddCourse from '../screens/admin/addCourse';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLoading">
        <Stack.Screen name="AuthLoading" component={AuthLoading} />
        <Stack.Screen name="Login" component={LoginScreen} options={{
          title: 'Login',
          headerShown: false,
          headerTitleAlign: 'center', // ✅ center horizontally
        }} />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Register' }}
        />
        <Stack.Screen
          name="AdminAddBatch"
          component={AdminAddBatch}
          options={{ title: 'Add Batch' }}
        />
        <Stack.Screen
          name="StudentDashboard"
          component={StudentTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BatchSubscribers"
          component={BatchSubscribers}
          options={{ title: 'Subscribed Users' }}
        />
        <Stack.Screen
          name="AllUserList"
          component={AllUsersList}
          options={{ title: 'All Registered Users' }}
        />
        <Stack.Screen
          name="AdminAddCourse"
          component={AdminAddCourse}
          options={{ title: 'Add New Course' }}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
