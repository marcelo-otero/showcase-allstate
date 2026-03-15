import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClaimPilot | AI Claims Triage Assistant",
  description:
    "Agentic insurance claims triage powered by Claude. Classifies, verifies, screens, and recommends resolution paths in seconds.",
  authors: [{ name: "Marcelo Otero" }],
  openGraph: {
    title: "ClaimPilot",
    description:
      "AI-powered insurance claims triage that classifies, verifies coverage, screens for fraud, and recommends resolution paths.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="border-b border-border bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  CP
                </span>
              </div>
              <span className="font-semibold text-lg">ClaimPilot</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Submit Claim
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border py-4">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
            Built by Marcelo Otero | Powered by Claude API
          </div>
        </footer>
      </body>
    </html>
  );
}
