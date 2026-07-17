import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';

export default function ReceiptScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    url?: string;
    appointmentId?: string;
  }>();

  const receiptUrl = params.url ? decodeURIComponent(params.url) : null;
  const appointmentId = params.appointmentId || '';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Icons.chevronLeft size={24} color="#0f172a" />
          </Pressable>
          <Text style={styles.headerTitle}>Receipt</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Animated.View entering={FadeInDown.duration(400).springify()}>
          <Card>
            <CardHeader>
              <CardTitle>Payment Receipt</CardTitle>
            </CardHeader>
            <CardContent style={styles.receiptContent}>
              {receiptUrl ? (
                <>
                  <View style={styles.receiptPlaceholder}>
                    <Icons.receipt size={48} color="#6366f1" />
                    <Text style={styles.receiptPlaceholderText}>
                      Your receipt has been generated.
                    </Text>
                    <Text style={styles.receiptUrl} numberOfLines={2}>
                      {receiptUrl}
                    </Text>
                  </View>
                  <Separator style={styles.separator} />
                  <Button
                    variant="outline"
                    onPress={() => {
                      // In a real app, open the receipt URL in a browser or download
                      router.push('/(app)/appointments');
                    }}
                    style={styles.downloadButton}
                  >
                    <Icons.download size={18} color="#0f172a" />
                    <Text style={styles.downloadButtonText}>Download Receipt</Text>
                  </Button>
                </>
              ) : (
                <View style={styles.receiptPlaceholder}>
                  <Icons.fileText size={48} color="#94a3b8" />
                  <Text style={styles.noReceiptText}>
                    Receipt is not available at the moment.
                  </Text>
                  <Text style={styles.noReceiptSubtext}>
                    It will be sent to your email shortly.
                  </Text>
                </View>
              )}
            </CardContent>
          </Card>
        </Animated.View>

        <View style={styles.actions}>
          <Button onPress={() => router.replace('/(app)/appointments')} style={styles.actionButton}>
            <Icons.calendar size={18} color="#ffffff" />
            <Text style={styles.actionButtonText}>Go to Appointments</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSpacer: {
    width: 40,
  },
  receiptContent: {
    gap: 16,
  },
  receiptPlaceholder: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  receiptPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
  receiptUrl: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  noReceiptText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    textAlign: 'center',
  },
  noReceiptSubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 4,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  downloadButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366f1',
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
});
