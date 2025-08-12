
# Countries Feature - TanStack Query Implementation

This feature has been migrated from Zustand to TanStack Query for better data management, caching, and user experience.

## Key Features

- **Automatic Caching**: Data is cached for 5 minutes with background refetching
- **Optimistic Updates**: UI updates immediately for better user experience
- **Error Handling**: Comprehensive error handling with retry logic
- **Loading States**: Granular loading states for different operations
- **Background Refetching**: Data stays fresh without user intervention

## Files Structure

```
src/features/basicData/countries/
├── hooks/
│   ├── useCountryQueries.js      # TanStack Query hooks
│   └── useCountryGridLogic.jsx   # Main logic hook
├── components/
│   ├── countriesMultiView.jsx    # Multi-view container
│   ├── countryDeleteDialog.jsx   # Delete confirmation dialog
│   └── countryForm.jsx           # Country form
├── store/
│   └── useCountryStore.js.backup # Old Zustand store (backup)
├── countriesPage.jsx             # Main page component
└── README.md                     # This file
```

## Usage

### Basic Query
```javascript
import { useCountries } from './hooks/useCountryQueries';

const { data: countries, isLoading, error, refetch } = useCountries();
```

### Mutations
```javascript
import { useCreateCountry, useUpdateCountry, useDeleteCountry } from './hooks/useCountryQueries';

const createMutation = useCreateCountry({
  onSuccess: (newCountry) => {
    console.log('Country created:', newCountry);
  }
});

// Usage
createMutation.mutate({ nameEn: 'New Country', code: 'NC' });
```

## Benefits

1. **Better Performance**: Automatic caching reduces API calls
2. **Better UX**: Optimistic updates and loading states
3. **Error Recovery**: Automatic retry with exponential backoff
4. **DevTools**: Excellent debugging with React Query DevTools
5. **Memory Management**: Automatic garbage collection

## Migration Notes

- Replaced Zustand store with TanStack Query hooks
- Added comprehensive error handling
- Improved loading states for better UX
- Added background refetching capabilities
- Maintained all existing functionality

## Configuration

The QueryClient is configured in `src/main.jsx` with:
- Stale time: 5 minutes
- Cache time: 10 minutes
- Retry: 1 attempt
- No refetch on window focus