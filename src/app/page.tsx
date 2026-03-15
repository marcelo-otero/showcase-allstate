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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Claims Triage</h1>
        <p className="text-muted-foreground mt-1">
          Submit a claim and watch the AI agent classify, verify coverage,
          screen for fraud, and recommend a resolution path.
        </p>
      </div>

      <div
        className={`grid gap-6 ${hasResults ? "lg:grid-cols-2" : "max-w-2xl"}`}
      >
        <ClaimForm onSubmit={handleSubmit} isProcessing={isLoading} />
        <AgentChat messages={messages} isLoading={isLoading} />
      </div>
    </div>
  );
}
