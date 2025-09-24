import { useMutation, useQuery, useQueryClient, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { useMemo } from "react";
import CountryService from "../services/countryService";
import { Country } from "../types/Country";

// Query Keys
export const countryKeys = {
  all: ["countries"] as const,
  list: () => [...countryKeys.all, "list"] as const,
  detail: (id: string | number) => [...countryKeys.all, "detail", id] as const,
};

// Query Hooks
export const useCountries = (options?: UseQueryOptions<Country[], Error>) =>
  useQuery({
    queryKey: countryKeys.list(),
    queryFn: CountryService.getAll,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useCountry = (id: string | number | null | undefined, options?: UseQueryOptions<Country, Error>) =>
  useQuery({
    queryKey: countryKeys.detail(id!),
    queryFn: () => CountryService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });

export const useCountrySearch = (
  searchTerm: string,
  existingCountries: Country[] = []
) =>
  useMemo(() => {
    if (!searchTerm.trim()) return existingCountries;
    return CountryService.searchCountries(existingCountries, searchTerm);
  }, [searchTerm, existingCountries]);

// Generic Mutation Hook Factory
function useCountryMutation<TData = unknown, TVariables = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, Error, TVariables>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: countryKeys.all });
      if (options && typeof options.onSuccess === "function") {
        options.onSuccess(data, variables, context);
      }
    },
  });
}

export const useCreateCountry = (options?: UseMutationOptions<Country, Error, Partial<Country>>) =>
  useCountryMutation(CountryService.create, options);

export const useUpdateCountry = (options?: UseMutationOptions<Country, Error, Partial<Country>>) =>
  useCountryMutation(CountryService.update, options);

export const useDeleteCountry = (options?: UseMutationOptions<string | number, Error, string | number>) =>
  useCountryMutation<string | number, string | number>(CountryService.delete, options);

// Utility Hook
export const useInvalidateCountries = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: countryKeys.all });
};
