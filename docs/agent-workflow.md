# ClaimPilot Agent Workflow

Defines how the ClaimPilot agent processes claims, including tool definitions, decision logic, and edge case handling.

## Trigger

The agent is triggered when a user submits a claim through the intake form. The submission includes:
- Claimant name
- Policy number
- Claim type (optional, agent will classify regardless)
- Date of incident
- Free-text claim description

## Available Tools

### 1. classifyClaim

**Purpose:** Extract structured information from a free-text claim description.

**Input:**
```typescript
{
  claimText: string        // Raw claim description from the user
  claimType?: string       // Optional user-provided claim type hint
}
```

**Output:**
```typescript
{
  claimType: "auto" | "home" | "liability" | "health"
  severity: "low" | "medium" | "high" | "critical"
  coverageArea: string     // e.g., "collision", "water damage", "bodily injury"
  keyDetails: string[]     // Extracted facts: dates, amounts, parties, locations
  summary: string          // 1-2 sentence summary of the claim
}
```

**Logic:** Rule-based classification using keyword matching and pattern recognition on the claim text. Severity is determined by indicators like injury mentions, dollar amounts, number of parties involved, and structural damage keywords.

### 2. lookupPolicy

**Purpose:** Verify that the claimed loss is covered by the referenced policy.

**Input:**
```typescript
{
  policyId: string         // Policy number from the submission
}
```

**Output:**
```typescript
{
  policyStatus: "active" | "expired" | "cancelled" | "not_found"
  coverageType: string     // e.g., "auto comprehensive", "homeowners HO-3"
  deductible: number       // Dollar amount
  coverageLimit: number    // Maximum payout
  startDate: string        // Policy effective date
  endDate: string          // Policy expiration date
  isActive: boolean        // Whether the policy is currently in force
  coveredPerils: string[]  // What the policy covers
}
```

**Logic:** Looks up the policy ID in the sample policies database. Returns full policy details or a not_found status.

### 3. assessFraud

**Purpose:** Screen the claim for potential fraud indicators.

**Input:**
```typescript
{
  claimText: string        // Raw claim description
  claimType: string        // From classifyClaim output
  severity: string         // From classifyClaim output
  policyStartDate: string  // From lookupPolicy output
  dateOfIncident: string   // From the submission
  coverageLimit: number    // From lookupPolicy output
}
```

**Output:**
```typescript
{
  riskScore: number        // 0-100
  riskLevel: "low" | "medium" | "high"
  indicators: string[]     // Specific red flags identified
  recommendation: string   // Brief recommendation for the adjuster
}
```

**Logic:** Rule-based screening that checks for common fraud indicators:
- Claim filed shortly after policy inception (new policy fraud)
- Claim amount near or at coverage limit
- Inconsistent details in the description
- Excessive damage claims relative to incident type
- Known fraud pattern keywords (e.g., "total loss" on minor incidents)
- Multiple claims on the same policy in a short period

**Important framing:** This is initial screening/red flag identification, not definitive fraud detection. Production fraud detection requires ensemble ML models, SIU database lookups, and network analysis.

### 4. estimateResolution

**Purpose:** Recommend a resolution path based on all prior analysis.

**Input:**
```typescript
{
  claimType: string
  severity: string
  coverageArea: string
  policyStatus: string
  isActive: boolean
  deductible: number
  coverageLimit: number
  fraudRiskLevel: string
  fraudIndicators: string[]
  claimSummary: string
}
```

**Output:**
```typescript
{
  resolutionPath: "approve" | "investigate" | "escalate" | "deny"
  estimatedPayout: {
    min: number
    max: number
  }
  confidence: "high" | "medium" | "low"
  reasoning: string        // Why this resolution was recommended
  nextSteps: string[]      // What should happen next
}
```

**Logic:**
- **Approve:** Low severity + active policy + low fraud risk + clear coverage. Straight-through processing candidate.
- **Investigate:** Medium severity OR medium fraud risk OR coverage ambiguity. Needs adjuster review but not urgent.
- **Escalate:** High/critical severity OR high fraud risk OR complex multi-party. Needs senior adjuster or SIU.
- **Deny:** Expired/cancelled policy OR clear coverage exclusion OR policy not found.

## Decision Flow

The agent follows this general sequence, but has autonomy to adapt:

```
1. ALWAYS start with classifyClaim
   - This gives the agent structured data to work with

2. THEN lookupPolicy
   - Needed to verify coverage before any resolution

3. THEN assessFraud
   - Uses outputs from steps 1 and 2

4. FINALLY estimateResolution
   - Uses outputs from all three prior tools
   - Makes the final recommendation
```

The agent may:
- Skip fraud assessment if the policy is expired/cancelled (deny path is clear)
- Add commentary between tool calls explaining its reasoning
- Note when it has low confidence and recommend human review regardless of the resolution path

## Escalation Logic

### Auto-Resolve Candidates (STP)
The agent recommends "approve" without human review when ALL of:
- Severity is "low"
- Policy is active with clear coverage
- Fraud risk is "low" (score under 30)
- Estimated payout is under $5,000
- Resolution confidence is "high"

### Human Review Required
The agent recommends "investigate" or "escalate" when ANY of:
- Fraud risk score is above 50
- Severity is "high" or "critical"
- Policy coverage is ambiguous or near limits
- Multiple parties are involved
- Bodily injury is claimed
- Resolution confidence is "low"

### Automatic Deny
The agent recommends "deny" when:
- Policy is expired, cancelled, or not found
- Claim type is clearly excluded from coverage
- Date of incident is outside the policy period

## Edge Cases

### Incomplete Claim Description
- The agent should still call classifyClaim and note that the description is insufficient
- Classification confidence should be "low"
- Resolution should default to "escalate" with a note that more information is needed

### Ambiguous Coverage
- If the claim type doesn't clearly map to the policy's covered perils, the agent should note the ambiguity
- Resolution should be "investigate" so an adjuster can make the coverage determination

### Multiple Policies
- The current system takes a single policy ID per claim
- If a claimant references multiple policies, the agent should note this and recommend the adjuster verify which policy applies

### Policy Not Found
- If lookupPolicy returns "not_found," the agent should still classify the claim
- Skip fraud assessment (no policy data to cross-reference)
- Resolution should be "deny" with next steps suggesting the claimant verify their policy number

## Error Handling

| Error | Agent Behavior |
|---|---|
| classifyClaim receives empty/gibberish text | Return low-confidence classification, recommend escalation |
| lookupPolicy receives invalid policy ID | Return "not_found" status |
| assessFraud receives incomplete data | Return medium risk with a note that screening was limited |
| estimateResolution has conflicting inputs | Default to "investigate" with low confidence |
| Any tool throws an unexpected error | Agent should note the error and recommend human review |

## Streaming Behavior

The agent's response is streamed to the UI in real-time:
1. Agent starts with a brief acknowledgment of the claim
2. Each tool call appears as a collapsible card showing: tool name, input summary, and status (running/complete)
3. Between tool calls, the agent provides reasoning text explaining why it's calling the next tool
4. After all tools complete, the agent provides a summary with the final recommendation
5. The resolution recommendation is displayed prominently as a final card

## System Prompt Guidelines

The agent system prompt instructs Claude to:
- Act as an experienced claims triage specialist
- Process claims methodically (classify, verify, screen, recommend)
- Explain reasoning at each step in plain language (no insurance jargon in customer-facing text)
- Flag uncertainty rather than guessing
- Always recommend human review for high-severity or high-fraud-risk claims
- Never claim to "resolve" or "settle" claims, only triage and recommend
- Reference specific details from the claim and policy in its reasoning
