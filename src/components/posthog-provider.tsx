"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";

export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (key && host) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: true,
        capture_pageleave: true,
        persistence: "localStorage",
      });

      const params = new URLSearchParams(window.location.search);
      if (params.has("ph_internal")) {
        posthog.register({ is_internal: true });
      }
      if (params.has("ph_optout")) {
        posthog.opt_out_capturing();
      }
      if (params.has("ph_optin")) {
        posthog.opt_in_capturing();
      }
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
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
