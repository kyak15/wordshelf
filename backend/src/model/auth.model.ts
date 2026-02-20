export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/** OAuth code exchange (Google) */
export interface OAuthExchangeBody {
  provider: "google";
  code: string;
  codeVerifier?: string;
  redirectUri: string;
}

/** Apple Sign In (app sends identityToken directly) */
export interface AppleSignInBody {
  identityToken: string; // JWT from Apple
  user?: {
    // Apple only sends name on first sign-in
    name?: { firstName?: string; lastName?: string };
    email?: string;
  };
}

/** Email OTP start */
export interface EmailStartBody {
  email: string;
}

/** Email OTP verify */
export interface EmailVerifyBody {
  email: string;
  code: string;
}

/** Auth result returned to client */
export interface AuthResult {
  user: {
    user_id: string;
    email: string | null;
    display_name: string | null;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
