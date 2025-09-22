import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { apiRoutes } from "@/routes";
import { apiService } from "@/shared/services";

// ============================================================================
// QUERY KEYS
// ============================================================================

export const countryKeys = {
  all: ['countries'],
  list: () => [...countryKeys.all, 'list'],
  detail: (id) => [...countryKeys.all, 'detail', id],
  search: (term) => [...countryKeys.all, 'search', term],
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

const extractValue = (response) => {
  if (response?.value && response?.isSuccess) return response.value;
  if (response?.data) return response.data;
  return response;
};

const extractValues = (response) => {
  const extracted = extractValue(response);
  if (Array.isArray(extracted) && extracted[0]?.value) {
    return extracted.map((item) => extractValue(item));
  }
  return extracted;
};

export const countryApi = {
  getAll: async () => {
    const response = await apiService.get(apiRoutes.countries.getAll);
    const countries = extractValues(response);
    return countries.filter((c) => !c.isDeleted);
  },

  getById: async (id) => {
    const response = await apiService.get(apiRoutes.countries.getById(id));
    return extractValue(response);
  },

  create: async (countryData) => {
    const response = await apiService.post(apiRoutes.countries.add, countryData);
    return extractValue(response);
  },

  update: async (countryData) => {
    const response = await apiService.put(apiRoutes.countries.update, countryData);
    return extractValue(response);
  },

  delete: async (id) => {
    await apiService.delete(apiRoutes.countries.delete(id));
    return id;
  },
};

// ============================================================================
// QUERY HOOKS
// ============================================================================

/**
 * Get all countries
 */
export const useCountries = (options = {}) => {
  return useQuery({
    queryKey: countryKeys.list(),
    queryFn: () => countryApi.getAll(),
    ...options,
  });
};

/**
 * Get single country by ID
 */
export const useCountry = (id, options = {}) => {
  return useQuery({
    queryKey: countryKeys.detail(id),
    queryFn: () => countryApi.getById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Search countries with TanStack Query
 */
export const useCountrySearch = (searchTerm = '', options = {}) => {
  const { enabled = true, ...queryOptions } = options;
  const trimmedTerm = searchTerm.trim();
  const shouldSearch = enabled && trimmedTerm.length > 0;

  return useQuery({
    queryKey: countryKeys.search(trimmedTerm.toLowerCase()),
    queryFn: async () => {
      const allCountries = await countryApi.getAll();
      
      if (!trimmedTerm) return allCountries;

      const term = trimmedTerm.toLowerCase();
      return allCountries.filter(country => {
        return (
          country.nameEn?.toLowerCase().includes(term) ||
          country.nameAr?.includes(term) ||
          country.alpha2Code?.toLowerCase().includes(term) ||
          country.alpha3Code?.toLowerCase().includes(term) ||
          country.phoneCode?.toString().includes(term) ||
          country.currencyCode?.toLowerCase().includes(term)
        );
      });
    },
    enabled: shouldSearch,
    ...queryOptions,
  });
};

/**
 * Client-side search (no additional API calls)
 */
export const useCountrySearchOptimized = (searchTerm = '', existingCountries = []) => {
  return useMemo(() => {
    const trimmedTerm = searchTerm.trim();
    
    if (!trimmedTerm || !Array.isArray(existingCountries)) {
      return {
        data: existingCountries,
        isLoading: false,
        error: null,
        isSuccess: true,
      };
    }

    const term = trimmedTerm.toLowerCase();
    const filteredCountries = existingCountries.filter(country => {
      if (!country || country.isDeleted) return false;
      
      return (
        country.nameEn?.toLowerCase().includes(term) ||
        country.nameAr?.includes(term) ||
        country.alpha2Code?.toLowerCase().includes(term) ||
        country.alpha3Code?.toLowerCase().includes(term) ||
        country.phoneCode?.toString().includes(term) ||
        country.currencyCode?.toLowerCase().includes(term)
      );
    });

    return {
      data: filteredCountries,
      isLoading: false,
      error: null,
      isSuccess: true,
    };
  }, [searchTerm, existingCountries]);
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

/**
 * Create new country
 */
export const useCreateCountry = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: countryApi.create,
    onSuccess: (newCountry) => {
      // Refresh countries list
      queryClient.invalidateQueries({ queryKey: countryKeys.list() });
      
      // Add to cache
      queryClient.setQueryData(countryKeys.detail(newCountry.id), newCountry);
      
      // Call custom onSuccess
      options.onSuccess?.(newCountry);
    },
    ...options,
  });
};

/**
 * Update existing country
 */
export const useUpdateCountry = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: countryApi.update,
    onSuccess: (updatedCountry) => {
      // Update cache
      queryClient.setQueryData(countryKeys.detail(updatedCountry.id), updatedCountry);
      
      // Refresh lists
      queryClient.invalidateQueries({ queryKey: countryKeys.list() });
      
      // Call custom onSuccess
      options.onSuccess?.(updatedCountry);
    },
    ...options,
  });
};

/**
 * Delete country
 */
export const useDeleteCountry = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: countryApi.delete,
    onSuccess: (deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: countryKeys.detail(deletedId) });
      
      // Refresh lists
      queryClient.invalidateQueries({ queryKey: countryKeys.list() });
      
      // Call custom onSuccess
      options.onSuccess?.(deletedId);
    },
    ...options,
  });
};