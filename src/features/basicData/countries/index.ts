// Export all country-related components and hooks

// Main page
export { default as CountriesPage } from './countriesPage';

// Components
export { default as CountriesMultiView } from './components/countriesMultiView';
export { default as CountryForm } from './components/countryForm';
export { default as CountryDeleteDialog } from './components/countryDeleteDialog';

// Services
export { default as CountryService } from './services/countryService';
export type { Country, CreateCountryRequest, UpdateCountryRequest } from './services/countryService';

// Hooks - TanStack Query
export { default as useCountryGridLogic } from './hooks/useCountryGridLogic';
export {
  useCountries,
  useCountry,
  useCountrySearch,
  useCountrySearchOptimized,
  useCreateCountry,
  useUpdateCountry,
  useDeleteCountry,
  usePrefetchCountry,
  useInvalidateCountries,
  useCountryCache,
  countryKeys,
} from './hooks/useCountryQueries';

// Types
export type {
  CountriesQueryOptions,
  CountryQueryOptions,
  CreateCountryMutationOptions,
  UpdateCountryMutationOptions,
  DeleteCountryMutationOptions,
} from './hooks/useCountryQueries';