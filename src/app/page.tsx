"use client";

import { useChat } from "@/lib/use-chat";
import { ClaimForm } from "@/components/claim-form";
import { AgentChat } from "@/components/agent-chat";

export default function HomePage() {
  const { messages, append, isLoading, setMessages } = useChat({
    api: "/api/chat",
  });

  const handleSubmit = (claim: {
    claimantName: string;
    policyId: string;
    claimType: string;
    dateOfIncident: string;
    description: string;
  }) => {
    setMessages([]);
    const prompt = `Process this insurance claim:

Claimant: ${claim.claimantName}
Policy Number: ${claim.policyId}
Claim Type: ${claim.claimType || "Not specified"}
Date of Incident: ${claim.dateOfIncident}

Description:
${claim.description}`;

    append({ role: "user", content: prompt });
  };

  const hasResults = messages.some((m: { role: string }) => m.role === "assistant");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-[#d6dce6] to-transparent" />
          <span className="text-xs font-medium tracking-widest uppercase text-[#5a6578]">
            First Notice of Loss
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-[#d6dce6] to-transparent" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-center text-[#0e1941]">
          Claims Triage
        </h1>
        <p className="text-[#5a6578] mt-2 text-center max-w-xl mx-auto text-[15px]">
          Submit a claim and watch the AI agent classify, verify coverage,
          screen for fraud, and recommend a resolution path.
        </p>
      </div>

      <div
        className={`grid gap-8 items-start ${hasResults ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]" : "max-w-xl mx-auto"}`}
      >
        <div className={hasResults ? "lg:sticky lg:top-20" : ""}>
          <ClaimForm onSubmit={handleSubmit} isProcessing={isLoading} />
        </div>
        <AgentChat messages={messages} isLoading={isLoading} />
      </div>
    </div>
  );
}
