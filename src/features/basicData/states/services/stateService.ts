// State API service
import { apiService } from "@/shared/services";
import { CreateStateRequest, State, StateQueryParams, UpdateStateRequest } from "../types/State";

const BASE_URL = "/api/states";

export const stateService = {
  // Get all states
  getStates: async (params?: StateQueryParams): Promise<State[]> => {
    const response = await apiService.get(BASE_URL, { params });
    return response.data;
  },

  // Get state by ID
  getStateById: async (id: number): Promise<State> => {
    const response = await apiService.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Create new state
  createState: async (data: CreateStateRequest): Promise<State> => {
    const response = await apiService.post(BASE_URL, data);
    return response.data;
  },

  // Update existing state
  updateState: async (data: UpdateStateRequest): Promise<State> => {
    const response = await apiService.put(`${BASE_URL}/${data.id}`, data);
    return response.data;
  },

  // Delete state
  deleteState: async (id: number): Promise<void> => {
    await apiService.delete(`${BASE_URL}/${id}`);
  },

  // Get states by country
  getStatesByCountry: async (countryId: number): Promise<State[]> => {
    const response = await apiService.get(`${BASE_URL}/by-country/${countryId}`);
    return response.data;
  },
};