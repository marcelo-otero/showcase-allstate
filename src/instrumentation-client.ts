/**
 * Next.js client-side instrumentation hook.
 *
 * Runs once before React hydrates, so PostHog is ready
 * before any component useEffect fires.
 */
import posthog from "posthog-js";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (key && host) {
  posthog.init(key, {
    api_host: host,
    ui_host: "https://us.posthog.com",
    capture_pageview: false,
    capture_pageleave: true,
    persistence: "localStorage",
  });

  if (typeof window !== "undefined") {
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
}
