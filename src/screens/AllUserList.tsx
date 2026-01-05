import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { getFirestore, collection, onSnapshot } from '@react-native-firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const AllUsersList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirestore();

    const unsub = onSnapshot(collection(db, 'users'), snapshot => {
      const list = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const formatDate = (dateField: any) => {
    if (!dateField) return 'N/A';

    // Firestore Timestamp
    if (dateField instanceof Timestamp) return dateField.toDate().toDateString();

    // Number (milliseconds)
    if (typeof dateField === 'number') {
      return new Date(dateField).toDateString();
    }

    // JS Date
    if (dateField instanceof Date) return dateField.toDateString();

    // If it’s a Firestore-like object with _seconds
    if (dateField._seconds) return new Date(dateField._seconds * 1000).toDateString();

    // fallback
    return dateField.toString();
  };


  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text>📧 {item.email}</Text>
      <Text>📱 {item.mobile}</Text>
      <Text>🕒 Registered On: {formatDate(item.createdAt)}</Text>
      {item.subscribedBatches && (
        <Text>👥 Subscribed Batches: {Object.keys(item.subscribedBatches).length}</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            No users registered yet
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

export default AllUsersList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
