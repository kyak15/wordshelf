export type AuthProvider = "google" | "apple" | "email";

/** Matches DDL: users table */
export interface User {
  user_id: string;
  email: string | null;
  display_name: string | null;
  created_at: Date;
  updated_at: Date;
}

/** Matches DDL: user_identities table */
export interface UserIdentity {
  identity_id: string;
  user_id: string;
  provider: AuthProvider;
  provider_user_id: string;
  email: string | null;
  created_at: Date;
}

/** Google userinfo response */
export interface GoogleUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  verified_email?: boolean;
}

/** Apple id_token payload (decoded JWT) */
export interface AppleIdTokenPayload {
  iss: string; // https://appleid.apple.com
  sub: string; // user's unique Apple ID
  aud: string; // app's client_id
  iat: number;
  exp: number;
  email?: string;
  email_verified?: string | boolean;
  is_private_email?: string | boolean;
  nonce?: string;
  nonce_supported?: boolean;
}
