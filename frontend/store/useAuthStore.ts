import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../services/authService";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;

  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        set({ isLoading: false });
        return;
      }

      const res = await authService.getMe(token);

      set({
        token,
        user: res.data,  
      });
    } catch (err) {
      await AsyncStorage.removeItem("token");
      set({ user: null, token: null, isLoading: false });
    }
  },

  login: async (email, password) => {
    const res = await authService.login(email, password);

    await AsyncStorage.setItem("token", res.token);

    const meRes = await authService.getMe(res.token);

    set({
      token: res.token,
      user: meRes.data, 
    });
  },

  signup: async (name, email, password) => {
  const res = await authService.signup(name, email, password);

  await AsyncStorage.setItem("token", res.token);

  const meRes = await authService.getMe(res.token);

  set({
    token: res.token,
    user: meRes.data,
  });
},

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));