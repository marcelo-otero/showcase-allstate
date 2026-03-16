import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";
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
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  ),
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
            <Link href="/" className="flex items-center gap-3 group">
              <span className="font-bold text-lg tracking-tight text-white">
                ClaimPilot
              </span>
              <span className="hidden sm:inline text-[9px] font-medium tracking-wide uppercase text-[#45bce5] border border-[#45bce5]/30 rounded px-1.5 py-0.5 leading-none bg-[#45bce5]/10">
                Independent Showcase Project
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/demo"
                className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                Try Demo
              </Link>
              <Link
                href="/dashboard"
                className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                Dashboard
              </Link>
            </nav>
            <MobileNav />
          </div>
        </header>

        <main className="flex-1">
          <PostHogProvider>{children}</PostHogProvider>
        </main>

        <footer className="bg-[#0e1941] py-5">
          <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-2 text-xs text-white/60">
            <div className="w-full flex items-center justify-center">
              <span>Built by <a href="https://www.linkedin.com/in/marcelo-otero/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/90 transition-colors">Marcelo Otero</a></span>
            </div>
            <p className="text-white/40 text-xs">
              Independent portfolio project. Not affiliated with or endorsed by Allstate.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
