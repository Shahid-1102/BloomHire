import AsyncStorage from '@react-native-async-storage/async-storage';
import { Job } from '../types/job';

const BOOKMARKS_KEY = '@joblist_bookmarks';
const LAST_SYNC_KEY = '@joblist_last_sync';

export const saveBookmark = async (job: Job): Promise<void> => {
  try {
    const bookmarks = await getBookmarks();
    // Ensure we don't add duplicates
    const existingIndex = bookmarks.findIndex(b => b.id === job.id);
    let updatedBookmarks;
    if (existingIndex >= 0) {
      // Update existing bookmark
      bookmarks[existingIndex] = { ...job, is_bookmarked: true };
      updatedBookmarks = [...bookmarks];
    } else {
      // Add new bookmark
      updatedBookmarks = [...bookmarks, { ...job, is_bookmarked: true }];
    }
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error saving bookmark:', error);
    throw error; // Propagate error to UI
  }
};

export const removeBookmark = async (jobId: number): Promise<void> => {
  try {
    const bookmarks = await getBookmarks();
    const updatedBookmarks = bookmarks.filter(job => job.id !== jobId);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updatedBookmarks));
    await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error; // Propagate error to UI
  }
};

export const getBookmarks = async (): Promise<Job[]> => {
  try {
    const bookmarksJson = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return bookmarksJson ? JSON.parse(bookmarksJson) : [];
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
};

export const isBookmarked = async (jobId: number): Promise<boolean> => {
  try {
    const bookmarks = await getBookmarks();
    return bookmarks.some(job => job.id === jobId);
  } catch (error) {
    console.error('Error checking bookmark status:', error);
    return false;
  }
};

export const getLastSyncTime = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(LAST_SYNC_KEY);
  } catch (error) {
    console.error('Error getting last sync time:', error);
    return null;
  }
};
