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
export const useCreateCountry = (options: any = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: CountryService.create,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: countryKeys.all });
      if (typeof options.onSuccess === "function") {
        options.onSuccess(data, variables, context);
      }
    },
  });
};

export const useUpdateCountry = (options: any = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: CountryService.update,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: countryKeys.all });
      if (typeof options.onSuccess === "function") {
        options.onSuccess(data, variables, context);
      }
    },
  });
};

export const useDeleteCountry = (options: any = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: CountryService.delete,
    onSuccess: (data: any, variables: any, context: any) => {
      queryClient.invalidateQueries({ queryKey: countryKeys.all });
      if (typeof options.onSuccess === "function") {
        options.onSuccess(data, variables, context);
      }
    },
  });
};

// Utility Hook
export const useInvalidateCountries = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: countryKeys.all });
};
