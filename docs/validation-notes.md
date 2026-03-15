# ClaimPilot Concept Validation Notes

Validated against the insurance industry expert prompt. Key findings below.

## Verdict: Strong concept with refinements needed

The project addresses a real, measurable pain point in P&C claims operations. The agentic tool-use architecture is the right approach, and the streaming UI is a strong differentiator.

## What works

- **Tool-use architecture mirrors real claims workflows.** Claims triage is sequential with branching logic (classify, verify coverage, screen for fraud, recommend path). This is not a single-prompt problem, and building it as multi-step tool-use shows domain understanding.
- **Streaming reasoning is compelling for regulated industries.** Explainability matters in insurance. Showing the "why" behind each decision is a feature, not just a UI trick.
- **Analytics dashboard signals product thinking.** Hiring managers want PMs who measure, not just build.
- **Escalation logic (auto-resolve vs. human review) is critical.** This shows you understand AI in insurance needs guardrails.

## Refinements applied

### Terminology upgrades
- "Claim submission" becomes "First Notice of Loss (FNOL)" in product docs and UI
- "Policy lookup" becomes "Coverage verification"
- "Fraud score" framed as "initial fraud screening" (not definitive)
- Agent "triages and recommends" rather than "resolves"
- Reference LAE (Loss Adjustment Expense), STP (Straight-Through Processing), severity segmentation

### Framing adjustments
- Position as "adjuster decision support" and "triage assistance," not "automated claims resolution"
- No carrier will let AI auto-settle. The agent augments adjusters, not replaces them
- Fraud tool is "red flag identification" and "initial screening," not fraud detection
- Include confidence scores with human escalation thresholds

### Features to emphasize
- Confidence score on overall triage with configurable escalation threshold
- Transparent reasoning (streaming tool calls) for auditability
- Coverage gap identification before adjuster assignment (reduces misroutes)
- Severity segmentation that maps to adjuster skill levels

### Real metrics to reference
- Industry average initial triage: 24-48 hours
- Misrouted claims add 5-10 days to cycle time
- Allstate processes ~4M claims/year
- Target: 40% reduction in initial triage time
- Target: reduce misrouted claims through early coverage verification
- LAE ratio for top carriers: 10-12%

## What NOT to claim
- AI fully automates complex claims (it doesn't)
- Fraud detection is a simple scoring problem (it's not; production uses ensemble models, network graphs, SIU integration)
- The agent "resolves" claims (it triages and recommends; resolution involves negotiation, documentation, and regulatory compliance)
