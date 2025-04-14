import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { JobCard } from '../components/JobCard';
import { getBookmarks, removeBookmark, getLastSyncTime } from '../services/storage';
import { Job } from '../types/job';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface BookmarksScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export const BookmarksScreen: React.FC<BookmarksScreenProps> = ({ navigation }) => {
  const [bookmarks, setBookmarks] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const loadBookmarks = useCallback(async () => {
    try {
      setError(null);
      const savedBookmarks = await getBookmarks();
      const syncTime = await getLastSyncTime();
      setBookmarks(savedBookmarks);
      setLastSync(syncTime);
    } catch (e) {
      setError('Failed to load bookmarks');
      console.error('Failed to load bookmarks:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadBookmarks();
  }, [loadBookmarks]);

  const handleBookmarkPress = async (job: Job) => {
    try {
      await removeBookmark(job.id);
      setBookmarks(prevBookmarks =>
        prevBookmarks.filter(bookmark => bookmark.id !== job.id)
      );
    } catch (e) {
      console.error('Failed to remove bookmark:', e);
      setError('Failed to remove bookmark');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadBookmarks);
    return unsubscribe;
  }, [navigation, loadBookmarks]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!bookmarks.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No bookmarked jobs yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {lastSync && (
        <Text style={styles.syncText}>
          Last updated: {new Date(lastSync).toLocaleString()}
        </Text>
      )}
      <FlatList
        data={bookmarks}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => navigation.navigate('JobDetail', { job: item })}
            onBookmarkPress={() => handleBookmarkPress(item)}
          />
        )}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
  },
  syncText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
});
