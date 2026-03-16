# ClaimPilot Decision Log

Tradeoffs I made during the ClaimPilot build. Each one shaped the product in a meaningful way.

---

## Decision: Streaming tool-use over prompt chaining

**Context:** I had to decide how the agent calls its 4 tools. The straightforward approach is prompt chaining: call Claude 4 times in sequence, passing each output to the next call. The alternative is a single multi-step `streamText` call where Claude decides which tools to call and in what order.

**Options considered:**
1. Prompt chaining (4 separate API calls)
2. Single multi-step tool-use with streaming
3. Single prompt with all logic embedded (no tools)

**Decision:** Multi-step tool-use with streaming.

**Rationale:** I wanted the agent to actually be autonomous, not follow a fixed script. With streaming tool-use, Claude adapts based on what it finds. If the policy is expired, it skips fraud assessment and goes straight to denial. That's closer to how a real adjuster thinks, and it's the "agentic" pattern the role is about.

**Tradeoffs:** The UI got significantly more complex. I had to build tool call cards with running/complete states, handle partial streaming, and accept that I can't write deterministic tests against agent behavior. Prompt chaining would have taken half the time to build.

---

## Decision: SQLite over a cloud database

**Context:** I needed somewhere to store claims and triage results for the dashboard. The question was whether to use a local database or a hosted one.

**Options considered:**
1. SQLite via better-sqlite3
2. Turso (SQLite at the edge)
3. PostgreSQL on Supabase or Neon
4. In-memory only

**Decision:** SQLite with a local file, seeded at build time.

**Rationale:** For a demo, SQLite gives me real SQL queries, JSON functions for storing triage results, and zero external dependencies. The dashboard queries it directly as a server component. No API layer, no connection pooling, no credentials to manage.

**Tradeoffs:** SQLite won't persist writes on Vercel's serverless functions between invocations. New claims submitted on the live site disappear after the function cold-starts. I accepted that: the dashboard is always pre-populated with sample data from the build step. If I needed persistence, Turso would be the upgrade path (same SQL, edge-hosted).

---

## Decision: Vercel AI SDK over raw Claude API calls

**Context:** I needed to decide how to integrate Claude. The Anthropic SDK gives full control. The Vercel AI SDK wraps it with streaming, tool-use, and React hooks built in.

**Options considered:**
1. Vercel AI SDK (`ai` + `@ai-sdk/anthropic`)
2. Anthropic SDK (`@anthropic-ai/sdk`) directly
3. LangChain

**Decision:** Vercel AI SDK.

**Rationale:** It handles the hard parts: streaming multi-step tool calls, parsing tool results, and managing message state on the client. I would have spent days building that plumbing with the raw SDK. Switching models later is a one-line change.

**Tradeoffs:** I ran into a real issue here. The AI SDK v6 changed how `useChat` works, and the docs were out of date. I ended up writing a custom `useChat` hook to handle the new response format. That wouldn't have happened with the Anthropic SDK directly. The abstraction saved time overall, but it cost me a few hours debugging a breaking change.

---

## Decision: Four separate tools, not one big prompt

**Context:** I could give Claude a single prompt that does classification, policy lookup, fraud assessment, and resolution in one shot. Or I could split them into 4 separate tools with their own schemas.

**Options considered:**
1. 4 separate tools with Zod schemas
2. Single comprehensive prompt
3. 2 combined tools (classify+lookup, fraud+resolution)

**Decision:** 4 separate tools.

**Rationale:** Real claims workflows have separate steps handled by different specialists. Splitting into 4 tools means each one is independently testable (18 unit tests), and the UI can show each step as its own card. You can actually watch the agent work through the claim step by step.

**Tradeoffs:** More code, more complex orchestration. The agent occasionally calls tools in a weird order (once it tried to assess fraud before classifying the claim). A single prompt would have been simpler and more predictable, but you'd lose the transparency and testability.

---

## Decision: Rule-based tool logic, not LLM-generated

**Context:** Each tool needs execution logic. I could have Claude generate the outputs (more accurate) or use deterministic rules (more testable).

**Options considered:**
1. Rule-based logic with keyword matching and scoring
2. LLM-based (Claude generates tool outputs too)
3. Hybrid approach

**Decision:** Rule-based for all tools.

**Rationale:** The agent (Claude) decides which tools to call and interprets the results. But the tools themselves are pure functions: deterministic, fast, free, and fully testable. I didn't want every dashboard data point to cost API credits, and I didn't want tests that pass or fail based on Claude's mood.

**Tradeoffs:** The keyword-based classification isn't great. It sometimes misclassifies ambiguous claims. In production, you'd swap in ML models for classification and fraud scoring, but the architecture wouldn't change. For a demo with curated sample data, deterministic logic was the right call.

---

## Decision: PostHog over Vercel Analytics

**Context:** I wanted analytics that could answer real product questions, not just "how many page views did I get."

**Options considered:**
1. PostHog
2. Vercel Analytics
3. Google Analytics 4
4. Skip analytics entirely

**Decision:** PostHog.

**Rationale:** Vercel Analytics gives you Web Vitals and page views. That's useful but it can't tell me what percentage of claims get flagged for fraud, or how long the average triage takes. PostHog lets me define custom events with properties, build funnels, and create dashboards that answer specific product questions.

**Tradeoffs:** Another dependency, another account to set up. Vercel Analytics is literally zero-config. But for a PM role, showing that I can design an event taxonomy and tie it to success metrics matters more than simplicity.

---

## Decision: Framing as "triage assistance" not "claims automation"

**Context:** Early on I was calling this "Automated Claims Resolution." During expert validation, I got pushback: no carrier will let AI auto-settle claims. It involves negotiation, documentation, regulatory compliance, and judgment calls that AI can't handle.

**Options considered:**
1. "Automated Claims Resolution"
2. "Claims Triage Assistant" / decision support
3. "AI Claims Adjuster"

**Decision:** Position as triage assistance and adjuster decision support.

**Rationale:** "Automated resolution" would be the first thing an insurance insider flags as naive. The agent pre-processes claims so adjusters get a head start, not a replacement. The escalation logic reinforces this: high fraud risk always goes to human review, never auto-resolves.

**Tradeoffs:** "Automated Claims Resolution" sounds more impressive in a headline. But I'd rather show that I understand the domain than oversell what AI can do.

---

## Decision: Server components for dashboard, client components for intake

**Context:** Next.js App Router lets you choose between server and client components per page. I had to decide the split.

**Options considered:**
1. Dashboard as server component, intake/chat as client components
2. Everything as client components
3. Everything as server components with server actions

**Decision:** Dashboard is a server component. Intake form and agent chat are client components.

**Rationale:** The dashboard just reads data. There's no reason to ship JavaScript to the browser for it. It queries SQLite directly, renders on the server, and sends HTML. The intake form and agent chat need client-side state (form fields, streaming responses) so they have to be client components.

**Tradeoffs:** I can't add interactive filtering or sorting to the dashboard without converting parts to client components. That's fine for v1.
