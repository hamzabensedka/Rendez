import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface QuickAction {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  color: string;
  bgColor: string;
}

const actions: QuickAction[] = [
  {
    label: 'Add Appointment',
    icon: 'add-circle-outline',
    route: '/(dashboard)/appointments/new',
    color: '#3B82F6',
    bgColor: '#EFF6FF',
  },
  {
    label: 'Manage Schedule',
    icon: 'time-outline',
    route: '/(dashboard)/availability',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
  },
  {
    label: 'View Clients',
    icon: 'people-outline',
    route: '/(dashboard)/clients',
    color: '#10B981',
    bgColor: '#ECFDF5',
  },
  {
    label: 'Business Profile',
    icon: 'storefront-outline',
    route: '/(dashboard)/profile',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
  },
];

export function QuickActions() {
  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={index}
          style={styles.actionButton}
          onPress={() => router.push(action.route)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconWrapper, { backgroundColor: action.bgColor }]}>
            <Ionicons name={action.icon} size={22} color={action.color} />
          </View>
          <Text style={styles.actionLabel}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
});
