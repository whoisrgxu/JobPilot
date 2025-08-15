// src/store/auth.ts
import { atom } from "jotai";

type AuthState = {
  token: string | null;
  email: string;
  userName: string;
};

export const authAtom = atom<AuthState>({
  token: null,
  email: "",
  userName: "", 
});
