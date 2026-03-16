import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { PostHogProvider } from "@/components/posthog-provider";
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
        <header className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-lg">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[oklch(0.40_0.14_250)] to-[oklch(0.30_0.12_260)] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M8 1L2 4.5V11.5L8 15L14 11.5V4.5L8 1Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M5 7.5L7 9.5L11 5.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-semibold text-[15px] tracking-tight text-foreground">
                ClaimPilot
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/"
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-all"
              >
                Submit Claim
              </Link>
              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-all"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <PostHogProvider>{children}</PostHogProvider>
        </main>

        <footer className="border-t border-border/60 py-5 bg-white/50">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-muted-foreground">
            <span>Built by Marcelo Otero</span>
            <span>Powered by Claude API</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
