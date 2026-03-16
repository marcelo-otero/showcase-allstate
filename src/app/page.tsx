import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ClaimPilot | AI Claims Triage Assistant",
  description:
    "AI-powered insurance claims triage that classifies, verifies coverage, screens for fraud, and recommends resolution paths in under 60 seconds. Built by Marcelo Otero.",
  openGraph: {
    title: "ClaimPilot",
    description:
      "AI-powered insurance claims triage that classifies, verifies coverage, screens for fraud, and recommends resolution paths.",
  },
};

/* ---------- Local helper components ---------- */

function SectionHeader({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px flex-1 bg-gradient-to-r from-[#d6dce6] to-transparent" />
        <span className="text-xs font-medium tracking-widest uppercase text-[#5a6578]">
          {label}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-[#d6dce6] to-transparent" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-center text-[#0e1941]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#5a6578] mt-2 text-center max-w-2xl mx-auto text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function MetricCard({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#d6dce6] shadow-[0_2px_8px_rgba(14,25,65,0.06)] p-5 text-center">
      <p
        className={`text-2xl font-bold tracking-tight ${accent ?? "text-[#0e1941]"}`}
      >
        {value}
      </p>
      <p className="text-xs font-medium text-[#5a6578] mt-1 uppercase tracking-wide">
        {label}
      </p>
    </div>
  );
}

function ToolCard({
  step,
  name,
  description,
  outputs,
  color,
  bgColor,
}: {
  step: number;
  name: string;
  description: string;
  outputs: string[];
  color: string;
  bgColor: string;
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${bgColor}`}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${color}`}
        >
          {step}
        </span>
        <span className="font-mono text-sm font-semibold text-[#0e1941]">
          {name}
        </span>
      </div>
      <p className="text-sm text-[#5a6578] mb-3">{description}</p>
      <ul className="space-y-1">
        {outputs.map((output) => (
          <li
            key={output}
            className="text-xs text-[#5a6578] flex items-start gap-1.5"
          >
            <span className="mt-1 w-1 h-1 rounded-full bg-[#5a6578] shrink-0" />
            {output}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DecisionCard({
  title,
  rationale,
  tradeoff,
}: {
  title: string;
  rationale: string;
  tradeoff: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#d6dce6] shadow-[0_2px_8px_rgba(14,25,65,0.06)] p-5">
      <h3 className="font-semibold text-[#0e1941] mb-2">{title}</h3>
      <p className="text-sm text-[#5a6578] mb-3">{rationale}</p>
      <div className="bg-[#d9eeff]/40 rounded-lg px-4 py-3 border border-[#45bce5]/20">
        <p className="text-xs font-medium text-[#0e1941] mb-1">Tradeoff</p>
        <p className="text-xs text-[#5a6578]">{tradeoff}</p>
      </div>
    </div>
  );
}

function JdCard({
  requirement,
  feature,
  fit,
}: {
  requirement: string;
  feature: string;
  fit: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#d6dce6] shadow-[0_2px_8px_rgba(14,25,65,0.06)] p-5">
      <p className="text-xs font-medium tracking-widest uppercase text-[#0033a0] mb-2">
        {requirement}
      </p>
      <p className="text-sm font-medium text-[#0e1941] mb-2">{feature}</p>
      <p className="text-xs text-[#5a6578] leading-relaxed">{fit}</p>
    </div>
  );
}

/* ---------- Page ---------- */

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* ====== 1. HERO ====== */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-[#d6dce6] to-transparent" />
          <span className="text-xs font-medium tracking-widest uppercase text-[#5a6578]">
            Showcase Project
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-[#d6dce6] to-transparent" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-center text-[#0e1941]">
          ClaimPilot
        </h1>
        <p className="text-[#5a6578] mt-3 text-center max-w-2xl mx-auto text-base leading-relaxed">
          I built ClaimPilot to show what AI-powered claims triage could look
          like at{" "}
          <span className="font-medium text-[#0e1941]">Allstate</span>. It&apos;s
          a working prototype where a Claude-powered agent classifies claims,
          verifies coverage, screens for fraud, and recommends next steps. The
          whole triage takes under 60 seconds.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link
            href="/demo"
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-white bg-[#ed7766] hover:bg-[#e5624f] rounded-full shadow-[0_2px_6px_rgba(237,119,102,0.3)] transition-all"
          >
            Try the Demo
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-[#0e1941] bg-white border border-[#d6dce6] hover:bg-[#eef2f7] rounded-full transition-all"
          >
            View Dashboard
          </Link>
        </div>
        <p className="text-xs text-[#5a6578]/70 mt-5 text-center max-w-lg mx-auto">
          This is an independent portfolio project, not affiliated with or
          endorsed by Allstate. Built with sample data only.
        </p>
      </div>

      {/* ====== 2. THE PROBLEM ====== */}
      <section className="mb-16">
        <SectionHeader
          label="The Problem"
          title="Claims Triage Is a Bottleneck"
        />
        <div className="bg-white rounded-xl border border-[#d6dce6] shadow-[0_2px_8px_rgba(14,25,65,0.06)] p-6 mb-6">
          <p className="text-sm text-[#5a6578] leading-relaxed max-w-3xl mx-auto text-center">
            When a customer files a First Notice of Loss, the claim has to be
            classified, the policy verified, fraud indicators checked, and the
            claim routed to the right adjuster. That process typically takes
            24 to 48 hours, and misrouted claims add 5 to 10 days on top of
            that. Allstate processes around 8.4 million claims a year, so even
            small improvements at this stage save real money.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard value="24-48 hrs" label="Current triage time" />
          <MetricCard value="~8.4M / year" label="Allstate claim volume" />
          <MetricCard value="10-12%" label="Loss adjustment expense" />
        </div>
      </section>

      {/* ====== 3. THE APPROACH ====== */}
      <section className="mb-16">
        <SectionHeader
          label="The Approach"
          title="A Multi-Step Agent, Not a Chatbot"
          subtitle="The agent decides which tools to call and in what order, reasons between steps, and adapts based on what it finds. If the policy is expired, it skips fraud assessment and goes straight to denial."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ToolCard
            step={1}
            name="classifyClaim"
            description="Extracts claim type, severity, and key details from the free-text description."
            outputs={[
              "Claim type (auto, home, liability)",
              "Severity level (low to critical)",
              "Coverage area and key facts",
            ]}
            color="bg-[#0033a0]"
            bgColor="bg-[#d9eeff]/60 border-[#0033a0]/20"
          />
          <ToolCard
            step={2}
            name="lookupPolicy"
            description="Checks the policy to verify coverage, deductibles, limits, and status."
            outputs={[
              "Policy status (active, expired, cancelled)",
              "Coverage type and deductible",
              "Policy limits and effective dates",
            ]}
            color="bg-[#0e1941]"
            bgColor="bg-[#eef2f7] border-[#0e1941]/15"
          />
          <ToolCard
            step={3}
            name="assessFraud"
            description="Evaluates fraud risk indicators and returns a risk score with specific red flags."
            outputs={[
              "Risk level (low, medium, high)",
              "Fraud score (0 to 100)",
              "Specific red flags identified",
            ]}
            color="bg-[#ed7766]"
            bgColor="bg-[#fef0ee] border-[#ed7766]/20"
          />
          <ToolCard
            step={4}
            name="estimateResolution"
            description="Recommends a resolution path and estimated payout range."
            outputs={[
              "Resolution path (approve, investigate, escalate, deny)",
              "Estimated payout range",
              "Recommended next steps",
            ]}
            color="bg-[#45bce5]"
            bgColor="bg-[#e8f7fc] border-[#45bce5]/25"
          />
        </div>
      </section>

      {/* ====== 4. ARCHITECTURE ====== */}
      <section className="mb-16">
        <SectionHeader
          label="Architecture"
          title="How It All Connects"
        />
        <div className="bg-white rounded-xl border border-[#d6dce6] shadow-[0_2px_8px_rgba(14,25,65,0.06)] p-6">
          <Image
            src="/diagrams/architecture.webp"
            alt="ClaimPilot system architecture showing the flow from intake form through the Claude agent with 4 specialized tools to the SQLite database and PostHog analytics"
            width={1200}
            height={600}
            className="w-full h-auto"
            priority
          />
          <p className="text-xs text-[#5a6578] text-center mt-4">
            Built with Next.js 16, TypeScript, Vercel AI SDK, Claude API,
            SQLite, and PostHog.{" "}
            <a
              href="/diagrams/agent-workflow.webp"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0033a0] hover:underline"
            >
              View detailed agent workflow diagram
            </a>
          </p>
        </div>
      </section>

      {/* ====== 5. JD MAPPING ====== */}
      <section className="mb-16">
        <SectionHeader
          label="Role Alignment"
          title="Why I Built This for Allstate"
          subtitle="Each piece of ClaimPilot maps directly to a responsibility in the Digital Product Manager JD."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <JdCard
            requirement="Product Direction"
            feature="Product brief with scoped v1 roadmap, success metrics, and explicit non-goals."
            fit="I scoped this the way I'd scope a real product: what's in, what's out, and why. Not just a list of features."
          />
          <JdCard
            requirement="Stakeholder & Demand Management"
            feature="Decision log with 8 documented tradeoffs, each with context, options, and rationale."
            fit="Every entry is a tradeoff I actually had to make. These are the kinds of conversations I'd have with stakeholders at Allstate."
          />
          <JdCard
            requirement="Problem Framing"
            feature="Problem statement grounded in industry data: 24-48 hour triage, 5-10 day misroute delays, ~8.4M claims/year."
            fit="I started with the numbers, not a vague idea. The problem statement connects directly to measurable outcomes."
          />
          <JdCard
            requirement="Data-Driven Decisions"
            feature="Analytics dashboard with live metrics plus PostHog tracking with a documented analytics plan."
            fit="I can walk through what the dashboard shows and explain why each event is tracked. Every metric answers a specific product question."
          />
          <JdCard
            requirement="User Experience"
            feature="Streaming agent chat that shows each tool call as a card with inputs, outputs, and reasoning."
            fit="The UI makes the agent's thinking visible. That's a UX win for users and an auditability requirement for insurance."
          />
          <JdCard
            requirement="AI Innovation"
            feature="Multi-step Claude agent with 4 tools, Zod-validated I/O, and configurable escalation thresholds."
            fit="This isn't a chatbot wrapper. Claude decides which tools to call autonomously, and high fraud risk triggers human review instead of auto-resolving."
          />
        </div>
      </section>

      {/* ====== 6. PM THINKING ====== */}
      <section className="mb-16">
        <SectionHeader
          label="PM Thinking"
          title="Tradeoffs I Made"
          subtitle="I documented 8 decisions during the build. Here are four that shaped the product most."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DecisionCard
            title="Streaming tool-use over prompt chaining"
            rationale="I wanted the agent to be autonomous, not follow a fixed script. With streaming tool-use, Claude decides tool order based on what it finds. If the policy is expired, it skips fraud assessment and goes straight to denial. That's closer to how a real adjuster thinks."
            tradeoff="The UI gets more complex (rendering tool call cards with different states) and it's harder to test deterministically. Prompt chaining would have been faster to build."
          />
          <DecisionCard
            title='"Triage assistance" not "claims automation"'
            rationale="No carrier will let AI auto-settle claims. Real claims involve negotiation, documentation, and regulatory compliance. I framed this as decision support because that's what an Allstate hiring manager would actually want to see, not a naive pitch about replacing adjusters."
            tradeoff="&ldquo;Automated Claims Resolution&rdquo; sounds more impressive on a resume. But credibility matters more than ambition here."
          />
          <DecisionCard
            title="Four separate tools, not one big prompt"
            rationale="Real claims workflows have separate steps handled by different specialists. Splitting into four tools means each one is independently testable (18 unit tests), and the UI can show each step as its own card. You can actually see the agent think."
            tradeoff="More code, more complex orchestration. A single prompt would have been simpler, but it wouldn't demonstrate tool-use and you couldn't test the pieces independently."
          />
          <DecisionCard
            title="Rule-based tool logic, not LLM-generated"
            rationale="The agent (Claude) decides which tools to call and interprets the results. But the tools themselves are deterministic: pure functions, no API cost, fully testable. In production you'd swap in ML models, but the architecture stays the same."
            tradeoff="Less accurate classification than an LLM could do. Worth it for consistent, testable results in a demo."
          />
        </div>
        <p className="text-xs text-[#5a6578] text-center mt-4">
          Full decision log with 8 entries available on{" "}
          <a
            href="https://github.com/marcelo-otero/showcase-allstate"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0033a0] hover:underline"
          >
            GitHub
          </a>
        </p>
      </section>

      {/* ====== 7. KEY RESULTS ====== */}
      <section className="mb-16">
        <SectionHeader
          label="Key Results"
          title="What the Data Shows"
          subtitle="I ran 16 sample claims through the system. Here's what came back."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            value="< 1s"
            label="Avg triage time"
            accent="text-green-700"
          />
          <MetricCard value="13%" label="Fraud flag rate" />
          <MetricCard value="6%" label="Auto-resolution rate" />
          <MetricCard value="18" label="Unit tests passing" />
        </div>
      </section>

      {/* ====== 8. CTA BANNER ====== */}
      <section className="mb-16">
        <div className="bg-[#d9eeff] rounded-xl border border-[#45bce5]/20 p-8 text-center">
          <h2 className="text-2xl font-bold text-[#0e1941] mb-2">
            Try it yourself
          </h2>
          <p className="text-sm text-[#5a6578] mb-6">
            Load a sample claim, hit submit, and watch the agent work through
            it step by step.
          </p>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Link
              href="/demo"
              className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-[#ed7766] hover:bg-[#e5624f] rounded-full shadow-[0_2px_6px_rgba(237,119,102,0.3)] transition-all"
            >
              Submit a Claim
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-[#0e1941] bg-white border border-[#d6dce6] hover:bg-[#eef2f7] rounded-full transition-all"
            >
              View the Dashboard
            </Link>
          </div>
          <p className="text-xs text-[#5a6578]">
            Built with Next.js 16, TypeScript, Claude API, Tailwind CSS,
            shadcn/ui, SQLite, and PostHog.
          </p>
        </div>
      </section>

      {/* ====== 9. BUILT BY ====== */}
      <section className="mb-8">
        <SectionHeader label="Built By" title="Marcelo Otero" />
        <div className="bg-white rounded-xl border border-[#d6dce6] shadow-[0_2px_8px_rgba(14,25,65,0.06)] p-6 max-w-2xl mx-auto text-center">
          <p className="text-sm text-[#5a6578] leading-relaxed mb-4">
            I&apos;m a product manager who builds. At Marriott, I built an AI
            agent that turned Figma mockups and requirements into structured
            Jira stories. At Now Optics, I shipped an order status tool that
            handled 675K+ lookups and cut call center inquiries by 60%.
            ClaimPilot is one of several products I&apos;ve independently
            shipped using Claude Code, Next.js, and AI APIs.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/marcelo-otero/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#0033a0] hover:underline font-medium"
            >
              LinkedIn
            </a>
            <span className="text-[#d6dce6]">|</span>
            <a
              href="https://github.com/marcelo-otero"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#0033a0] hover:underline font-medium"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
