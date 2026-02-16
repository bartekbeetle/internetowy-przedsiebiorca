import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      name?: string | null;
      avatar?: string | null;
      role: string;
      onboardingCompleted: boolean;
      emailVerified?: Date | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    username: string;
    name?: string | null;
    avatar?: string | null;
    role: string;
    onboardingCompleted: boolean;
    emailVerified?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    username: string;
    name?: string | null;
    avatar?: string | null;
    role: string;
    onboardingCompleted: boolean;
    emailVerified?: Date | null;
  }
}
