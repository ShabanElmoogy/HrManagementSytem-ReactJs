import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
export const useCountries = (options = {}) => {
  return useQuery({
    queryKey: countryKeys.list(),
    queryFn: CountryService.getAll,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useCountry = (id: string | number | null | undefined) => {
  return useQuery({
    queryKey: countryKeys.detail(id!),
    queryFn: () => CountryService.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCountrySearch = (
  searchTerm: string,
  existingCountries: Country[] = []
) => {
  return useMemo(() => {
    if (!searchTerm.trim()) return existingCountries;
    return CountryService.searchCountries(existingCountries, searchTerm);
  }, [searchTerm, existingCountries]);
};

// Mutation Hooks
export const useCreateCountry = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CountryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: countryKeys.all });
    },
    ...options,
  });
};

export const useUpdateCountry = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CountryService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: countryKeys.all });
    },
    ...options,
  });
};

export const useDeleteCountry = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CountryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: countryKeys.all });
    },
    ...options,
  });
};

// Utility Hook
export const useInvalidateCountries = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: countryKeys.all });
};
