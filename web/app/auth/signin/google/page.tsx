"use client";

import { useEffect } from "react";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

/**
 * Redirects to Google OAuth. Set in .env:
 * - NEXT_PUBLIC_GOOGLE_CLIENT_ID
 * - NEXT_PUBLIC_APP_URL (e.g. http://localhost:3000 for dev)
 */
export default function SignInGooglePage() {
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "");
    const redirectUri = `${appUrl.replace(/\/$/, "")}/auth/callback`;

    if (!clientId) {
      console.error("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set");
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

    window.location.href = `${GOOGLE_AUTH_URL}?${params.toString()}`;
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-neutral-500">Redirecting to Google…</p>
    </div>
  );
}
