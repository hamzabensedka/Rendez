import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { providerTheme as T } from '../providerTheme';

interface StatusPillProps {
  label: string;
  tone?: 'neutral' | 'done' | 'late';
}

export function StatusPill({ label, tone = 'neutral' }: StatusPillProps) {
  return (
    <View
      style={[
        styles.pill,
        tone === 'done' && styles.done,
        tone === 'late' && styles.late,
      ]}
    >
      <Text
        style={[
          styles.text,
          tone === 'done' && styles.doneText,
          tone === 'late' && styles.lateText,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

interface ChromeProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function ProviderChrome({ title, subtitle, actions }: ChromeProps) {
  return (
    <View style={styles.chrome}>
      <View style={styles.titleBlock}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

export function IconHit({
  children,
  onPress,
  label,
}: {
  children: React.ReactNode;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.iconHit, pressed && { opacity: 0.7 }]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chrome: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
    gap: 12,
  },
  titleBlock: { flex: 1, minWidth: 0 },
  title: {
    fontFamily: T.font.display,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
    color: T.colors.ink,
  },
  subtitle: {
    marginTop: 8,
    fontFamily: T.font.body,
    fontSize: 16,
    lineHeight: 24,
    color: T.colors.muted,
  },
  actions: { flexDirection: 'row', paddingTop: 6 },
  iconHit: {
    width: 40,
    height: 40,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
    borderRadius: T.radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: T.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: T.colors.rule,
  },
  done: {
    backgroundColor: 'rgba(63,107,74,0.12)',
    borderColor: 'transparent',
  },
  late: {
    backgroundColor: 'rgba(180,35,24,0.08)',
    borderColor: 'transparent',
  },
  text: {
    fontFamily: T.font.label,
    fontSize: 10,
    letterSpacing: 0.8,
    color: T.colors.muted,
    textTransform: 'uppercase',
  },
  doneText: { color: T.colors.success },
  lateText: { color: T.colors.now },
});
