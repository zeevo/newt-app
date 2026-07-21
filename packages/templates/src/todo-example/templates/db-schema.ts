export default {
  filename: "packages/db/src/schema.ts",
  template: `import type { Generated } from "kysely";
<% const date = database === 'postgres' ? 'Date' : 'string'; const bool = database === 'postgres' ? 'boolean' : 'number'; -%>

export interface TodoTable {
  id: string;
  userId: string;
  title: string;
  done: Generated<number>;
  createdAt: Generated<string>;
}

export interface UserTable {
  id: string;
  name: string;
  email: string;
  emailVerified: <%= bool %>;
  image: string | null;
  createdAt: <%= date %>;
  updatedAt: <%= date %>;
}

export interface SessionTable {
  id: string;
  expiresAt: <%= date %>;
  token: string;
  createdAt: <%= date %>;
  updatedAt: <%= date %>;
  ipAddress: string | null;
  userAgent: string | null;
  userId: string;
}

export interface AccountTable {
  id: string;
  accountId: string;
  providerId: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  idToken: string | null;
  accessTokenExpiresAt: <%= date %> | null;
  refreshTokenExpiresAt: <%= date %> | null;
  scope: string | null;
  password: string | null;
  createdAt: <%= date %>;
  updatedAt: <%= date %>;
}

export interface VerificationTable {
  id: string;
  identifier: string;
  value: string;
  expiresAt: <%= date %>;
  createdAt: <%= date %>;
  updatedAt: <%= date %>;
}

export interface DB {
  account: AccountTable;
  session: SessionTable;
  todo: TodoTable;
  user: UserTable;
  verification: VerificationTable;
}`,
};
