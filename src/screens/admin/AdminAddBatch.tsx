import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  Timestamp,
} from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
const AddBatchScreen = ({ navigation, route }: any) => {

  const batch = route?.params?.batch; // edit mode if exists
  const isEdit = !!batch;

  const db = getFirestore();

  const [topic, setTopic] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [zoomLink, setZoomLink] = useState('');
  const [batchSize, setBatchSize] = useState('');
  const [fee, setFee] = useState('');

  const [errors, setErrors] = useState<any>({});

  // Prefill on edit
  useEffect(() => {
    if (batch) {
      setTopic(batch.topic);
      if (batch.date instanceof Timestamp) {
        setDate(batch.date.toDate()); // ✅ convert once
      } else if (batch.date instanceof Date) {
        setDate(new Date(batch.date));
      } else if (typeof batch.date === 'string') {
        setDate(new Date(batch.date));
      }
      if (batch.time instanceof Timestamp) {
        setTime(batch.time.toDate());
      } else if (batch.time instanceof Date) {
        setTime(new Date(batch.time));
      } else if (typeof batch.time === 'string') {
        setTime(new Date(batch.time));
      }
      setDuration(batch.duration);
      setDescription(batch.description);
      setZoomLink(batch.zoomLink);
      setBatchSize(String(batch.batchSize));
      setFee(String(batch.fee));
    }
  }, []);

  // Validation
  const validate = () => {
    const e: any = {};
    if (!topic) e.topic = 'Topic required';
    if (!date) e.date = 'Date required';
    if (!time) e.time = 'Time required';
    if (!duration) e.duration = 'Duration required';
    if (!description) e.description = 'Description required';
    if (!zoomLink) e.zoomLink = 'Zoom link required';
    if (!batchSize || isNaN(Number(batchSize))) e.batchSize = 'Valid batch size required';
    if (!fee || isNaN(Number(fee))) e.fee = 'Valid fee required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Submit
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload = {
        topic,
        date,
        time,
        duration,
        description,
        zoomLink,
        batchSize: Number(batchSize),
        fee: Number(fee),
        updatedAt: Timestamp.now(),
      };

      if (isEdit) {
        await updateDoc(doc(db, 'batches', batch.id), payload);
        Alert.alert('Success', 'Batch updated successfully');
      } else {
        await addDoc(collection(db, 'batches'), {
          ...payload,
          createdAt: Timestamp.now(),
        });
        Alert.alert('Success', 'Batch added successfully');
      }

      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        {isEdit ? 'Update Batch' : 'Add Batch'}
      </Text>

      {renderInput('Topic', topic, setTopic, errors.topic)}
      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{date ? date.toDateString() : 'Select Date'}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          minimumDate={new Date()}
          onChange={(e, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Time</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowTimePicker(true)}
      >
        <Text>
          {time
            ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Select Time'}
        </Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          value={time || new Date()}
          mode="time"
          display="default"
          onChange={(e, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}
      {renderInput('Duration', duration, setDuration, errors.duration)}
      {renderInput('Description', description, setDescription, errors.description, true)}
      {renderInput('Zoom Meeting Link', zoomLink, setZoomLink, errors.zoomLink)}
      {renderInput('Batch Size', batchSize, setBatchSize, errors.batchSize, false, 'numeric')}
      {renderInput('Fee', fee, setFee, errors.fee, false, 'numeric')}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {isEdit ? 'Update Batch' : 'Create Batch'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
const renderInput = (
  label: string,
  value: string,
  onChange: (t: string) => void,
  error?: string,
  multiline = false,
  keyboardType: any = 'default'
) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.errorInput]}
      value={value}
      onChangeText={onChange}
      multiline={multiline}
      keyboardType={keyboardType}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f6fa',
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddBatchScreen;
