import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { JobCard } from '../components/JobCard';
import { fetchJobs } from '../services/api';
import { saveBookmark, removeBookmark } from '../services/storage'
import { Job } from '../types/job';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface JobsScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export const JobsScreen: React.FC<JobsScreenProps> = ({ navigation }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadJobs = async (refresh: boolean = false) => {
    try {
      setError(null);
      if (!refresh) setLoading(true);
      const response = await fetchJobs();
      const validJobs = response.results.filter(job =>
        job &&
        job.job_role &&
        job.id &&
        job.company_name
      );
      setJobs(validJobs);

      if (validJobs.length === 0) {
        setError('No valid jobs available');
      }
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleBookmark = async (job: Job) => {
    const updatedJob = { ...job, is_bookmarked: !job.is_bookmarked };
    if (updatedJob.is_bookmarked) {
      await saveBookmark(updatedJob);
    } else {
      await removeBookmark(job.id);
    }
    setJobs(prevJobs =>
      prevJobs.map(j => j.id === job.id ? updatedJob : j)
    );
  };

  const renderItem = ({ item }: { item: Job }) => (
    <JobCard
      job={item}
      onPress={() => navigation.navigate('JobDetail', { job: item })}
      onBookmarkPress={() => handleBookmark(item)}
    />
  );

  return (
    <View style={styles.container}>
      {loading && !jobs.length ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      ) : error && !jobs.length ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderItem}
          keyExtractor={item => (item?.id ?? Math.random()).toString()}
          onRefresh={() => {
            setRefreshing(true);
            loadJobs(true);
          }}
          refreshing={refreshing}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: '#0066CC',
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  headerDecoration: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: 120,
    transform: [{ translateX: 60 }, { translateY: 60 }],
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
  listContent: {
    paddingVertical: 8,
  },
});
