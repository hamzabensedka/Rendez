import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { providerTheme as T } from '../../../application/theme/providerTheme';

interface AroundMeButtonProps {
  onPress: () => void;
}

export const AroundMeButton = React.memo<AroundMeButtonProps>(function AroundMeButton({ onPress }) {
  return (
    <Pressable
      style={styles.row}
      onPress={onPress}
      accessibilityLabel="Search near me"
      accessibilityRole="button"
    >
      <View style={styles.textWrap}>
        <Text style={styles.title}>Near me</Text>
        <Text style={styles.sub}>Use current location</Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.colors.rule,
    backgroundColor: T.colors.paper,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontFamily: T.font.medium,
    fontSize: 16,
    color: T.colors.ink,
  },
  sub: {
    fontFamily: T.font.body,
    fontSize: 14,
    color: T.colors.muted,
    marginTop: 2,
  },
});
