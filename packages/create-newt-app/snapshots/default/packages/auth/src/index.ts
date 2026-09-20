import { betterAuth } from "better-auth";
import { driver } from "@my-app/db";

const migrating = process.argv.includes("migrate");

export const auth = betterAuth({
  database: driver,
  emailAndPassword: { enabled: true },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
  advanced: { database: { validateSchema: !migrating } },
});

export type Auth = typeof auth;