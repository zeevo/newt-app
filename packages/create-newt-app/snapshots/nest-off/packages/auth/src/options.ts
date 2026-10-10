import type { BetterAuthOptions } from "better-auth";
import { driver } from "@my-app/db";

export const options = {
  database: driver,
  emailAndPassword: { enabled: true },
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
} satisfies BetterAuthOptions;