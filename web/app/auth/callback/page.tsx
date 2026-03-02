"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { initApiClientWeb } from "@/lib/apiWeb";
import { authService } from "shared/services/auth.service";

function CallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"exchanging" | "done" | "error">(
    "exchanging",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    const redirectUri = `${appUrl.replace(/\/$/, "")}/auth/callback`;

    if (!code) {
      setStatus("error");
      setErrorMessage("No authorization code received.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        initApiClientWeb();
        await authService.googleExchange(code, undefined, redirectUri);
        if (!cancelled) {
          setStatus("done");
          window.location.href = "/Home";
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setErrorMessage(
            err instanceof Error ? err.message : "Sign-in failed.",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  if (status === "error") {
    const loginUrl = `/login?error=${encodeURIComponent(errorMessage ?? "Sign-in failed")}`;
    if (typeof window !== "undefined") window.location.replace(loginUrl);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-600">{errorMessage}</p>
        <a href="/login" className="text-sm underline">
          Back to sign in
        </a>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-500">Sign-in successful, redirecting…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-neutral-500">Completing sign-in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-neutral-500">Loading…</p>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
