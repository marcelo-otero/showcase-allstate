# ClaimPilot Decision Log

Key tradeoffs made during the ClaimPilot build, documented for interview reference.

---

## Decision: Streaming tool-use over prompt chaining

**Context:** The agent needs to call 4 tools in sequence. Two approaches: (A) chain 4 separate Claude API calls, each with the prior output as context, or (B) use a single multi-step `streamText` call where Claude decides tool order autonomously.

**Options considered:**
1. Prompt chaining (4 separate API calls)
2. Single multi-step tool-use with streaming (chosen)
3. Single prompt with all logic embedded (no tools)

**Decision:** Single multi-step tool-use with streaming.

**Rationale:** Multi-step tool-use is the actual "agentic" architecture the JD describes. The agent decides tool order, reasons between steps, and adapts to what it finds (e.g., skipping fraud assessment if the policy is expired). Prompt chaining is deterministic and doesn't demonstrate autonomy. The single-prompt approach doesn't demonstrate structured tool-use.

**Tradeoffs:** Multi-step streaming adds UI complexity (rendering tool call cards with different states) and is harder to test deterministically. Prompt chaining would have been simpler to build and debug.

---

## Decision: SQLite over a cloud database

**Context:** Need persistent storage for claims data and dashboard analytics.

**Options considered:**
1. SQLite via better-sqlite3 (chosen)
2. Turso (SQLite edge database)
3. PostgreSQL on Supabase or Neon
4. In-memory only (no persistence)

**Decision:** SQLite via better-sqlite3 with local file storage.

**Rationale:** For a demo/portfolio project, SQLite provides real SQL queries, JSON functions for triage results, and zero external dependencies. The dashboard runs as a server component querying SQLite directly, which is fast and demonstrates data literacy. A cloud database adds operational complexity without demo value.

**Tradeoffs:** SQLite won't persist on Vercel's serverless between invocations. Mitigation: seed at build time so the dashboard always has data. New claims submitted on the live site won't persist, which is acceptable for a demo. If persistence mattered, Turso would be the natural upgrade path (same SQL, edge-hosted).

---

## Decision: Vercel AI SDK over raw Claude API calls

**Context:** Need to integrate Claude for the agent. Two approaches: use Anthropic's SDK directly, or use Vercel AI SDK which wraps it.

**Options considered:**
1. Vercel AI SDK (`ai` + `@ai-sdk/anthropic`) (chosen)
2. Anthropic SDK (`@anthropic-ai/sdk`) directly
3. LangChain

**Decision:** Vercel AI SDK.

**Rationale:** Provides streaming, tool-use, and React hooks out of the box. The `streamText` function handles multi-step tool calls, response streaming, and UI integration with minimal boilerplate. Switching models later would be a one-line change. The React `useChat` integration (or custom hook for v6) handles message state management.

**Tradeoffs:** Adds a dependency layer between our code and Claude's API. If the AI SDK has bugs or API changes (which happened with v6), we're affected. Using the Anthropic SDK directly would give more control but require manually implementing streaming, tool call parsing, and message state management.

---

## Decision: Separate specialized tools over one monolithic prompt

**Context:** Could structure the agent's capabilities as 4 separate tools or as a single prompt that does everything at once.

**Options considered:**
1. 4 separate tools with Zod schemas (chosen)
2. Single comprehensive prompt
3. 2 tools (classify+lookup combined, fraud+resolution combined)

**Decision:** 4 separate tools, each with its own Zod-validated input/output schema.

**Rationale:** Mirrors how real claims workflows operate (separate steps by different specialists). Each tool is independently testable (18 unit tests). The streaming UI can show each step as a distinct card, which makes the agent's reasoning transparent. This is also the architecture pattern the JD's "agentic technologies" requirement refers to.

**Tradeoffs:** More verbose tool definitions and more complex agent orchestration. The agent occasionally calls tools in a suboptimal order. A single prompt would be simpler and more predictable but wouldn't demonstrate tool-use or be as testable.

---

## Decision: Rule-based tool logic over LLM-based

**Context:** Each tool (classify, fraud assessment, etc.) needs execution logic. Could use Claude to generate structured outputs, or use deterministic rule-based logic.

**Options considered:**
1. Rule-based logic with keyword matching and scoring (chosen)
2. LLM-based (have Claude generate the tool outputs too)
3. Hybrid (rules for simple tools, LLM for complex ones)

**Decision:** Rule-based logic for all tools.

**Rationale:** Makes tools pure functions that are deterministic, fast, testable, and free (no API cost per tool call). The agent (Claude) decides WHICH tools to call and interprets RESULTS, but the tools themselves are predictable. This separation also means the demo works without burning API credits for every dashboard data point.

**Tradeoffs:** Rule-based classification is less accurate than LLM-based. Some claims may be misclassified by the keyword matching. In production, the classify and fraud tools would likely use ML models. But for a demo with sample data, deterministic logic ensures consistent, testable results.

---

## Decision: PostHog over Vercel Analytics

**Context:** Need analytics for the project.

**Options considered:**
1. PostHog (chosen)
2. Vercel Analytics
3. Google Analytics 4
4. No analytics

**Decision:** PostHog.

**Rationale:** PostHog supports custom event tracking with properties, funnels, and dashboards. The JD asks for "data-driven decisions" and I need to demonstrate an event taxonomy, analytics plan, and dashboard configuration, not just page view counts. PostHog's event-based model maps directly to the analytics plan. Vercel Analytics is limited to Web Vitals and page views.

**Tradeoffs:** PostHog adds another dependency and requires an account setup. Vercel Analytics is zero-config. But Vercel Analytics can't answer product questions like "what percentage of triaged claims get flagged for fraud?" which is what a PM needs.

---

## Decision: Framing as "triage assistance" not "claims automation"

**Context:** During expert validation, received feedback that no carrier will let AI auto-settle claims.

**Options considered:**
1. "Automated Claims Resolution" (sounds impressive)
2. "Claims Triage Assistant" / "Decision Support" (chosen)
3. "AI Claims Adjuster"

**Decision:** Position as "triage assistance" and "adjuster decision support."

**Rationale:** Insurance industry insiders would immediately flag "automated resolution" as naive. Real claims involve negotiation, documentation, regulatory compliance, and human judgment that AI can't replace. Framing as triage assistance shows domain understanding: the agent pre-processes claims so adjusters get a head start, not a replacement. The escalation logic (high fraud = human review) reinforces this.

**Tradeoffs:** "Automated Claims Resolution" sounds more impressive on a resume. But credibility with an Allstate hiring manager matters more than sounding ambitious. The decision log entry itself demonstrates that I understand this nuance.

---

## Decision: Server components for dashboard, client components for intake

**Context:** Next.js App Router supports both server and client components.

**Options considered:**
1. Dashboard as server component, intake as client component (chosen)
2. Everything as client components
3. Everything as server components with server actions

**Decision:** Dashboard uses server components querying SQLite directly. Intake form and agent chat are client components using `useChat`.

**Rationale:** The dashboard reads data, it doesn't need interactivity. Server components mean zero client-side JavaScript for the dashboard, faster loading, and direct database access without an API layer. The intake form needs client-side state (form fields, streaming chat) so it must be a client component. This split demonstrates understanding of the server/client component model.

**Tradeoffs:** Can't add interactive filtering to the dashboard without converting parts to client components. Acceptable for v1 scope.
