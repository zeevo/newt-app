import { betterAuth, type BetterAuthOptions } from "better-auth";
import { options } from "@my-app/auth/options";

const { advanced, ...rest }: BetterAuthOptions = options;

export const auth = betterAuth({
  ...rest,
  advanced: { ...advanced, database: { ...advanced?.database, validateSchema: false } },
});