import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

type AdminDashboardProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AdminDashboard'>;
};

// Example meeting data (replace with API data later)
const meetings = [
  {
    id: '1',
    title: 'Mobile Repair Workshop',
    date: '2025-01-10',
    time: '10:00 AM',
    organizer: 'Admin',
    description: 'Introduction to React Native basics',
  },
  {
    id: '2',
    title: 'Project Review',
    date: '2025-01-12',
    time: '2:00 PM',
    organizer: 'Admin',
    description: 'Review student projects and progress',
  },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigation }) => {
  const goToScheduleMeeting = () => {
    navigation.navigate('ScheduleMeeting');
  };
  const handleStartMeeting = (meeting: any) => {
    console.log('Start meeting:', meeting);
  
    // Example:
    // navigation.navigate('MeetingRoom', { meetingId: meeting.id });
  
    // Or open a meeting link
    // Linking.openURL(meeting.meetingUrl);
  };
  
  const renderMeetingCard = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardText}>📅 Date: {item.date}</Text>
      <Text style={styles.cardText}>⏰ Time: {item.time}</Text>
      <Text style={styles.cardText}>👤 Organizer: {item.organizer}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
  
      {/* Start Meeting Button */}
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => handleStartMeeting(item)}
      >
        <Text style={styles.startButtonText}>Start Meeting</Text>
      </TouchableOpacity>
    </View>
  );
  

  return (
    <View style={styles.container}>
      {/* Top Button */}
      <TouchableOpacity style={styles.button} onPress={goToScheduleMeeting}>
        <Text style={styles.buttonText}>Schedule Meeting</Text>
      </TouchableOpacity>

      {/* Meeting List */}
      <Text style={styles.sectionHeader}>Scheduled Meetings</Text>

      <FlatList
        data={meetings}
        keyExtractor={(item) => item.id}
        renderItem={renderMeetingCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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

  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  listContainer: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  cardText: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },

  cardDescription: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
  },
  startButton: {
    marginTop: 15,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
});

export default AdminDashboard;
