// App.tsx
import 'react-native-gesture-handler'; // MUST BE FIRST IMPORT
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import this
import './src/firebase/firebaseConfig';
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}> {/* Add this wrapper */}
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
