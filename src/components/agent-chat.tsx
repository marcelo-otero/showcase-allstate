"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  // Tool part type is 'tool-<toolName>', extract the name after 'tool-'
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

function ToolCallCard({ toolData }: { toolData: ToolPartData }) {
  const { toolName, state, input, output } = toolData;

  const toolDisplayNames: Record<string, string> = {
    classifyClaim: "Classify Claim",
    lookupPolicy: "Coverage Verification",
    assessFraud: "Fraud Screening",
    estimateResolution: "Resolution Estimate",
  };

  const toolIcons: Record<string, string> = {
    classifyClaim: "1",
    lookupPolicy: "2",
    assessFraud: "3",
    estimateResolution: "4",
  };

  const isComplete = state === "output-available";
  const displayName = toolDisplayNames[toolName] ?? toolName;
  const stepNumber = toolIcons[toolName] ?? "?";

  return (
    <div className="my-3">
      <div
        className={`border rounded-lg overflow-hidden transition-all ${
          isComplete ? "border-green-200 bg-green-50/50" : "border-blue-200 bg-blue-50/50"
        }`}
      >
        <div className="px-4 py-2.5 flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
              isComplete ? "bg-green-500" : "bg-blue-500 animate-pulse"
            }`}
          >
            {isComplete ? "\u2713" : stepNumber}
          </div>
          <span className="font-medium text-sm">{displayName}</span>
          <Badge
            variant={isComplete ? "secondary" : "outline"}
            className="ml-auto text-xs"
          >
            {isComplete ? "Complete" : "Running..."}
          </Badge>
        </div>

        {isComplete && !!output && (
          <div className="px-4 pb-3 border-t border-green-100">
            <ToolResult toolName={toolName} result={output as Record<string, unknown>} />
          </div>
        )}

        {!isComplete && !!input && (
          <div className="px-4 pb-3 border-t border-blue-100">
            <p className="text-xs text-muted-foreground mt-2">
              Processing with{" "}
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
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Type:</span>{" "}
          <Badge variant="outline">{String(result.claimType)}</Badge>
        </div>
        <div>
          <span className="text-muted-foreground">Severity:</span>{" "}
          <SeverityBadge severity={String(result.severity)} />
        </div>
        <div className="col-span-2">
          <span className="text-muted-foreground">Coverage Area:</span>{" "}
          {String(result.coverageArea)}
        </div>
        {!!result.summary && (
          <div className="col-span-2 text-xs text-muted-foreground">
            {String(result.summary)}
          </div>
        )}
      </div>
    );
  }

  if (toolName === "lookupPolicy") {
    return (
      <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Status:</span>{" "}
          <Badge
            variant={result.isActive ? "secondary" : "destructive"}
          >
            {String(result.policyStatus)}
          </Badge>
        </div>
        <div>
          <span className="text-muted-foreground">Coverage:</span>{" "}
          {String(result.coverageType)}
        </div>
        <div>
          <span className="text-muted-foreground">Deductible:</span> $
          {Number(result.deductible).toLocaleString()}
        </div>
        <div>
          <span className="text-muted-foreground">Limit:</span> $
          {Number(result.coverageLimit).toLocaleString()}
        </div>
      </div>
    );
  }

  if (toolName === "assessFraud") {
    return (
      <div className="mt-2 space-y-2 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">Risk Score:</span>{" "}
          <span className="font-mono font-bold">
            {String(result.riskScore)}/100
          </span>
          <FraudRiskBadge level={String(result.riskLevel)} />
        </div>
        {Array.isArray(result.indicators) && result.indicators.length > 0 && (
          <div>
            <span className="text-muted-foreground text-xs">Indicators:</span>
            <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
              {result.indicators.map((indicator: string, i: number) => (
                <li key={i} className="text-amber-700">
                  {indicator}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (toolName === "estimateResolution") {
    return (
      <div className="mt-2 space-y-2 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground">Resolution:</span>{" "}
          <ResolutionBadge path={String(result.resolutionPath)} />
          <Badge variant="outline" className="text-xs">
            {String(result.confidence)} confidence
          </Badge>
        </div>
        {!!result.estimatedPayout &&
          typeof result.estimatedPayout === "object" && (
            <div>
              <span className="text-muted-foreground">Est. Payout:</span> $
              {Number(
                (result.estimatedPayout as Record<string, number>).min
              ).toLocaleString()}{" "}
              to $
              {Number(
                (result.estimatedPayout as Record<string, number>).max
              ).toLocaleString()}
            </div>
          )}
        {!!result.reasoning && (
          <div className="text-xs text-muted-foreground italic">
            {String(result.reasoning)}
          </div>
        )}
        {Array.isArray(result.nextSteps) && (
          <div>
            <span className="text-muted-foreground text-xs">Next Steps:</span>
            <ol className="list-decimal list-inside text-xs mt-1 space-y-0.5">
              {result.nextSteps.map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
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
  const colors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[severity] ?? "bg-gray-100"}`}
    >
      {severity}
    </span>
  );
}

function FraudRiskBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[level] ?? "bg-gray-100"}`}
    >
      {level} risk
    </span>
  );
}

function ResolutionBadge({ path }: { path: string }) {
  const styles: Record<string, string> = {
    approve: "bg-green-100 text-green-800 border-green-200",
    investigate: "bg-yellow-100 text-yellow-800 border-yellow-200",
    escalate: "bg-red-100 text-red-800 border-red-200",
    deny: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return (
    <span
      className={`px-3 py-1 rounded-md text-sm font-semibold border ${styles[path] ?? "bg-gray-100"}`}
    >
      {path.toUpperCase()}
    </span>
  );
}

export function AgentChat({ messages, isLoading }: AgentChatProps) {
  if (messages.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Agent Triage</CardTitle>
        <p className="text-sm text-muted-foreground">
          Watch the agent process this claim step by step.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {messages
          .filter((m) => m.role === "assistant")
          .map((message) => (
            <div key={message.id}>
              {message.parts.map((part, index) => {
                if (part.type === "text" && part.text) {
                  return (
                    <p
                      key={index}
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                    >
                      {part.text}
                    </p>
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Agent is processing...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
