import { create } from "zustand";

const useAuthStore = create((set) => ({
  // User auth state
  auth: null,
  setAuth: (user) => set({ auth: user }),

  // Admin auth state
  admin: null,
  setAdmin: (adminUser) => set({ admin: adminUser }),

  // Helper function to clear auth (logout)
  clearAuth: () => set({ auth: null }),
  
  // Helper function to clear admin (admin logout)
  clearAdmin: () => set({ admin: null }),
}));

export default useAuthStore;

