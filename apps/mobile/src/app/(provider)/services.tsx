import { View, FlatList, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import type { Service } from '@/types';

export default function ServicesScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['provider', 'services', user?.id],
    queryFn: () => api.get('/provider/services').then((r) => r.data),
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: (service: Partial<Service>) =>
      api.put(`/provider/services/${service.id}`, service),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'services'] });
      setEditingService(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/provider/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provider', 'services'] });
    },
  });

  const handleEdit = useCallback((service: Service) => {
    setEditingService(service);
    setName(service.name);
    setDuration(String(service.duration));
    setPrice(String(service.price));
  }, []);

  const handleSave = useCallback(() => {
    if (!editingService) return;
    updateMutation.mutate({
      id: editingService.id,
      name,
      duration: parseInt(duration, 10),
      price: parseFloat(price),
    });
  }, [editingService, name, duration, price, updateMutation]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Delete Service', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(id),
        },
      ]);
    },
    [deleteMutation]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Service; index: number }) => (
      <Animated.View entering={SlideInRight.delay(index * 100)}>
        <Card className="p-4 mb-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-semibold text-foreground">{item.name}</Text>
              <Text className="text-sm text-muted-foreground mt-1">
                {item.duration} min · ${item.price}
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Button
                variant="ghost"
                size="sm"
                onPress={() => handleEdit(item)}
              >
                <Ionicons name="pencil" size={18} className="text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  className="text-destructive"
                />
              </Button>
            </View>
          </View>
        </Card>
      </Animated.View>
    ),
    [handleEdit, handleDelete]
  );

  if (editingService) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 p-4">
          <View className="flex-row items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onPress={() => setEditingService(null)}
            >
              <Ionicons
                name="arrow-back"
                size={24}
                className="text-foreground"
              />
            </Button>
            <Text className="text-xl font-bold text-foreground ml-2">
              Edit Service
            </Text>
          </View>

          <Animated.View entering={SlideInRight} className="gap-4">
            <View>
              <Text className="text-sm font-medium text-foreground mb-2">
                Service Name
              </Text>
              <Input
                value={name}
                onChangeText={setName}
                placeholder="e.g. Haircut"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-foreground mb-2">
                Duration (minutes)
              </Text>
              <Input
                value={duration}
                onChangeText={setDuration}
                placeholder="30"
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-foreground mb-2">
                Price ($)
              </Text>
              <Input
                value={price}
                onChangeText={setPrice}
                placeholder="25.00"
                keyboardType="decimal-pad"
              />
            </View>

            <View className="flex-row gap-3 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => setEditingService(null)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onPress={handleSave}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-4">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-foreground">Services</Text>
          <Button
            size="sm"
            onPress={() => {
              // Navigate to add service
            }}
          >
            <Ionicons
              name="add"
              size={18}
              className="text-primary-foreground mr-1"
            />
            Add New
          </Button>
        </View>

        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-muted-foreground">Loading services...</Text>
          </View>
        ) : (
          <FlatList
            data={services}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="items-center justify-center py-12">
                <Ionicons
                  name="cut-outline"
                  size={48}
                  className="text-muted-foreground"
                />
                <Text className="text-muted-foreground mt-2">
                  No services yet
                </Text>
                <Button className="mt-4">Add Your First Service</Button>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
