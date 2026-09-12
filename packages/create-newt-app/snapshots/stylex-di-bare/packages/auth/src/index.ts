import { betterAuth } from "better-auth";
import { driver } from "@my-app/db";

export const auth = betterAuth({
  database: driver,
  emailAndPassword: { enabled: true },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
});

export type Auth = typeof auth;