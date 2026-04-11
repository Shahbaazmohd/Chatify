import { create } from "zustand";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  
  checkAuth: async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://chatify-backend.onrender.com";
      // To actually check auth, you generally need an endpoint like /api/auth/me or similar.
      // We will default to false unless you have an endpoint setup.
      // Stub implementation:
      set({ authUser: null, isCheckingAuth: false });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null, isCheckingAuth: false });
    }
  },

  setAuthUser: (user) => set({ authUser: user }),
  logout: () => set({ authUser: null }),
}));
