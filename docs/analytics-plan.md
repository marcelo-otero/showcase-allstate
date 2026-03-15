# ClaimPilot Analytics Plan

Analytics strategy mapping every tracked event to a product question and success metric.

## Success Metrics

From the product brief:

| Metric | Target | How We Measure |
|---|---|---|
| Initial triage time | Under 60 seconds | `agent_triage_completed.triageTimeMs` |
| Fraud flag rate | Appropriate flagging with low false positives | `agent_triage_completed.fraudRiskLevel` distribution |
| Auto-resolution rate | 40-60% of low-complexity claims | `agent_triage_completed.resolutionPath` = "approve" |
| Feature adoption | Users engage with the full flow | Funnel: Visit to Submit to Triage to Dashboard |

## Event Taxonomy

| Event Name | Trigger | Properties | Question It Answers | Success Metric It Feeds |
|---|---|---|---|---|
| `claim_submitted` | User submits the intake form | `claimType`, `policyId`, `hasDescription` (bool) | How many claims are submitted? What types? | Funnel start |
| `agent_triage_started` | API route receives claim | `claimId` | Are submissions reaching the agent? | System health |
| `agent_tool_called` | Each tool invocation completes | `toolName`, `claimId`, `durationMs` | Which tools take longest? Any failures? | Triage time breakdown |
| `agent_triage_completed` | All tools finished, resolution returned | `claimId`, `resolutionPath`, `fraudRiskLevel`, `severity`, `triageTimeMs`, `confidence` | What are the resolution outcomes? How fast? | All success metrics |
| `dashboard_viewed` | User navigates to dashboard | (none) | How often do users check analytics? | Feature adoption |
| `claim_detail_viewed` | User clicks a claim in the table | `claimId` | Are users reviewing individual claims? | Feature adoption |
| `sample_claim_loaded` | User selects a sample claim from dropdown | `claimId`, `claimType`, `expectedSeverity` | Which demo claims are most popular? | Demo engagement |

## User Funnel

```
Visit (page_view on /)
  -> Submit Claim (claim_submitted)
    -> Watch Triage (agent_triage_completed)
      -> View Dashboard (dashboard_viewed)
```

**Drop-off questions:**
- Do visitors submit claims or just browse? (Visit to Submit conversion)
- Do users wait for the full triage or abandon? (Submit to Triage completion)
- Do users explore the dashboard after triage? (Triage to Dashboard)

## PostHog Dashboards

### Dashboard 1: Usage Overview
- Total claims submitted (count of `claim_submitted`)
- Daily active sessions
- Funnel: Visit to Submit to Triage to Dashboard
- Sample claim usage breakdown (which claims are loaded most)

### Dashboard 2: Triage Performance
- Average triage time trend
- Resolution path distribution (approve/investigate/escalate/deny)
- Fraud flag rate over time
- Tool call duration breakdown (which tool is slowest)
- Severity distribution of submitted claims

### Dashboard 3: Demo Engagement
- Most loaded sample claims
- Claim types submitted (auto vs. home vs. liability)
- Sessions that complete the full funnel
- Time spent on each page

## Implementation Notes

- Use `posthog-js` for client-side events (page views, form submissions, UI interactions)
- Use `posthog-node` for server-side events (triage started/completed, tool calls)
- Environment variables: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- All events use snake_case naming
- Properties use camelCase
- Do not track PII (no claimant names or descriptions in events)
