import {UserInterface} from "@/interfaces/user-interface";
import CryptoJS from "crypto-js";
import {create} from "zustand";
import {persist, createJSONStorage} from "zustand/middleware";

/* ========================================
   = Types =
========================================= */
interface AuthState {
  user: UserInterface | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (user: UserInterface, token: string) => void;
  clearSession: () => void;
}

/* ========================================
   = Encrypted Storage =
========================================= */
const SECRET = process.env.NEXT_PUBLIC_STORAGE_SECRET as string;

const encryptedStorage = createJSONStorage(() => ({
  getItem(key: string) {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string) {
    const encrypted = CryptoJS.AES.encrypt(value, SECRET).toString();
    localStorage.setItem(key, encrypted);
  },
  removeItem(key: string) {
    localStorage.removeItem(key);
  },
}));

/* ========================================
   = Store =
========================================= */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Session management
      setSession(user, token) {
        set({user, token, isAuthenticated: true});
      },

      // Clear session
      clearSession() {
        set({user: null, token: null, isAuthenticated: false});
        localStorage.removeItem("fitshape_auth");
      },
    }),
    {
      name: "fitshape_auth",
      storage: encryptedStorage,
    },
  ),
);
