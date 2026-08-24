import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text, Button, Input, Badge } from '@planity/ui';
import { useAuth } from '../../../application/providers';
import { editorialTheme as THEME } from '../../../application/theme/editorialTheme';
import { useStaffList, useCreateStaff, useUpdateStaff } from '../../../application/query/hooks';

export default function StaffScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const businessId = user?.providerProfile?.businessId ?? undefined;

  const staffQuery = useStaffList(businessId);
  const createStaff = useCreateStaff(businessId);
  const updateStaff = useUpdateStaff(businessId);

  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />
      <SafeAreaView style={styles.headerContainer} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>STAFF</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {staffQuery.isPending ? (
          <ActivityIndicator color={THEME.colors.primary} />
        ) : (staffQuery.data ?? []).length === 0 ? (
          <Text style={styles.hint}>No staff yet — add your first team member.</Text>
        ) : (
          (staffQuery.data ?? []).map((member) => (
            <View key={member.id} style={styles.row}>
              <Ionicons name="person-circle-outline" size={28} color={THEME.colors.outline} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                {member.roleTitle ? <Text style={styles.hint}>{member.roleTitle}</Text> : null}
              </View>
              <Badge label={member.isActive ? 'ACTIVE' : 'INACTIVE'} />
              <TouchableOpacity
                onPress={() =>
                  updateStaff.mutate({ staffId: member.id, isActive: !member.isActive })
                }
                accessibilityRole="button"
                accessibilityLabel={
                  member.isActive ? `Deactivate ${member.name}` : `Reactivate ${member.name}`
                }
              >
                <Ionicons
                  name={member.isActive ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={THEME.colors.outline}
                />
              </TouchableOpacity>
            </View>
          ))
        )}

        <View style={[styles.form]}>
          <Text style={[styles.sectionLabel, styles.gapTop]}>ADD TEAM MEMBER</Text>
          <Input label="NAME" value={name} onChangeText={setName} placeholder="Alex Martin" />
          <Input
            label="ROLE (OPTIONAL)"
            value={roleTitle}
            onChangeText={setRoleTitle}
            placeholder="Senior Stylist"
          />
          <Button
            title="ADD"
            variant="secondary"
            loading={createStaff.isPending}
            onPress={() => {
              if (!name.trim()) return;
              createStaff.mutate(
                { name: name.trim(), ...(roleTitle ? { roleTitle } : {}) },
                {
                  onSuccess: () => {
                    setName('');
                    setRoleTitle('');
                  },
                }
              );
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.surface },
  headerContainer: { backgroundColor: `${THEME.colors.surface}CC` },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  headerTitle: {
    fontSize: THEME.typography.label.fontSize,
    fontWeight: THEME.typography.label.fontWeight,
    letterSpacing: THEME.typography.label.letterSpacing,
    color: THEME.colors.onSurface,
  },
  content: { padding: THEME.spacing.lg, paddingBottom: THEME.spacing['3xl'] },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceContainerHighest,
  },
  memberInfo: { flex: 1 },
  memberName: { color: THEME.colors.onSurface, fontWeight: '600' },
  hint: { color: THEME.colors.onSurfaceVariant, fontSize: THEME.typography.caption.fontSize },
  form: { marginTop: THEME.spacing.md, gap: THEME.spacing.sm },
  sectionLabel: {
    fontSize: THEME.typography.caption.fontSize,
    letterSpacing: THEME.typography.caption.letterSpacing,
    color: THEME.colors.outline,
  },
  gapTop: { marginTop: THEME.spacing['2xl'], marginBottom: THEME.spacing.sm },
});
