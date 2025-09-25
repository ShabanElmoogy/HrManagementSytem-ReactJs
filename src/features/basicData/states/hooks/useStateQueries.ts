// State TanStack Query hooks
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateStateRequest, State, StateQueryParams, UpdateStateRequest } from "../types/State";
import { stateService } from "../services/stateService";

// Query keys
export const stateQueryKeys = {
  all: ['states'] as const,
  lists: () => [...stateQueryKeys.all, 'list'] as const,
  list: (params?: StateQueryParams) => [...stateQueryKeys.lists(), params] as const,
  details: () => [...stateQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...stateQueryKeys.details(), id] as const,
  byCountry: (countryId: number) => [...stateQueryKeys.all, 'by-country', countryId] as const,
};

// Get all states
export const useStates = (params?: StateQueryParams) => {
  return useQuery({
    queryKey: stateQueryKeys.list(params),
    queryFn: () => stateService.getStates(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get state by ID
export const useState = (id: number) => {
  return useQuery({
    queryKey: stateQueryKeys.detail(id),
    queryFn: () => stateService.getStateById(id),
    enabled: !!id,
  });
};

// Get states by country
export const useStatesByCountry = (countryId: number) => {
  return useQuery({
    queryKey: stateQueryKeys.byCountry(countryId),
    queryFn: () => stateService.getStatesByCountry(countryId),
    enabled: !!countryId,
  });
};

// Create state mutation
export const useCreateState = (options?: {
  onSuccess?: (data: State) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStateRequest) => stateService.createState(data),
    onSuccess: (data) => {
      // Invalidate and refetch states
      queryClient.invalidateQueries({ queryKey: stateQueryKeys.all });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

// Update state mutation
export const useUpdateState = (options?: {
  onSuccess?: (data: State) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStateRequest) => stateService.updateState(data),
    onSuccess: (data) => {
      // Invalidate and refetch states
      queryClient.invalidateQueries({ queryKey: stateQueryKeys.all });
      // Update the specific state in cache
      queryClient.setQueryData(stateQueryKeys.detail(data.id), data);
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

// Delete state mutation
export const useDeleteState = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => stateService.deleteState(id),
    onSuccess: () => {
      // Invalidate and refetch states
      queryClient.invalidateQueries({ queryKey: stateQueryKeys.all });
      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
};