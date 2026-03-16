# ClaimPilot Product Brief

## Problem Statement

Claims triage at large P&C carriers is slow, inconsistent, and expensive. When a customer files a First Notice of Loss (FNOL), the claim enters a manual triage process where it must be classified by type and severity, verified against the policy, screened for fraud indicators, and routed to the right adjuster. This process typically takes 24 to 48 hours for initial triage alone, and misrouted claims add 5 to 10 days to total cycle time.

The cost is significant. Allstate processes approximately 8.4 million claims per year. Loss Adjustment Expense (LAE) ratios for top carriers run 10 to 12% of incurred losses. Even small improvements in triage speed and accuracy compound at this scale: fewer misrouted claims, earlier fraud detection, faster time-to-settlement, and lower operational cost per claim.

Current approaches to AI in claims focus on downstream tasks (damage estimation from photos, customer communication drafting). The triage step, where a claim first gets classified, verified, and routed, remains largely manual.

## Target User

**Primary:** Claims operations supervisor or triage specialist who reviews incoming claims and assigns them to adjusters. They need to process high volumes accurately and consistently.

**Secondary:** Claims adjuster who receives pre-triaged claims. They benefit from having classification, coverage verification, and fraud screening done before they open the file.

## Success Metrics

| Metric | Current State (Industry Avg) | Target | How ClaimPilot Measures It |
|---|---|---|---|
| Initial triage time | 24-48 hours (manual) | Under 60 seconds (automated) | `triageTimeMs` field in triage_results table, displayed on dashboard |
| Triage accuracy | Varies by adjuster experience | 90%+ classification match to expected severity | Comparison of agent classification vs. expected severity in sample data |
| Fraud flag rate | 5-10% of claims flagged | Appropriate flagging with low false positive rate | `fraudAssessment.riskLevel` distribution on dashboard |
| Auto-resolution rate | Near 0% (all manual) | 40-60% of low-complexity claims get auto-resolution recommendation | Resolution path distribution on dashboard |
| Misroute reduction | ~15% of claims misrouted | Catch coverage gaps before assignment | Coverage verification tool results |

## Scope: What's in v1

1. **Claims intake form:** Structured FNOL submission with claimant name, policy number, incident date, claim type, and free-text description
2. **Agentic triage engine:** Claude-powered agent with 4 specialized tools that autonomously processes each claim:
   - `classifyClaim`: Extracts claim type, severity, coverage area, and key details from free text
   - `lookupPolicy`: Verifies coverage, deductible, limits, and policy status
   - `assessFraud`: Screens for fraud indicators and returns risk level with specific red flags
   - `estimateResolution`: Recommends resolution path (approve/investigate/escalate/deny) with estimated payout range
3. **Streaming agent visualization:** Real-time UI showing the agent's reasoning and each tool call as it happens, with collapsible result cards
4. **Analytics dashboard:** Server-rendered dashboard with summary metrics, claims distribution charts, and a searchable claims table
5. **Sample data:** 15-20 realistic claims covering auto, home, and liability scenarios including edge cases (fraud indicators, coverage gaps, ambiguous claims)
6. **PostHog analytics:** Event tracking on every user interaction with a documented analytics plan

## What's explicitly NOT in v1

- **Real policy or claims data.** All data is simulated. No PII, no real policies.
- **Authentication or role-based access.** No login, no user roles.
- **Real fraud detection.** The fraud tool does rule-based screening on claim text, not ML-based pattern detection or SIU database lookups.
- **Payment processing or settlement execution.** The agent recommends a resolution path; it doesn't execute settlements.
- **Multi-turn conversation.** The agent processes one claim per submission. No follow-up questions or back-and-forth.
- **Document upload.** No photo/video damage assessment (that's Allstate's QuickFoto Claim territory).
- **Production database.** SQLite for demo purposes, not a cloud database.

## Non-Goals

- Replacing human adjusters. ClaimPilot is decision support, not automation.
- Building a production-grade fraud detection system. That requires ensemble models, network analysis, and SIU integration.
- Regulatory compliance implementation (state-specific time-to-contact rules, unfair claims settlement practices acts). Acknowledged in docs, not built.
- Competing with Guidewire, Duck Creek, or other claims management platforms. This is a focused triage prototype, not a platform.

## Key Assumptions

1. Claims triage can be meaningfully improved by pre-processing claims through structured classification, coverage verification, and fraud screening before an adjuster touches them
2. An LLM with tool-use capabilities can perform initial claim classification and severity assessment with reasonable accuracy on well-described claims
3. Streaming the agent's reasoning builds trust and satisfies auditability requirements better than a black-box classification
4. Operations teams would adopt a tool that reduces triage time if it maintains or improves accuracy
5. The architecture (separate specialized tools vs. one monolithic prompt) better reflects how real claims workflows operate and is more maintainable

## Technical Architecture

See `CLAUDE.md` for full architecture details and the architecture diagram at `docs/diagrams/architecture.excalidraw`.

**Stack:** Next.js 16, TypeScript, Tailwind 4, shadcn/ui, Vercel AI SDK, Claude API, SQLite, PostHog, Vitest
