# ClaimPilot

AI-powered insurance claims triage that classifies, verifies coverage, screens for fraud, and recommends resolution paths in under 60 seconds.

## The Problem

Claims triage at large P&C carriers is slow, inconsistent, and expensive. When a customer files a First Notice of Loss (FNOL), the claim enters a manual triage process: classify by type and severity, verify against the policy, screen for fraud indicators, and route to the right adjuster. This takes 24 to 48 hours for initial triage, and misrouted claims add 5 to 10 more days to total cycle time.

At Allstate's scale of approximately 4 million claims per year, even small improvements in triage speed and accuracy compound into significant reductions in loss adjustment expense (LAE), which runs 10 to 12% of incurred losses for top carriers.

## The Approach

ClaimPilot uses Claude's tool-use API to build a multi-step agentic system. This is not a chatbot or a single-prompt classifier. The agent has four specialized tools and decides autonomously which to call and in what order:

1. **classifyClaim** - Extracts claim type, severity, coverage area, and key details from free-text descriptions
2. **lookupPolicy** - Verifies coverage status, deductible, limits, and covered perils
3. **assessFraud** - Screens for red flags: new policy timing, coverage limit proximity, no witnesses, inconsistent details
4. **estimateResolution** - Recommends a path (approve, investigate, escalate, deny) with estimated payout range and next steps

The agent streams its reasoning and tool calls to the UI in real-time, making every decision transparent and auditable.

## Architecture

```
User submits FNOL
       |
       v
  [Intake Form] -----> [Claude Agent (streamText)]
                              |
                    +---------+---------+---------+
                    |         |         |         |
              classifyClaim  lookupPolicy  assessFraud  estimateResolution
                    |         |         |         |
                    +---------+---------+---------+
                              |
                              v
                    [Streaming Response]
                    (reasoning + tool call cards)
                              |
                              v
                    [SQLite + PostHog]
                              |
                              v
                    [Analytics Dashboard]
```

**Stack:** Next.js 16, TypeScript, Tailwind 4, shadcn/ui, Vercel AI SDK, Claude API, SQLite, PostHog, Vitest

## Demo Data & Results

From running 16 sample claims (auto, home, liability) through the triage system:

| Metric | Result |
|---|---|
| Average triage time | Under 1 second (vs. 24-48 hours manual) |
| Fraud flag rate | 12% (medium + high risk, aligned with industry benchmarks) |
| Auto-resolution rate | 6% (low-complexity STP candidates) |
| Resolution distribution | 1 approve, 8 investigate, 6 escalate, 1 deny |
| Severity distribution | 3 medium, 9 high, 4 critical |

Sample claims include edge cases: fraud indicators (new policy + total loss claim at cousin's shop), expired policies (automatic deny), ambiguous coverage (foundation damage), and multi-party incidents.

## Key Technical Decisions

- **Streaming tool-use over prompt chaining** - The agent decides tool order autonomously rather than following a fixed script. If the policy is expired, it skips fraud assessment and goes straight to denial. More realistic, more agentic.
- **Rule-based tools, LLM orchestration** - Tools are deterministic and testable (18 unit tests). The agent decides which to call and interprets results. Separation means the demo works without API costs for every data point.
- **SQLite for demo, designed for production** - Dashboard queries SQLite directly as a server component. In production, swap for Turso or PostgreSQL without changing the query layer.
- **"Triage assistance" not "automation"** - Validated with insurance industry expertise. No carrier will let AI auto-settle claims. ClaimPilot augments adjusters, it doesn't replace them.

See the full [decision log](docs/decision-log.md) with 8 tradeoff entries.

## What I'd Do Next

If this were a production product at Allstate:

- **Real data integration** - Connect `lookupPolicy` to Guidewire/Duck Creek instead of sample data
- **ML-based tools** - Replace rule-based classification with models trained on historical claims
- **Document upload** - Photo/video damage assessment (building on QuickFoto Claim)
- **Authentication** - Role-based access for adjusters, supervisors, and SIU
- **Feedback loop** - Adjuster corrections improve model accuracy over time
- **A/B testing** - Test different resolution thresholds and escalation criteria
- **Regulatory compliance** - State-specific time-to-contact rules, unfair claims settlement practices

## Built With

- [Next.js 16](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) - Styling and components
- [Vercel AI SDK](https://sdk.vercel.ai) - Claude integration with streaming
- [Claude API](https://docs.anthropic.com) - Multi-step tool-use agent
- [SQLite](https://www.sqlite.org) - Local data storage
- [PostHog](https://posthog.com) - Product analytics
- [Vitest](https://vitest.dev) - Unit testing (18 tests)

## Running Locally

```bash
pnpm install
cp .env.example .env.local  # Add your ANTHROPIC_API_KEY
pnpm seed                   # Populate sample data
pnpm dev                    # Start dev server
```

## About

Built by Marcelo Otero as a product management portfolio project demonstrating applied AI in insurance claims processing. Designed specifically for the Allstate Digital Product Manager role to show hands-on experience with agentic technologies, data-driven product thinking, and end-to-end execution.
