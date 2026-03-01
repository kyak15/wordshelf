import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { QueryProviderWeb } from "./providers/QueryProviderWeb";
import { AuthProvider } from "./context/AuthContext";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

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
    <html lang="en" className={fontSans.variable}>
      <body className="min-h-screen antialiased font-[var(--font-plus-jakarta)]">
        <QueryProviderWeb>
          <AuthProvider>{children}</AuthProvider>
        </QueryProviderWeb>
      </body>
    </html>
  );
}
