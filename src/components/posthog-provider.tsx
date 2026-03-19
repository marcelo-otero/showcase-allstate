"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Provides PostHog React context to the component tree.
 * Initialization happens in instrumentation-client.ts (runs before hydration).
 * Includes automatic $pageview tracking on client-side navigations.
 */
export function PostHogProvider({ children }: { children: ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView />
      {children}
    </PHProvider>
  );
}

/**
 * Tracks $pageview on every client-side route change.
 * Uses usePathname + useSearchParams to detect Next.js App Router navigations.
 */
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (pathname && ph) {
      let url = window.origin + pathname;
      const params = searchParams.toString();
      if (params) {
        url = url + "?" + params;
      }
      ph.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, ph]);

  return null;
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}

// Helper to track events safely (no-op if PostHog not initialized)
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture(eventName, properties);
  }
}
