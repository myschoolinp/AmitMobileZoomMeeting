import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
} from 'react-native';

import {
    getFirestore,
    collection,
    onSnapshot,
} from '@react-native-firebase/firestore';

const BatchSubscribers = ({ route }: any) => {
    const { users, batchName } = route.params;


    const renderItem = ({ item }: any) => {
        const data = item.data();

        return (
            <View style={styles.card}>
                <Text style={styles.name}>{data?.name}</Text>
                <Text>📧 {data?.email}</Text>
                <Text>📱 {data?.mobile}</Text>
                <Text>
                    🕒 Subscribed:{' '}
                    {data?.subscribedOn?.toDate().toDateString()}
                </Text>
            </View>
        );
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Subscribers – {batchName}
            </Text>

            <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={
                    <Text style={styles.empty}>No users subscribed</Text>
                }
            />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f6fa',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
        marginBottom: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    empty: {
        textAlign: 'center',
        marginTop: 30,
        color: '#777',
    },
});

export default BatchSubscribers;
