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

const useRoleStore = create(
  devtools(
    persist(
      (set, get) => ({
        roles: [],
        error: null,

        fetchRoles: async () => {
          set({ error: null });
          const response = await apiService.get(apiRoutes.roles.getAll);
          const allRoles = extractValues(response);
          set({ roles: allRoles });
          return allRoles;
        },

        getRoleById: async (id) => {
          set({ error: null });
          const role = get().roles.find((r) => r.id === id);
          if (role) return role;

          const response = await apiService.get(apiRoutes.roles.getById(id));
          const newRole = extractValue(response);

          if (newRole && newRole.id) {
            set((state) => ({
              roles: [...state.roles, newRole],
            }));
          }
          return newRole;
        },

        getRoleWithClaims: async (id) => {
          set({ error: null });
          console.log("role claims");
          const response = await apiService.get(
            apiRoutes.roles.getRoleClaims(id)
          );
          return extractValue(response);
        },

        addRole: async (roleData) => {
          set({ error: null });
          const response = await apiService.post(apiRoutes.roles.add, roleData);
          const newRole = extractValue(response);
          console.log("newRole", newRole);

          set((state) => ({
            roles: [...state.roles, newRole],
          }));
          return newRole;
        },

        updateRole: async (roleData) => {
          set({ error: null });
          const response = await apiService.put(
            apiRoutes.roles.update,
            roleData
          );
          const updatedRole = extractValue(response);

          set((state) => ({
            roles: state.roles.map((role) =>
              role.id === roleData.id ? { ...role, ...updatedRole } : role
            ),
          }));
          return updatedRole;
        },

        updateRoleClaims: async (roleData) => {
          set({ error: null });
          const response = await apiService.put(
            apiRoutes.roles.updateRoleClaims,
            roleData
          );
          return extractValue(response);
        },

        deleteRole: async (id) => {
          set({ error: null });
          await apiService.delete(apiRoutes.roles.delete(id));

          set((state) => ({
            roles: state.roles.filter((r) => r.id !== id),
          }));
        },

        toggleRole: async (id) => {
          set({ error: null });
          const response = await apiService.put(apiRoutes.roles.toggle(id));
          const updatedRole = extractValue(response);

          set((state) => ({
            roles: state.roles.map((role) =>
              role.id === id ? { ...role, isDeleted: !role.isDeleted } : role
            ),
          }));
          return updatedRole;
        },

        resetRoleData: () =>
          set({
            roles: [],
            error: null,
          }),
      }),
      {
        name: "role-storage",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);

export default useRoleStore;
