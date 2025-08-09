import { apiRoutes } from "@/routes";
import { apiService } from "@/shared/services";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

// Helper function to extract value from API response
const extractValue = (response) => {
  // If response has a value property and it's successful, return the value
  if (response?.value && response?.isSuccess) {
    return response.value;
  }
  // If response has data property (fallback)
  if (response?.data) {
    return response.data;
  }
  // Otherwise return the response as-is
  return response;
};

// Helper function to extract array of values from API response
const extractValues = (response) => {
  const extracted = extractValue(response);
  // If it's an array of wrapped objects, extract values
  if (Array.isArray(extracted) && extracted[0]?.value) {
    return extracted.map((item) => extractValue(item));
  }
  return extracted;
};

const useStateStore = create(
  devtools(
    persist(
      (set, get) => ({
        states: [],
        error: null,

        fetchStates: async () => {
          set({ error: null });
          const response = await apiService.get(apiRoutes.states.getAll);
          const allStates = extractValues(response);
          set({ states: allStates });
          console.log("Fetched states:", allStates);
          return allStates;
        },

        getStateById: async (id) => {
          set({ error: null });
          const state = get().states.find((s) => s.id === id);
          if (state) return state;

          const response = await apiService.get(apiRoutes.states.getById(id));
          const newState = extractValue(response);

          if (newState && newState.id) {
            set((state) => ({
              states: [...state.states, newState],
            }));
          }
          return newState;
        },

        addState: async (stateData) => {
          set({ error: null });
          const response = await apiService.post(
            apiRoutes.states.add,
            stateData
          );
          const newState = extractValue(response);
          console.log("newState", newState);

          set((state) => ({
            states: [...state.states, newState],
          }));

          return newState;
        },

        updateState: async (stateData) => {
          set({ error: null });
          const response = await apiService.put(
            apiRoutes.states.update,
            stateData
          );
          const updatedState = extractValue(response);
          set((state) => ({
            states: state.states.map((stateItem) =>
              stateItem.id === stateData.id
                ? { ...stateItem, ...updatedState }
                : stateItem
            ),
          }));
          return updatedState;
        },

        deleteState: async (id) => {
          set({ error: null });
          await apiService.delete(apiRoutes.states.delete(id));

          set((state) => ({
            states: state.states.filter((s) => s.id !== id),
          }));
        },

        resetStateData: () =>
          set({
            states: [],
            error: null,
          }),
      }),
      {
        name: "state-storage",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useStateStore;
