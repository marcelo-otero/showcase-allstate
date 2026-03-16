"use client";

import { Badge } from "@/components/ui/badge";
import type { UIMessage } from "ai";

interface AgentChatProps {
  messages: UIMessage[];
  isLoading: boolean;
}

interface ToolPartData {
  toolName: string;
  state: string;
  input?: Record<string, unknown>;
  output?: unknown;
}

function extractToolData(part: { type: string; [key: string]: unknown }): ToolPartData {
  const toolPart = part as {
    type: string;
    state: string;
    input?: Record<string, unknown>;
    output?: unknown;
  };
  const toolName = toolPart.type.startsWith("tool-")
    ? toolPart.type.slice(5)
    : toolPart.type;
  return {
    toolName,
    state: toolPart.state,
    input: toolPart.input,
    output: toolPart.output,
  };
}

/** Render markdown-like bold text */
function renderAgentText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

const toolMeta: Record<
  string,
  { label: string; icon: string; step: number; color: string; bgComplete: string; bgRunning: string }
> = {
  classifyClaim: {
    label: "Classify Claim",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    step: 1,
    color: "text-blue-700",
    bgComplete: "bg-blue-50 border-blue-200/80",
    bgRunning: "bg-blue-50/60 border-blue-200/50",
  },
  lookupPolicy: {
    label: "Coverage Verification",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    step: 2,
    color: "text-teal-700",
    bgComplete: "bg-teal-50 border-teal-200/80",
    bgRunning: "bg-teal-50/60 border-teal-200/50",
  },
  assessFraud: {
    label: "Fraud Screening",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    step: 3,
    color: "text-amber-700",
    bgComplete: "bg-amber-50 border-amber-200/80",
    bgRunning: "bg-amber-50/60 border-amber-200/50",
  },
  estimateResolution: {
    label: "Resolution Estimate",
    icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
    step: 4,
    color: "text-violet-700",
    bgComplete: "bg-violet-50 border-violet-200/80",
    bgRunning: "bg-violet-50/60 border-violet-200/50",
  },
};

function ToolCallCard({ toolData }: { toolData: ToolPartData }) {
  const { toolName, state, input, output } = toolData;
  const meta = toolMeta[toolName] ?? {
    label: toolName,
    icon: "",
    step: 0,
    color: "text-gray-700",
    bgComplete: "bg-gray-50 border-gray-200",
    bgRunning: "bg-gray-50/60 border-gray-200/50",
  };
  const isComplete = state === "output-available";

  return (
    <div className="my-3">
      <div
        className={`border rounded-lg overflow-hidden transition-all duration-300 ${
          isComplete ? meta.bgComplete : meta.bgRunning
        }`}
      >
        <div className="px-4 py-2.5 flex items-center gap-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isComplete
                ? "bg-white shadow-sm"
                : "bg-white/60 shadow-sm"
            }`}
          >
            {isComplete ? (
              <svg
                className="w-4 h-4 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <span className={`text-xs font-bold ${meta.color}`}>
                {meta.step}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className={`font-medium text-sm ${meta.color}`}>
              {meta.label}
            </span>
          </div>
          {!isComplete && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">
                Running
              </span>
            </div>
          )}
        </div>

        {isComplete && !!output && (
          <div className="px-4 pb-3 border-t border-inherit">
            <ToolResult
              toolName={toolName}
              result={output as Record<string, unknown>}
            />
          </div>
        )}

        {!isComplete && !!input && (
          <div className="px-4 pb-3 border-t border-inherit">
            <p className="text-xs text-muted-foreground mt-2">
              Analyzing{" "}
              {Object.keys(input)
                .filter((k) => k !== "claimText")
                .join(", ")}
              ...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ToolResult({
  toolName,
  result,
}: {
  toolName: string;
  result: Record<string, unknown>;
}) {
  if (toolName === "classifyClaim") {
    return (
      <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Type</span>
          <span className="font-medium capitalize">
            {String(result.claimType)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Severity</span>
          <SeverityBadge severity={String(result.severity)} />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Coverage</span>
          <span className="text-sm">{String(result.coverageArea)}</span>
        </div>
      </div>
    );
  }

  if (toolName === "lookupPolicy") {
    return (
      <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Status</span>
          <span
            className={`font-medium ${result.isActive ? "text-green-700" : "text-red-700"}`}
          >
            {String(result.policyStatus)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Coverage</span>
          <span className="text-sm">{String(result.coverageType)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Deductible</span>
          <span className="font-mono text-sm">
            ${Number(result.deductible).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Limit</span>
          <span className="font-mono text-sm">
            ${Number(result.coverageLimit).toLocaleString()}
          </span>
        </div>
      </div>
    );
  }

  if (toolName === "assessFraud") {
    const score = Number(result.riskScore);
    return (
      <div className="mt-2.5 space-y-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Score</span>
            <span className="font-mono font-bold text-sm">{score}/100</span>
          </div>
          <FraudRiskBadge level={String(result.riskLevel)} />
        </div>
        {/* Score bar */}
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              score >= 50
                ? "bg-red-500"
                : score >= 25
                  ? "bg-amber-500"
                  : "bg-green-500"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
        {Array.isArray(result.indicators) && result.indicators.length > 0 && (
          <div className="space-y-1">
            {result.indicators.map((indicator: string, i: number) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-amber-800"
              >
                <svg
                  className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01"
                  />
                </svg>
                {indicator}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (toolName === "estimateResolution") {
    return (
      <div className="mt-2.5 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <ResolutionBadge path={String(result.resolutionPath)} />
          <Badge variant="outline" className="text-xs font-normal">
            {String(result.confidence)} confidence
          </Badge>
        </div>
        {!!result.estimatedPayout &&
          typeof result.estimatedPayout === "object" && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground text-xs">
                Est. Payout
              </span>
              <span className="font-mono font-medium">
                ${Number(
                  (result.estimatedPayout as Record<string, number>).min
                ).toLocaleString()}
                {" - "}$
                {Number(
                  (result.estimatedPayout as Record<string, number>).max
                ).toLocaleString()}
              </span>
            </div>
          )}
        {!!result.reasoning && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {String(result.reasoning)}
          </p>
        )}
        {Array.isArray(result.nextSteps) && (
          <div className="space-y-1">
            {result.nextSteps.map((step: string, i: number) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-muted-foreground font-mono shrink-0">
                  {i + 1}.
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <pre className="mt-2 text-xs overflow-auto bg-muted p-2 rounded">
      {JSON.stringify(result, null, 2)}
    </pre>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    low: "bg-green-100 text-green-800 ring-green-600/20",
    medium: "bg-yellow-100 text-yellow-800 ring-yellow-600/20",
    high: "bg-orange-100 text-orange-800 ring-orange-600/20",
    critical: "bg-red-100 text-red-800 ring-red-600/20",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${styles[severity] ?? "bg-gray-100 ring-gray-600/20"}`}
    >
      {severity}
    </span>
  );
}

function FraudRiskBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    low: "bg-green-100 text-green-800 ring-green-600/20",
    medium: "bg-amber-100 text-amber-800 ring-amber-600/20",
    high: "bg-red-100 text-red-800 ring-red-600/20",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-xs font-medium ring-1 ring-inset ${styles[level] ?? "bg-gray-100 ring-gray-600/20"}`}
    >
      {level} risk
    </span>
  );
}

function ResolutionBadge({ path }: { path: string }) {
  const styles: Record<string, string> = {
    approve:
      "bg-green-600 text-white shadow-sm shadow-green-600/25",
    investigate:
      "bg-amber-500 text-white shadow-sm shadow-amber-500/25",
    escalate:
      "bg-red-600 text-white shadow-sm shadow-red-600/25",
    deny: "bg-gray-700 text-white shadow-sm shadow-gray-700/25",
  };
  return (
    <span
      className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide uppercase ${styles[path] ?? "bg-gray-500 text-white"}`}
    >
      {path}
    </span>
  );
}

export function AgentChat({ messages, isLoading }: AgentChatProps) {
  if (messages.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden">
      <div className="px-6 pt-6 pb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <h2 className="text-base font-semibold tracking-tight">
            Agent Triage
          </h2>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          Processing claim through 4-step triage pipeline.
        </p>
      </div>
      <div className="px-6 py-5 space-y-1 max-h-[75vh] overflow-y-auto">
        {messages
          .filter((m) => m.role === "assistant")
          .map((message) => (
            <div key={message.id}>
              {message.parts.map((part, index) => {
                if (part.type === "text" && part.text) {
                  return (
                    <div
                      key={index}
                      className="agent-prose text-sm leading-relaxed text-foreground/80 my-2"
                    >
                      {part.text.split("\n").map((line, li) => {
                        if (!line.trim()) return null;
                        // Render headings (##, ###, ####)
                        const headingMatch = line.match(/^(#{2,4})\s+(.+)/);
                        if (headingMatch) {
                          return (
                            <h3
                              key={li}
                              className="text-sm font-semibold text-foreground mt-4 mb-1"
                            >
                              {renderAgentText(headingMatch[2])}
                            </h3>
                          );
                        }
                        // Render list items (numbered)
                        if (/^\d+\.\s/.test(line)) {
                          return (
                            <div
                              key={li}
                              className="flex items-start gap-2 text-sm ml-1 my-0.5"
                            >
                              <span className="text-muted-foreground font-mono text-xs mt-0.5 shrink-0">
                                {line.match(/^\d+/)?.[0]}.
                              </span>
                              <span>
                                {renderAgentText(
                                  line.replace(/^\d+\.\s*/, "")
                                )}
                              </span>
                            </div>
                          );
                        }
                        if (line.startsWith("- ") || line.startsWith("* ")) {
                          return (
                            <div
                              key={li}
                              className="flex items-start gap-2 text-sm ml-1 my-0.5"
                            >
                              <span className="text-muted-foreground mt-1.5 shrink-0 w-1 h-1 rounded-full bg-muted-foreground/40" />
                              <span>
                                {renderAgentText(line.slice(2))}
                              </span>
                            </div>
                          );
                        }
                        return (
                          <p key={li} className="my-1">
                            {renderAgentText(line)}
                          </p>
                        );
                      })}
                    </div>
                  );
                }
                if (part.type.startsWith("tool-")) {
                  const toolData = extractToolData(part);
                  return <ToolCallCard key={index} toolData={toolData} />;
                }
                return null;
              })}
            </div>
          ))}
        {isLoading && (
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground py-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
            </div>
            Agent is processing...
          </div>
        )}
      </div>
    </div>
  );
}
