import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@planity/ui';
import { useAuth, useFavorites } from '../../../application/providers';
import { useBottomNavInset } from '../../../application/components/BottomNav';
import { editorialTheme as THEME } from '../../../application/theme/editorialTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FavoriteItemProps {
  id: string;
  name: string;
  location: string;
  category: string;
  imageUrl: string;
  onPress: () => void;
  onRemove: () => void;
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({
  name,
  location,
  category,
  imageUrl,
  onPress,
  onRemove,
}) => (
  <View style={styles.itemContainer}>
    {/* Image Container */}
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        {/* Favorite Button */}
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={onRemove}
          activeOpacity={0.8}
        >
          <View style={styles.favoriteButtonInner}>
            <Ionicons name="heart" size={18} color={THEME.colors.primary} />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>

    {/* Info Section */}
    <View style={styles.infoContainer}>
      <View style={styles.infoLeft}>
        <Text style={styles.salonName}>{name}</Text>
        <Text style={styles.salonMeta}>
          {location} • {category}
        </Text>
      </View>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Text style={styles.viewDetails}>VIEW DETAILS</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Mock data for demonstration
const MOCK_FAVORITES = [
  {
    id: '1',
    name: 'Le Studio Noir',
    location: 'Paris',
    category: 'Hair & Aesthetic',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=450&fit=crop',
  },
  {
    id: '2',
    name: 'The Arch Gallery',
    location: 'London',
    category: 'Brows & Lash',
    imageUrl: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&h=450&fit=crop',
  },
  {
    id: '3',
    name: 'Ethereal Skin',
    location: 'New York',
    category: 'Clinical Facial',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=450&fit=crop',
  },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { favoriteItems, loading, toggleFavorite } = useFavorites();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  const handleRemoveFavorite = (businessId: string) => {
    toggleFavorite(businessId);
  };

  const displayItems = favoriteItems.length > 0 
    ? favoriteItems.map(item => ({
        id: item.businessId,
        name: item.businessName ?? 'Unknown Studio',
        location: 'Paris', // Would come from business data
        category: 'Hair & Beauty', // Would come from business data
        imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=450&fit=crop',
      }))
    : MOCK_FAVORITES; // Use mock data when no real favorites

  const bottomInset = useBottomNavInset();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.surface} />
      
      {/* Top App Bar */}
      <SafeAreaView style={styles.headerContainer} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={THEME.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ATELIER</Text>
          <TouchableOpacity 
            style={styles.headerAvatar}
            onPress={() => router.push('/(main)/profile')}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' }}
              style={styles.headerAvatarImage}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomInset }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Editorial Header */}
        <View style={styles.editorialHeader}>
          <Text style={styles.sectionLabel}>YOUR CURATED COLLECTION</Text>
          <Text style={styles.headline}>Favorites</Text>
          
          {/* Filter Chips */}
          <View style={styles.chipContainer}>
            <View style={styles.chipActive}>
              <Text style={styles.chipActiveText}>ALL SERVICES</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>RECENTLY ADDED</Text>
            </View>
          </View>
        </View>

        {/* Favorites List */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={THEME.colors.primary} />
          </View>
        ) : (
          <View style={styles.listContainer}>
            {displayItems.map((item) => (
              <FavoriteItem
                key={item.id}
                id={item.id}
                name={item.name}
                location={item.location}
                category={item.category}
                imageUrl={item.imageUrl}
                onPress={() => router.push(`/(main)/business/${item.id}`)}
                onRemove={() => handleRemoveFavorite(item.id)}
              />
            ))}
          </View>
        )}

        {/* Explore More Button */}
        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => router.push('/(main)/explore')}
          activeOpacity={0.8}
        >
          <Text style={styles.exploreButtonText}>EXPLORE MORE STUDIOS</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
  },
  headerContainer: {
    backgroundColor: `${THEME.colors.surface}CC`, // 80% opacity
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: THEME.typography.label.fontSize,
    fontWeight: THEME.typography.label.fontWeight,
    letterSpacing: THEME.typography.label.letterSpacing,
    color: THEME.colors.onSurface,
    textTransform: 'uppercase',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: `${THEME.colors.outline}33`, // 20% opacity
  },
  headerAvatarImage: {
    width: '100%',
    height: '100%',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: THEME.spacing.lg,
  },
  editorialHeader: {
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.xl,
  },
  sectionLabel: {
    fontSize: THEME.typography.caption.fontSize,
    fontWeight: THEME.typography.caption.fontWeight,
    letterSpacing: THEME.typography.caption.letterSpacing,
    color: THEME.colors.outline,
    textTransform: 'uppercase',
    marginBottom: THEME.spacing.sm,
  },
  headline: {
    fontSize: THEME.typography.display.fontSize,
    fontWeight: THEME.typography.display.fontWeight,
    letterSpacing: THEME.typography.display.letterSpacing,
    lineHeight: THEME.typography.display.lineHeight,
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.md,
  },
  chipContainer: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  chipActive: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs + 2,
    borderRadius: 9999,
  },
  chipActiveText: {
    fontSize: THEME.typography.caption.fontSize,
    fontWeight: THEME.typography.caption.fontWeight,
    letterSpacing: THEME.typography.caption.letterSpacing,
    color: THEME.colors.onPrimary,
    textTransform: 'uppercase',
  },
  chip: {
    backgroundColor: THEME.colors.surfaceContainerHigh,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs + 2,
    borderRadius: 9999,
  },
  chipText: {
    fontSize: THEME.typography.caption.fontSize,
    fontWeight: THEME.typography.caption.fontWeight,
    letterSpacing: THEME.typography.caption.letterSpacing,
    color: THEME.colors.onSurface,
    textTransform: 'uppercase',
  },
  listContainer: {
    gap: THEME.spacing['2xl'],
  },
  itemContainer: {
    marginBottom: THEME.spacing.xl,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: THEME.colors.surfaceContainerLow,
    marginBottom: THEME.spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: THEME.spacing.md,
    right: THEME.spacing.md,
    zIndex: 10,
  },
  favoriteButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${THEME.colors.surfaceContainerLowest}E6`, // 90% opacity
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  infoLeft: {
    flex: 1,
  },
  salonName: {
    fontSize: THEME.typography.title.fontSize,
    fontWeight: '600',
    letterSpacing: -0.01,
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.xs,
  },
  salonMeta: {
    fontSize: THEME.typography.body.fontSize - 2,
    fontWeight: '500',
    letterSpacing: 0.1,
    color: THEME.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  viewDetails: {
    fontSize: THEME.typography.label.fontSize - 1,
    fontWeight: '700',
    letterSpacing: 0.15,
    color: THEME.colors.primary,
    textTransform: 'uppercase',
    borderBottomWidth: 2,
    borderBottomColor: THEME.colors.primary,
    paddingBottom: 2,
  },
  exploreButton: {
    backgroundColor: THEME.colors.primary,
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: 9999,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: THEME.spacing['2xl'],
    marginBottom: THEME.spacing.xl,
  },
  exploreButtonText: {
    fontSize: THEME.typography.label.fontSize,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: THEME.colors.onPrimary,
    textTransform: 'uppercase',
  },
  center: {
    flex: 1,
    padding: THEME.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
});
