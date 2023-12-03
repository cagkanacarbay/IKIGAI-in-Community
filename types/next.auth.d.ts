// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Extending the built-in session types
   */
  interface Session {
    user: {
      id: string;
      username: string;
      name?: string;
      email?: string;
      image?: string;
    }
  }
}
