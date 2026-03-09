# Search Feature

This feature handles search functionality for businesses and addresses in the Rendez mobile app.

## Architecture

The search feature follows a clean, component-based architecture:

```
search/
├── components/          # Reusable UI components
├── constants/          # Feature constants
├── hooks/              # Custom React hooks for business logic
├── pages/              # Screen components
├── services/           # API/service layer
├── types/              # TypeScript type definitions
└── utils/               # Utility functions
```

## Components

### `ScreenHeader`
Reusable header component with back button and title.

**Props:**
- `title: string` - Header title
- `onBack?: () => void` - Custom back handler
- `leftIcon?: string` - Icon name (default: 'chevron-back')
- `rightElement?: ReactNode` - Optional right side element

### `SearchInput`
Search input field with clear button and shadow styling.

**Props:**
- `value: string` - Input value
- `onChangeText: (text: string) => void` - Change handler
- `placeholder: string` - Placeholder text
- `showClearButton?: boolean` - Show clear button (default: true)
- `autoFocus?: boolean` - Auto focus on mount
- `maxLength?: number` - Maximum input length

### `HighlightedText`
Text component that highlights matching query text.

**Props:**
- `text: string` - Full text to display
- `query: string` - Search query to highlight
- `style?: TextStyle` - Text style
- `highlightedStyle?: TextStyle` - Style for highlighted text

### `SearchList`
Generic list component for displaying search results.

**Props:**
- `data: readonly T[]` - Array of items
- `query: string` - Search query
- `onSelect: (item: T) => void` - Selection handler
- `getItemText: (item: T) => string` - Text extractor
- `getItemKey?: (item: T, index: number) => string` - Key generator
- `title?: string` - Optional list title
- `emptyMessage?: string` - Message when list is empty

### `AddressSuggestionList`
Specialized list for address suggestions with highlighting.

**Props:**
- `suggestions: AddressSuggestion[]` - Address suggestions
- `query: string` - Search query
- `onSelect: (address: AddressSuggestion) => void` - Selection handler

### `AroundMeButton`
Button for using current location.

**Props:**
- `onPress: () => void` - Press handler

## Hooks

### `useAddressSearch`
Custom hook for address search functionality.

**Returns:**
- `query: string` - Current search query
- `setQuery: (query: string) => void` - Update query
- `suggestions: AddressSuggestion[]` - Filtered suggestions
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error state
- `selectAddress: (address: AddressSuggestion) => void` - Select handler

### `useFrequentSearches`
Custom hook for frequent searches.

**Returns:**
- `searches: readonly string[]` - List of frequent searches
- `selectSearch: (search: string) => void` - Selection handler

## Services

### `addressService`
Service layer for address-related operations.

**Functions:**
- `searchAddresses(params: SearchAddressParams): Promise<AddressSuggestion[]>` - Search addresses
- `getCurrentLocation(): Promise<{ lat: number; lng: number } | null>` - Get current location

## Performance Optimizations

- **React.memo**: All components are memoized to prevent unnecessary re-renders
- **useMemo**: Expensive computations are memoized
- **useCallback**: Event handlers are memoized
- **FlatList optimizations**: `removeClippedSubviews`, `maxToRenderPerBatch`, `windowSize`
- **Debouncing**: Address search is debounced (300ms) to reduce API calls

## Accessibility

All interactive components include:
- `accessibilityLabel` for screen readers
- `accessibilityRole` for semantic meaning
- `accessibilityHint` where helpful

## Future Improvements

1. **API Integration**: Replace mock data with real geocoding API
2. **Geolocation**: Implement `expo-location` for "Around Me" functionality
3. **Error Handling**: Add error boundaries and user-friendly error messages
4. **Loading States**: Add loading indicators during search
5. **Caching**: Implement search result caching
6. **Analytics**: Add search analytics tracking
