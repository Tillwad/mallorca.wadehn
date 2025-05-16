import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Hier wird der Auth-Helper erzeugt, den du überall mit `auth()` oder `signIn()` verwenden kannst
export const { auth, signIn, signOut } = NextAuth(authConfig);
