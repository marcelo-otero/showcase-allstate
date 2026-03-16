import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { PostHogProvider } from "@/components/posthog-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        className={`${plusJakartaSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <header className="sticky top-0 z-50 bg-[#0e1941] text-white">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/15 transition-colors">
                <svg
                  width="18"
                  height="18"
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
                    fillOpacity="0.15"
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
              <span className="font-semibold text-[15px] tracking-tight text-white">
                ClaimPilot
              </span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link
                href="/"
                className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                Submit Claim
              </Link>
              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          <PostHogProvider>{children}</PostHogProvider>
        </main>

        <footer className="bg-[#0e1941] py-5">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-white/50">
            <a href="https://www.linkedin.com/in/marcelo-otero/" target="_blank" rel="noopener noreferrer" className="hover:text-white/80 transition-colors">Built by Marcelo Otero</a>
            <span>Powered by Claude API</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
