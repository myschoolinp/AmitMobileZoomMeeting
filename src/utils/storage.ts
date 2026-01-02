import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'LOGGED_IN_USER';

// Save user
export const saveUser = async (user: any) => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Get user
export const getUser = async () => {
    const user = await AsyncStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

// Clear user (logout)
export const clearUser = async () => {
    await AsyncStorage.removeItem(USER_KEY);
};

export const simpleHash = (value: string) => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
};
