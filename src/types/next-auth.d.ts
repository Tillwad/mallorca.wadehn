import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: "ADMIN" | "FAMILY" | "GUEST";
  }

  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      role: "ADMIN" | "FAMILY" | "GUEST";
    };
  }

  interface JWT {
    role?: "ADMIN" | "FAMILY" | "GUEST";
  }
}
