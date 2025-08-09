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

const useUserStore = create(
  devtools(
    persist(
      (set, get) => ({
        users: [],

        fetchUsers: async () => {
          const response = await apiService.get(apiRoutes.users.getAll);
          const allUsers = extractValues(response);
          set({ users: allUsers });
          return allUsers;
        },

        getUserById: async (id) => {
          const user = get().users.find((u) => u.id === id);
          if (user) return user;

          const response = await apiService.get(apiRoutes.users.getById(id));
          const newUser = extractValue(response);

          if (newUser && newUser.id) {
            set((state) => ({
              users: [...state.users, newUser],
            }));
          }
          return newUser;
        },

        addUser: async (userData) => {
          const response = await apiService.post(apiRoutes.users.add, userData);
          const newUser = extractValue(response);

          set((state) => ({
            users: [...state.users, newUser],
          }));
          return newUser;
        },

        updateUser: async (userData) => {
          const response = await apiService.put(
            apiRoutes.users.update(userData.id),
            userData
          );
          const updatedUser = extractValue(response);

          set((state) => ({
            users: state.users.map(
              (user) => (user.id === userData.id ? updatedUser : user) // Complete replacement
            ),
          }));
          console.log("Updated user:", updatedUser);
          return updatedUser;
        },

        toggleUser: async (id) => {
          await apiService.put(apiRoutes.users.toggle(id));

          // Update the user's isDisabled status by toggling it
          set((state) => ({
            users: state.users.map((u) => {
              if (u.id === id) {
                const newStatus = !u.isDisabled;
                return { ...u, isDisabled: newStatus };
              }
              return u;
            }),
          }));
        },
        // Fixed unLockUser method in useUserStore.js

        unLockUser: async (id) => {
          await apiService.put(apiRoutes.users.unlock(id));

          // Update the user's lock status (not disabled status)
          set((state) => ({
            users: state.users.map((user) =>
              user.id === id
                ? {
                    ...user,
                    isLocked: false, // ✅ Fixed: unlock sets isLocked to false
                  }
                : user
            ),
          }));
        },
        revokeToken: async (refreshToken) => {
          await apiService.put(apiRoutes.users.revoke(refreshToken));
        },

        resetUserData: () =>
          set({
            users: [],
            error: null,
          }),
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useUserStore;
