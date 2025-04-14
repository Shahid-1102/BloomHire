import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Image, Dimensions, Modal } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Job } from '../types/job';
import { saveBookmark, removeBookmark } from '../services/storage';
import type { RootStackParamList } from '../../App';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetail'>;

const isValidField = (value: string | undefined | null): boolean => {
  return Boolean(value && value.trim() !== '' && value !== '-');
};

const DetailItem: React.FC<{ icon: string; label: string; value: string | undefined | null }> = ({ icon, label, value }) => {
  const displayValue = isValidField(value) ? value : 'Not specified';
  const isValid = isValidField(value);

  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailIcon}>{icon}</Text>
      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, !isValid && styles.detailValueMissing]}>
          {displayValue}
        </Text>
      </View>
    </View>
  );
};

export const JobDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const [jobDetails, setJobDetails] = useState<Job>({ ...route.params.job });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleBookmark = async () => {
    try {
      if (jobDetails.is_bookmarked) {
        await removeBookmark(jobDetails.id);
        setJobDetails(prev => ({ ...prev, is_bookmarked: false }));
      } else {
        await saveBookmark(jobDetails);
        setJobDetails(prev => ({ ...prev, is_bookmarked: true }));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleContact = () => {
    if (jobDetails.whatsapp_no) {
      Linking.openURL(`tel:${jobDetails.whatsapp_no}`);
    }
  };

  const handleWhatsApp = () => {
    if (jobDetails.whatsapp_no) {
      Linking.openURL(`whatsapp://send?phone=${jobDetails.whatsapp_no}`);
    }
  };

  const handleEmail = () => {
    if (jobDetails.email) {
      Linking.openURL(`mailto:${jobDetails.email}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{jobDetails.job_role}</Text>
          <TouchableOpacity onPress={handleBookmark} style={styles.bookmarkButton}>
            <Text style={styles.bookmark}>
              {jobDetails.is_bookmarked ? '♥︎' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.companyContainer}>
          <Text style={styles.company}>{jobDetails.company_name}</Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{jobDetails.job_category}</Text>
          </View>
        </View>
      </View>

      {jobDetails.creatives && jobDetails.creatives.length > 0 && (
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            {jobDetails.creatives.map((creative, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(creative.file)}
              >
                <Image
                  source={{ uri: creative.file }}
                  style={styles.fullWidthImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          {jobDetails.creatives.length > 1 && (
            <View style={styles.imagePagination}>
              {jobDetails.creatives.map((_, index) => (
                <View
                  key={index}
                  style={[styles.paginationDot, index === 0 && styles.activeDot]}
                />
              ))}
            </View>
          )}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Key Details</Text>
        <DetailItem
          icon="📍"
          label="Location"
          value={jobDetails.primary_details?.Place}
        />
        <DetailItem
          icon="💰"
          label="Salary"
          value={jobDetails.primary_details?.Salary}
        />
        <DetailItem
          icon="🎯"
          label="Experience"
          value={jobDetails.primary_details?.Experience}
        />
        <DetailItem
          icon="🎓"
          label="Qualification"
          value={jobDetails.primary_details?.Qualification}
        />
      </View>

      {(jobDetails.other_details || jobDetails.email || jobDetails.eligibility) && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Additional Information</Text>
          {jobDetails.email && (
            <TouchableOpacity onPress={handleEmail} style={styles.emailContainer}>
              <Text style={styles.emailLabel}>📧 Email</Text>
              <Text style={styles.emailValue}>{jobDetails.email}</Text>
            </TouchableOpacity>
          )}
          {jobDetails.eligibility && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>✅ Eligibility Criteria</Text>
              <Text style={styles.infoValue}>{jobDetails.eligibility}</Text>
            </View>
          )}
          {jobDetails.other_details && (
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>ℹ️ Other Details</Text>
              <Text style={styles.infoValue}>{jobDetails.other_details}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.contactContainer}>
        <TouchableOpacity
          style={[styles.contactButton, styles.callButton]}
          onPress={handleContact}
        >
          <Text style={styles.contactButtonText}>📞 Call Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.contactButton, styles.whatsappButton]}
          onPress={handleWhatsApp}
        >
          <Text style={styles.contactButtonText}>💬 WhatsApp</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={!!selectedImage}
        transparent={true}
        onRequestClose={() => setSelectedImage(null)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setSelectedImage(null)}
        >
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.modalImage}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: '#A9A9A9',
    padding: 20,
    paddingTop: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    marginRight: 8,
  },
  bookmarkButton: {
    padding: 4,
  },
  bookmark: {
    fontSize: 28,
    color: '#FF0000',
  },
  companyContainer: {
    marginTop: 12,
  },
  company: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  categoryTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: 'white',
    fontSize: 14,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: 250,
    backgroundColor: '#000',
  },
  fullWidthImage: {
    width: SCREEN_WIDTH,
    height: 250,
  },
  imagePagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#2C3E50',
  },
  detailValueMissing: {
    color: '#95A5A6',
    fontStyle: 'italic',
  },
  emailContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  emailLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
  },
  emailValue: {
    fontSize: 16,
    color: '#0066CC',
    textDecorationLine: 'underline',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 15,
    color: '#34495E',
    lineHeight: 22,
  },
  contactContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
  },
  contactButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  callButton: {
    backgroundColor: '#0066CC',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  contactButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
});
