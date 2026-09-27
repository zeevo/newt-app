import { betterAuth } from "better-auth";
import { options } from "@my-app/auth/options";

export const auth = betterAuth(options);

export type Auth = typeof auth;