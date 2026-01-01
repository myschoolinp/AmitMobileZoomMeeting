import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import StudentTabNavigator from './StudentTabNavigator';
import AuthLoading from '../screens/AuthLoading';
import AdminTabNavigator from './AdminTabNavigator';
import AdminAddBatch from '../screens/admin/AdminAddBatch';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLoading">
        <Stack.Screen name="AuthLoading" component={AuthLoading} />
        <Stack.Screen name="Login" component={LoginScreen} options={{
          title: 'Login',
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

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
