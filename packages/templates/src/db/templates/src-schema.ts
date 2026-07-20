export default {
  filename: "packages/db/src/schema.ts",
  template: `<% if (database === 'postgres') { %>type AuthDate = Date;
type AuthBool = boolean;
<% } else { %>type AuthDate = string;
type AuthBool = number;
<% } %>
export interface UserTable {
  id: string;
  name: string;
  email: string;
  emailVerified: AuthBool;
  image: string | null;
  createdAt: AuthDate;
  updatedAt: AuthDate;
}

export interface SessionTable {
  id: string;
  expiresAt: AuthDate;
  token: string;
  createdAt: AuthDate;
  updatedAt: AuthDate;
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
  accessTokenExpiresAt: AuthDate | null;
  refreshTokenExpiresAt: AuthDate | null;
  scope: string | null;
  password: string | null;
  createdAt: AuthDate;
  updatedAt: AuthDate;
}

export interface VerificationTable {
  id: string;
  identifier: string;
  value: string;
  expiresAt: AuthDate;
  createdAt: AuthDate;
  updatedAt: AuthDate;
}

export interface DB {
  account: AccountTable;
  session: SessionTable;
  user: UserTable;
  verification: VerificationTable;
}`,
};
