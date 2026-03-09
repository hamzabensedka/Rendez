import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { colors } from '@planity/ui';
import { ScreenHeader, SearchInput, SearchList } from '../components';
import { useFrequentSearches } from '../hooks';
import { SEARCH_PLACEHOLDERS } from '../constants';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { searches, selectSearch } = useFrequentSearches();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.surface} />
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Search" leftIcon="close" />

        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={SEARCH_PLACEHOLDERS.BUSINESS}
          autoFocus
          showClearButton={false}
        />

        <SearchList
          data={searches}
          query={searchQuery}
          onSelect={selectSearch}
          getItemText={(item) => item}
          title="Recent searches"
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
});
