import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TAGS = [
  'Hair salon',
  'Women\'s hair',
  'Nails',
  'Lash extensions',
  'Facial',
  'Straightening',
  'Waxing',
  'Microblading',
  'Men\'s hair',
];

const STAFF = [
  { id: '1', name: 'Studio team', initials: 'ST', image: null },
  { id: '2', name: 'Alex', initials: null, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: '3', name: 'Jordan', initials: 'J', image: null },
  { id: '4', name: 'Nails', initials: 'N', image: null },
];

const OPENING_HOURS = [
  { day: 'Monday', hours: '11:00 - 19:00' },
  { day: 'Tuesday', hours: '11:00 - 19:00' },
  { day: 'Wednesday', hours: '11:00 - 18:00' },
  { day: 'Thursday', hours: '11:00 - 19:00' },
  { day: 'Friday', hours: '11:00 - 19:00' },
  { day: 'Saturday', hours: '09:00 - 18:00' },
  { day: 'Sunday', hours: 'Closed' },
];

export const SalonAbout = React.memo(function SalonAbout() {
  return (
    <View style={styles.container}>
      {/* Location */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={20} color="#000" />
          <Text style={styles.addressText}>13 Main Street, City Center</Text>
        </View>
        <View style={styles.mapContainer}>
          <View style={styles.mapBackground} />
          <TouchableOpacity style={styles.mapButton}>
            <Ionicons name="map-outline" size={16} color="#FFFFFF" style={{marginRight: 8}} />
            <Text style={styles.mapButtonText}>Show map</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Opening hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Opening hours</Text>
        <View style={styles.hoursList}>
          {OPENING_HOURS.map((item, index) => (
            <View key={index} style={styles.hourRow}>
              <Text style={styles.dayText}>{item.day}</Text>
              <Text style={styles.hoursText}>{item.hours}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      {/* Staff */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team</Text>
        <View style={styles.staffList}>
          {STAFF.map((member) => (
            <View key={member.id} style={styles.staffRow}>
              {member.image ? (
                <Image source={{ uri: member.image }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>{member.initials}</Text>
                </View>
              )}
              <Text style={styles.staffName}>{member.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.divider} />

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.descriptionText}>
          A welcoming space for hair and grooming services. Modern style with attention to detail. Book your appointment online.
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Tags */}
      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>Services at this location</Text>
        <View style={styles.tagsContainer}>
          {TAGS.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  section: {
    padding: 16,
  },
  lastSection: {
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
  },
  // Tags Styles
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
  // Staff Styles
  staffList: {
    gap: 16,
  },
  staffRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  staffName: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
  // Description Styles
  descriptionText: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  // Location Styles
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressText: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'Inter-Regular',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  mapContainer: {
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7', // Fallback color
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5F6FD', // Light blue map-like color
    // In a real app, use an Image component with a map static image here
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  mapButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  // Hours Styles
  hoursList: {
    gap: 16,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 15,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
  hoursText: {
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Inter-Regular',
  },
});
