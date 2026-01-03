import React, { createContext, useContext, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

type LoaderContextType = {
    showLoader: () => void;
    hideLoader: () => void;
};

const LoaderContext = createContext<LoaderContextType>({
    showLoader: () => { },
    hideLoader: () => { },
});

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return (
        <LoaderContext.Provider value={{ showLoader, hideLoader }}>
            {children}

            {loading && (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            )}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => useContext(LoaderContext);

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
});
