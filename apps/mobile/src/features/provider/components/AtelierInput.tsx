import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { providerTheme as T } from '../providerTheme';

interface AtelierInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function AtelierInput({ label, value, onChangeText, placeholder }: AtelierInputProps) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={T.colors.muted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: {
    fontFamily: T.font.label,
    fontSize: T.type.label.fontSize,
    letterSpacing: T.type.label.letterSpacing,
    color: T.colors.muted,
    textTransform: 'uppercase',
  },
  input: {
    fontFamily: T.font.body,
    fontSize: 16,
    color: T.colors.ink,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
  },
});
