import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView,KeyboardAvoidingView } from 'react-native';

const ScheduleMeetingScreen: React.FC = () => {
  const [batchName, setBatchName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [batchSize, setBatchSize] = useState('');
  const [duration, setDuration] = useState('');
  const [fee, setFee] = useState('');
  const [courseName, setCourseName] = useState('');

  const handleSchedule = () => {
    // Here you would typically send this data to your backend API
    Alert.alert('Meeting Scheduled', 
      `Batch: ${batchName}\nCourse: ${courseName}\nDate: ${date}\nTime: ${time}\nFee: $${fee}`);
    // Clear form or navigate back
  };

  return (
    <KeyboardAvoidingView>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Schedule New Meeting</Text>

      <TextInput style={styles.input} placeholder="Course Name" value={courseName} onChangeText={setCourseName} />
      <TextInput style={styles.input} placeholder="Batch Name/Code" value={batchName} onChangeText={setBatchName} />
      <TextInput style={styles.input} placeholder="Date (e.g., YYYY-MM-DD)" value={date} onChangeText={setDate} />
      <TextInput style={styles.input} placeholder="Time (e.g., HH:MM AM/PM)" value={time} onChangeText={setTime} />
      <TextInput style={styles.input} placeholder="Batch Size (Number)" value={batchSize} onChangeText={setBatchSize} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Duration (e.g., 60 mins)" value={duration} onChangeText={setDuration} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Fee ($)" value={fee} onChangeText={setFee} keyboardType="numeric" />

      <TouchableOpacity style={styles.button} onPress={handleSchedule}>
        <Text style={styles.buttonText}>Confirm Schedule</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F7FA',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E1E4E8',
  },
  button: {
    backgroundColor: '#28A745', // Green color for schedule action
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ScheduleMeetingScreen;
