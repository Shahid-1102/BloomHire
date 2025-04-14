import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Job } from '../types/job';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onBookmarkPress: () => void;
}

const isValidField = (value: string | undefined | null): boolean => {
  return Boolean(value && value.trim() !== '' && value !== '-');
};

const getFieldValue = (value: string | undefined | null, fallback: string): string => {
  return isValidField(value) ? String(value) : fallback;
};

const getRandomColor = () => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const JobCard: React.FC<JobCardProps> = ({ job, onPress, onBookmarkPress }) => {
  if (!job || !job.job_role || !job.company_name) {
    return null;
  }

  const location = getFieldValue(job.primary_details?.Place, 'Location not specified');
  const salary = getFieldValue(job.primary_details?.Salary, 'Salary not specified');
  const phone = getFieldValue(job.whatsapp_no, 'Contact not specified');
  const experience = getFieldValue(job.primary_details?.Experience, 'Experience not specified');
  const initials = job.company_name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {job.creatives && job.creatives[0]?.file ? (
            <Image 
              source={{ uri: job.creatives[0].file }} 
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.initialsContainer, { backgroundColor: getRandomColor() }]}>
              <Text style={styles.initials}>{initials}</Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.bookmarkButton} 
            onPress={onBookmarkPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.bookmarkIcon}>
              {job.is_bookmarked ? '♥︎' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {job.job_role}
          </Text>
          <Text style={styles.company} numberOfLines={1}>
            {job.company_name}
          </Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Text style={styles.detailText} numberOfLines={1}>
                📍 {location}
              </Text>
            </View>
            <View style={styles.detail}>
              <Text style={styles.detailText} numberOfLines={1}>
                💰 {salary}
              </Text>
            </View>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detail}>
              <Text style={styles.detailText} numberOfLines={1}>
                📞 {phone}
              </Text>
            </View>
            
          </View>

          
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 150,
    width: '100%',
    backgroundColor: '#F5F6FA',
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  initialsContainer: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 40,
    color: 'white',
    fontWeight: 'bold',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  bookmarkIcon: {
    fontSize: 24,
    color: '#FF0000',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detail: {
    flex: 1,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#34495E',
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  category: {
    fontSize: 12,
    color: '#0066CC',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
});
