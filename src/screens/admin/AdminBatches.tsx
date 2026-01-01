import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';

import {
  getFirestore,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from '@react-native-firebase/firestore';

import { Timestamp } from 'firebase/firestore';


const AdminBatchList = ({ navigation }: any) => {
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    const db = getFirestore();

    const unsub = onSnapshot(collection(db, 'batches'), snapshot => {
      const list = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBatches(list);
    });

    return () => unsub();
  }, []);

  const startMeeting = async (link: string) => {
    if (!link) {
      Alert.alert('Error', 'Zoom link not available');
      return;
    }

    const supported = await Linking.canOpenURL(link);
    if (supported) {
      Linking.openURL(link);
    } else {
      Alert.alert('Error', 'Invalid Zoom link');
    }
  };
  const db = getFirestore();

  const deleteBatch = async (id: string) => {
    Alert.alert('Delete Batch', 'Are you sure you want to delete this batch?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteDoc(doc(db, 'batches', id));
        },
      },
    ]);
  };

  const formatDate = (dateField: any) => {
    if (!dateField) return '';

    // Firestore Timestamp
    if (dateField instanceof Timestamp) {
      const dateCopy = dateField.toDate();
      return dateCopy.toDateString(); // or toLocaleDateString()
    }

    // Plain JS Date
    if (dateField instanceof Date) {
      const dateCopy = new Date(dateField.getTime()); // make a copy
      return dateCopy.toDateString();
    }

    // If it's a string (already formatted)
    if (typeof dateField === 'string') {
      return dateField;
    }

    // If it's a Firestore timestamp object but not instance
    if (dateField._seconds) {
      const dateCopy = new Date(dateField._seconds * 1000);
      return dateCopy.toDateString();
    }

    return ''; // fallback
  };


  const formatTime = (timeField: any) => {
    if (!timeField) return '';

    if (timeField instanceof Timestamp) {
      const timeCopy = timeField.toDate();
      return timeCopy.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (timeField instanceof Date) {
      const timeCopy = new Date(timeField.getTime());
      return timeCopy.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (typeof timeField === 'string') {
      return timeField;
    }

    if (timeField._seconds) {
      const timeCopy = new Date(timeField._seconds * 1000);
      return timeCopy.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return '';
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.topic}</Text>
      <Text>{item.description}</Text>

      {/* Row container for left & right sections */}
      <View style={styles.rowContainer}>
        {/* Left side - 3 texts */}
        <View style={styles.leftColumn}>
          <Text>📅 Date: {formatDate(item.date)}</Text>
          <Text>⏰ Time: {formatTime(item.time)}</Text>
          <Text>⏳ Duration: {item.duration}</Text>
        </View>

        {/* Right side - 2 texts */}
        <View style={styles.rightColumn}>
          <Text>👥 Batch Size: {item.batchSize}</Text>
          <Text>💰 Fee: ₹{item.fee}</Text>
        </View>
      </View>
      {/* Other buttons here */}


      <View style={styles.row}>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => startMeeting(item.zoomLink)}
        >
          <Text style={styles.btnText}>Start Meeting</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('AdminAddBatch', { batch: item })}
        >
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteBatch(item.id)}
        >
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ✅ Add New Batch Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AdminAddBatch')}
      >
        <Text style={styles.addText}>+ Add New Batch</Text>
      </TouchableOpacity>

      {/* Batch List */}
      <FlatList
        data={batches}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    padding: 16,
  },

  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },

  addText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  desc: {
    color: '#555',
    marginBottom: 6,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  startBtn: {
    backgroundColor: '#2D8CFF',
    padding: 8,
    borderRadius: 6,
  },

  editBtn: {
    backgroundColor: '#ff9500',
    padding: 8,
    borderRadius: 6,
  },

  deleteBtn: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 6,
  },

  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  rowRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',  // Push items to the right
    gap: 20,                     // Space between batch size and fee
    marginTop: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },

  leftColumn: {
    flex: 1,
    justifyContent: 'flex-start',
  },

  rightColumn: {
    flex: 1,
    alignItems: 'flex-start', // aligns text to right inside the right column
    justifyContent: 'flex-start',
  },

});

export default AdminBatchList;
