import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TAGS = [
  'Salon de coiffure Toulouse',
  'Coiffure femme Toulouse',
  'Prothésiste ongulaire Toulouse',
  'Extension de cils Toulouse',
  'Soin du visage Toulouse',
  'Lissage et défrisage Toulouse',
  'Épilation Toulouse',
  'Microblading Toulouse',
  'Coiffure homme Toulouse',
];

const STAFF = [
  { id: '1', name: 'Beauté du regard', initials: 'B', image: null },
  { id: '2', name: 'Sophia', initials: null, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100' },
  { id: '3', name: 'Sophia B StyleHair', initials: 'SB', image: null },
  { id: '4', name: 'Onglerie', initials: 'O', image: null },
];

const OPENING_HOURS = [
  { day: 'Lundi', hours: '11:00 - 19:00' },
  { day: 'Mardi', hours: '11:00 - 19:00' },
  { day: 'Mercredi', hours: '11:00 - 18:00' },
  { day: 'Jeudi', hours: '11:00 - 19:00' },
  { day: 'Vendredi', hours: '11:00 - 19:00' },
  { day: 'Samedi', hours: '09:00 - 18:00' },
  { day: 'Dimanche', hours: 'Fermé' },
];

export const SalonAbout = React.memo(function SalonAbout() {
  return (
    <View style={styles.container}>
      {/* Location Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Où se situe le salon ?</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={20} color="#000" />
          <Text style={styles.addressText}>13 rue de Bayard , 31000 Toulouse</Text>
        </View>
        <View style={styles.mapContainer}>
          {/* Mock Map Background - Using a simple colored view to represent map area */}
          <View style={styles.mapBackground} />
          <TouchableOpacity style={styles.mapButton}>
            <Ionicons name="map-outline" size={16} color="#FFFFFF" style={{marginRight: 8}} />
            <Text style={styles.mapButtonText}>Afficher la carte</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Opening Hours Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Horaires d'ouverture</Text>
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

      {/* Staff Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Collaborateurs</Text>
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

      {/* Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À-propos</Text>
        <Text style={styles.descriptionText}>
          Situé à Toulouse, vous cherchez un instant de douceur et de bien-être, rendez-vous sans attendre au numéro 13, Rue de Bayard. Là vous attend le centre d'esthétique Sophia B et des soins apte à contenter tous vos besoins...
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Tags Section */}
      <View style={[styles.section, styles.lastSection]}>
        <Text style={styles.sectionTitle}>Dans cet établissement</Text>
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
