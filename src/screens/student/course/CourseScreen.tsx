import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AllCourses from './AllCourses';
import MyCourses from './MyCourse';


const CourseScreen = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'joined'>('all');

    return (
        <View style={{ flex: 1 }}>
            {/* Top Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'all' && styles.activeTab]}
                    onPress={() => setActiveTab('all')}
                >
                    <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All Course</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'joined' && styles.activeTab]}
                    onPress={() => setActiveTab('joined')}
                >
                    <Text style={[styles.tabText, activeTab === 'joined' && styles.activeTabText]}>My Course</Text>
                </TouchableOpacity>
            </View>

            {/* Show selected tab */}
            {activeTab === 'all' ? <AllCourses /> : <MyCourses />}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: { flexDirection: 'row', margin: 16 },
    tab: { flex: 1, paddingVertical: 10, backgroundColor: '#ddd', borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
    activeTab: { backgroundColor: '#007AFF' },
    tabText: { color: '#333', fontWeight: '600' },
    activeTabText: { color: '#fff' },
});

export default CourseScreen;
