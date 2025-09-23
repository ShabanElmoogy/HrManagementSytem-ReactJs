# Countries Feature Migration Guide: Zustand → TanStack Query

This guide helps you migrate from the deprecated Zustand store to TanStack Query for better state management.

## 🚨 Important Notice

The `useCountryStore` Zustand store is **deprecated** and will be removed in a future version. Please migrate to TanStack Query hooks for better performance, caching, and developer experience.

## 📋 Migration Checklist

### 1. Update Imports

**Before (Zustand):**
```typescript
import useCountryStore from './store/useCountryStore';
```

**After (TanStack Query):**
```typescript
import {
  useCountries,
  useCountry,
  useCreateCountry,
  useUpdateCountry,
  useDeleteCountry,
  CountryService,
  type Country
} from './hooks/useCountryQueries';
```

### 2. Fetching All Countries

**Before (Zustand):**
```typescript
const { countries, fetchCountries, error } = useCountryStore();

useEffect(() => {
  fetchCountries();
}, [fetchCountries]);

if (error) {
  // Handle error manually
}
```

**After (TanStack Query):**
```typescript
const { 
  data: countries = [], 
  isLoading, 
  error, 
  refetch 
} = useCountries();

// No useEffect needed - data fetches automatically
// Loading and error states are built-in
```

### 3. Fetching Single Country

**Before (Zustand):**
```typescript
const { getCountryById } = useCountryStore();

const fetchCountry = async (id) => {
  const country = await getCountryById(id);
  // Handle manually
};
```

**After (TanStack Query):**
```typescript
const { 
  data: country, 
  isLoading, 
  error 
} = useCountry(countryId);

// Automatic caching and refetching
```

### 4. Creating Countries

**Before (Zustand):**
```typescript
const { addCountry } = useCountryStore();

const handleCreate = async (data) => {
  try {
    await addCountry(data);
    // Handle success manually
  } catch (error) {
    // Handle error manually
  }
};
```

**After (TanStack Query):**
```typescript
const createCountryMutation = useCreateCountry({
  onSuccess: (newCountry) => {
    console.log('Country created:', newCountry);
    // Automatic cache invalidation
  },
  onError: (error) => {
    console.error('Failed to create country:', error);
  }
});

const handleCreate = (data) => {
  createCountryMutation.mutate(data);
};

// Access loading state
const isCreating = createCountryMutation.isPending;
```

### 5. Updating Countries

**Before (Zustand):**
```typescript
const { updateCountry } = useCountryStore();

const handleUpdate = async (data) => {
  try {
    await updateCountry(data);
    // Handle success manually
  } catch (error) {
    // Handle error manually
  }
};
```

**After (TanStack Query):**
```typescript
const updateCountryMutation = useUpdateCountry({
  onSuccess: (updatedCountry) => {
    console.log('Country updated:', updatedCountry);
    // Automatic cache updates
  },
  onError: (error) => {
    console.error('Failed to update country:', error);
  }
});

const handleUpdate = (data) => {
  updateCountryMutation.mutate(data);
};
```

### 6. Deleting Countries

**Before (Zustand):**
```typescript
const { deleteCountry } = useCountryStore();

const handleDelete = async (id) => {
  try {
    await deleteCountry(id);
    // Handle success manually
  } catch (error) {
    // Handle error manually
  }
};
```

**After (TanStack Query):**
```typescript
const deleteCountryMutation = useDeleteCountry({
  onSuccess: (deletedId) => {
    console.log('Country deleted:', deletedId);
    // Automatic cache cleanup
  },
  onError: (error) => {
    console.error('Failed to delete country:', error);
  }
});

const handleDelete = (id) => {
  deleteCountryMutation.mutate(id);
};
```

### 7. Search Functionality

**Before (Manual filtering):**
```typescript
const { countries } = useCountryStore();
const [searchTerm, setSearchTerm] = useState('');

const filteredCountries = useMemo(() => {
  return countries.filter(country => 
    country.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [countries, searchTerm]);
```

**After (Optimized search):**
```typescript
const { data: countries = [] } = useCountries();
const [searchTerm, setSearchTerm] = useState('');

// Client-side search (no additional API calls)
const searchResult = useCountrySearchOptimized(searchTerm, countries);
const filteredCountries = searchResult.data;

// OR server-side search (with API calls)
const { data: searchResults } = useCountrySearch(searchTerm);
```

## 🎯 Benefits of TanStack Query

### 1. **Automatic Caching**
- Data is cached automatically
- Background refetching keeps data fresh
- Intelligent cache invalidation

### 2. **Built-in Loading States**
```typescript
const { data, isLoading, isFetching, isError } = useCountries();
```

### 3. **Error Handling**
```typescript
const { error, isError } = useCountries({
  retry: 3,
  retryDelay: 1000,
});
```

### 4. **Optimistic Updates**
```typescript
const updateMutation = useUpdateCountry({
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: countryKeys.list() });
    
    // Snapshot previous value
    const previousCountries = queryClient.getQueryData(countryKeys.list());
    
    // Optimistically update
    queryClient.setQueryData(countryKeys.list(), (old) => 
      old?.map(country => 
        country.id === newData.id ? { ...country, ...newData } : country
      )
    );
    
    return { previousCountries };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(countryKeys.list(), context?.previousCountries);
  },
});
```

### 5. **TypeScript Support**
- Full type safety
- IntelliSense support
- Compile-time error checking

## 🔧 Advanced Features

### Cache Management
```typescript
const { getCountries, setCountries } = useCountryCache();

// Get cached data
const cachedCountries = getCountries();

// Manually update cache
setCountries(newCountriesData);
```

### Prefetching
```typescript
const prefetchCountry = usePrefetchCountry();

// Prefetch country data on hover
const handleMouseEnter = (countryId) => {
  prefetchCountry(countryId);
};
```

### Cache Invalidation
```typescript
const invalidateCountries = useInvalidateCountries();

// Manually invalidate all country queries
const handleRefresh = () => {
  invalidateCountries();
};
```

## 📝 Complete Example

Here's a complete component migration example:

**Before (Zustand):**
```typescript
import React, { useEffect, useState } from 'react';
import useCountryStore from './store/useCountryStore';

const CountriesComponent = () => {
  const { 
    countries, 
    fetchCountries, 
    addCountry, 
    updateCountry, 
    deleteCountry,
    error 
  } = useCountryStore();
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCountries = async () => {
      setLoading(true);
      try {
        await fetchCountries();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCountries();
  }, [fetchCountries]);

  const handleCreate = async (data) => {
    setLoading(true);
    try {
      await addCountry(data);
      alert('Country created!');
    } catch (err) {
      alert('Failed to create country');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {countries.map(country => (
        <div key={country.id}>{country.nameEn}</div>
      ))}
    </div>
  );
};
```

**After (TanStack Query):**
```typescript
import React from 'react';
import { useCountries, useCreateCountry } from './hooks/useCountryQueries';

const CountriesComponent = () => {
  const { 
    data: countries = [], 
    isLoading, 
    error 
  } = useCountries();
  
  const createCountryMutation = useCreateCountry({
    onSuccess: () => alert('Country created!'),
    onError: () => alert('Failed to create country'),
  });

  const handleCreate = (data) => {
    createCountryMutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {countries.map(country => (
        <div key={country.id}>{country.nameEn}</div>
      ))}
      <button 
        onClick={() => handleCreate(newCountryData)}
        disabled={createCountryMutation.isPending}
      >
        {createCountryMutation.isPending ? 'Creating...' : 'Create Country'}
      </button>
    </div>
  );
};
```

## 🚀 Next Steps

1. **Update your components** one by one using this guide
2. **Test thoroughly** to ensure functionality remains the same
3. **Remove Zustand dependencies** once migration is complete
4. **Enjoy the benefits** of automatic caching, background updates, and better error handling!

## 📚 Additional Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [React Query Migration Guide](https://tanstack.com/query/latest/docs/react/guides/migrating-to-react-query-4)
- [TypeScript with TanStack Query](https://tanstack.com/query/latest/docs/react/typescript)

---

**Need help with migration?** Check the example components in the `components/` folder or refer to the TanStack Query documentation.