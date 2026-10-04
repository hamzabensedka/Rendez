import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@planity/ui';
import { useAuth } from '../../../application/providers';
import { useBottomNavInset } from '../../../application/components/BottomNav';
import { useStaffList, useCreateStaff, useUpdateStaff } from '../../../application/query/hooks';
import { ProviderChrome } from '../components/ProviderChrome';
import { AtelierButton } from '../components/AtelierButton';
import { AtelierInput } from '../components/AtelierInput';
import { providerTheme as T } from '../providerTheme';

export default function StaffScreen() {
  const { user } = useAuth();
  const bottomInset = useBottomNavInset();
  const businessId = user?.providerProfile?.businessId ?? undefined;

  const staffQuery = useStaffList(businessId);
  const createStaff = useCreateStaff(businessId);
  const updateStaff = useUpdateStaff(businessId);

  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const activeCount = (staffQuery.data ?? []).filter((m) => m.isActive).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.colors.paper} />
      <SafeAreaView edges={['top', 'left', 'right']}>
        <ProviderChrome
          title="Team"
          subtitle={`${activeCount} on the floor`}
        />
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomInset + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {staffQuery.isPending ? (
          <ActivityIndicator color={T.colors.ink} />
        ) : (staffQuery.data ?? []).length === 0 ? (
          <Text style={styles.hint}>No one on the roster yet.</Text>
        ) : (
          (staffQuery.data ?? []).map((member) => (
            <View key={member.id} style={styles.row}>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.hint}>{member.roleTitle || 'Floor'}</Text>
              </View>
              <Pressable
                onPress={() =>
                  updateStaff.mutate({ staffId: member.id, isActive: !member.isActive })
                }
                accessibilityRole="button"
                accessibilityLabel={
                  member.isActive ? `Pause ${member.name}` : `Activate ${member.name}`
                }
              >
                <Text style={[styles.toggle, !member.isActive && styles.paused]}>
                  {member.isActive ? 'Active' : 'Paused'}
                </Text>
              </Pressable>
            </View>
          ))
        )}

        <View style={styles.form}>
          <Text style={styles.sectionLabel}>Add a person</Text>
          <AtelierInput label="Name" value={name} onChangeText={setName} placeholder="Alex Martin" />
          <AtelierInput
            label="Role"
            value={roleTitle}
            onChangeText={setRoleTitle}
            placeholder="Colourist"
          />
          <AtelierButton
            title="Add"
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
  container: { flex: 1, backgroundColor: T.colors.paper },
  content: { paddingHorizontal: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
  },
  memberInfo: { flex: 1 },
  memberName: {
    fontFamily: T.font.headline,
    fontSize: 20,
    color: T.colors.ink,
  },
  hint: {
    color: T.colors.muted,
    fontSize: 14,
    fontFamily: T.font.body,
    marginTop: 2,
  },
  toggle: {
    fontFamily: T.font.medium,
    fontSize: 14,
    color: T.colors.ink,
  },
  paused: { color: T.colors.muted },
  form: { marginTop: 40, gap: 16 },
  sectionLabel: {
    fontFamily: T.font.label,
    fontSize: T.type.label.fontSize,
    letterSpacing: T.type.label.letterSpacing,
    color: T.colors.muted,
    textTransform: 'uppercase',
  },
});
