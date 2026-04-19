import type { AuthUser, StoredCredential } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const USERS_KEY = "cyberguard_users";
const SESSION_KEY = "cyberguard_session";

function simpleHash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

function getStoredUsers(): StoredCredential[] {
  try {
    return JSON.parse(
      localStorage.getItem(USERS_KEY) ?? "[]",
    ) as StoredCredential[];
  } catch {
    return [];
  }
}

function saveUser(cred: StoredCredential): void {
  const users = getStoredUsers();
  users.push(cred);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => boolean;
  signup: (username: string, email: string, password: string) => boolean;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      error: null,

      login: (email, password) => {
        const users = getStoredUsers();
        const hash = simpleHash(password);
        const found = users.find(
          (u) => u.email === email && u.passwordHash === hash,
        );
        if (found) {
          const user: AuthUser = {
            username: found.username,
            email: found.email,
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(user));
          set({ user, isAuthenticated: true, error: null });
          return true;
        }
        set({ error: "Invalid email or password" });
        return false;
      },

      signup: (username, email, password) => {
        const users = getStoredUsers();
        if (users.find((u) => u.email === email)) {
          set({ error: "Email already registered" });
          return false;
        }
        const cred: StoredCredential = {
          email,
          username,
          passwordHash: simpleHash(password),
        };
        saveUser(cred);
        const user: AuthUser = { username, email };
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        set({ user, isAuthenticated: true, error: null });
        return true;
      },

      logout: () => {
        localStorage.removeItem(SESSION_KEY);
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: SESSION_KEY,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
