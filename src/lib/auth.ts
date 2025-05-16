// src/lib/auth.ts
import { authConfig } from "@/auth.config";
import getServerSession from "next-auth";


export function auth() {
  return getServerSession(authConfig);
}
