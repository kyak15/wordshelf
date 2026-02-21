import type { Metadata } from "next";
import "./globals.css";
import { QueryProviderWeb } from "./providers/QueryProviderWeb";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: "WordVault – Learn words you find while reading",
  description:
    "The app to learn words you find while reading. Save, review, and master new vocabulary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <QueryProviderWeb>
          <AuthProvider>{children}</AuthProvider>
        </QueryProviderWeb>
      </body>
    </html>
  );
}
