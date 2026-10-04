import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type TextInputProps,
} from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';

interface AtelierFieldProps extends Pick<
  TextInputProps,
  | 'secureTextEntry'
  | 'autoCapitalize'
  | 'autoComplete'
  | 'autoCorrect'
  | 'keyboardType'
  | 'maxLength'
  | 'editable'
> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  hideLabel?: boolean;
}

export function AtelierField({
  label,
  value,
  onChangeText,
  keyboardType,
  hideLabel,
  ...inputProps
}: AtelierFieldProps) {
  return (
    <View style={styles.wrap}>
      {hideLabel ? null : <Text style={styles.label}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor={T.colors.muted}
        keyboardType={keyboardType}
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8, marginBottom: 32 },
  label: {
    fontFamily: T.font.label,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.76,
    fontWeight: '600',
    color: T.colors.muted,
    textTransform: 'uppercase',
  },
  input: {
    fontFamily: T.font.body,
    fontSize: 16,
    lineHeight: 24,
    color: T.colors.ink,
    paddingVertical: 0,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: T.colors.rule,
  },
});
