"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { samplePolicies } from "@/lib/data/sample-policies";
import { sampleClaims } from "@/lib/data/sample-claims";
import { trackEvent } from "@/components/posthog-provider";

interface ClaimFormProps {
  onSubmit: (claim: {
    claimantName: string;
    policyId: string;
    claimType: string;
    dateOfIncident: string;
    description: string;
  }) => void;
  isProcessing: boolean;
}

export function ClaimForm({ onSubmit, isProcessing }: ClaimFormProps) {
  const [claimantName, setClaimantName] = useState("");
  const [policyId, setPolicyId] = useState("");
  const [claimType, setClaimType] = useState("");
  const [dateOfIncident, setDateOfIncident] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimantName || !policyId || !dateOfIncident || !description) return;
    trackEvent("claim_submitted", {
      claimType: claimType || "not_specified",
      policyId,
      hasDescription: description.length > 0,
    });
    onSubmit({ claimantName, policyId, claimType, dateOfIncident, description });
  };

  const loadSampleClaim = (claimId: string | null) => {
    if (!claimId) return;
    const claim = sampleClaims.find((c) => c.id === claimId);
    if (!claim) return;
    trackEvent("sample_claim_loaded", {
      claimId: claim.id,
      claimType: claim.claimType,
      expectedSeverity: claim.expectedSeverity,
    });
    setClaimantName(claim.claimantName);
    setPolicyId(claim.policyId);
    setClaimType(claim.claimType);
    setDateOfIncident(claim.dateOfIncident);
    setDescription(claim.description);
  };

  return (
    <div className="bg-white rounded-xl border border-[#d6dce6] shadow-[0_2px_8px_rgba(14,25,65,0.06)] overflow-hidden">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-base font-semibold tracking-tight text-[#0e1941]">
          Submit a Claim
        </h2>
        <p className="text-sm text-[#5a6578] mt-0.5">
          Enter claim details or load a sample for demo.
        </p>
      </div>

      <div className="px-6 pb-4">
        <div className="bg-[#d9eeff]/40 rounded-lg p-3 border border-[#45bce5]/20">
          <Label className="text-xs font-medium text-[#5a6578] mb-1.5 block">
            Quick start: load a sample claim
          </Label>
          <Select onValueChange={loadSampleClaim}>
            <SelectTrigger className="w-full bg-white" aria-label="Load sample claim">
              <SelectValue placeholder="Select a sample claim..." />
            </SelectTrigger>
            <SelectContent>
              {sampleClaims.map((claim) => (
                <SelectItem key={claim.id} value={claim.id}>
                  <span className="font-mono text-xs text-[#5a6578] mr-1.5">
                    {claim.id}
                  </span>
                  {claim.claimantName}
                  <span className="text-[#5a6578] ml-1">
                    ({claim.claimType}, {claim.expectedSeverity})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-px bg-[#d6dce6] mx-6" />

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="claimantName" className="text-xs font-medium text-[#0e1941]">
              Claimant Name
            </Label>
            <Input
              id="claimantName"
              value={claimantName}
              onChange={(e) => setClaimantName(e.target.value)}
              placeholder="e.g., James Mitchell"
              required
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="policyId" className="text-xs font-medium text-[#0e1941]">
              Policy Number
            </Label>
            <Select value={policyId} onValueChange={(v) => setPolicyId(v ?? "")}>
              <SelectTrigger id="policyId" className="bg-white">
                <SelectValue placeholder="Select policy..." />
              </SelectTrigger>
              <SelectContent>
                {samplePolicies.map((policy) => (
                  <SelectItem key={policy.policyId} value={policy.policyId}>
                    <span className="font-mono text-xs">{policy.policyId}</span>
                    <span className="text-[#5a6578] ml-1">
                      {policy.holderName}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="claimType" className="text-xs font-medium text-[#0e1941]">
              Claim Type
              <span className="text-[#5a6578] font-normal ml-1">
                (optional)
              </span>
            </Label>
            <Select value={claimType} onValueChange={(v) => setClaimType(v ?? "")}>
              <SelectTrigger id="claimType" className="bg-white">
                <SelectValue placeholder="Agent will classify..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="liability">Liability</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dateOfIncident" className="text-xs font-medium text-[#0e1941]">
              Date of Incident
            </Label>
            <Input
              id="dateOfIncident"
              type="date"
              value={dateOfIncident}
              onChange={(e) => setDateOfIncident(e.target.value)}
              required
              className="bg-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-xs font-medium text-[#0e1941]">
            Claim Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the incident in detail..."
            rows={4}
            required
            className="bg-white resize-none"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 font-semibold rounded-full bg-[#ed7766] hover:bg-[#e5624f] text-white shadow-[0_2px_6px_rgba(237,119,102,0.3)] hover:shadow-[0_4px_12px_rgba(237,119,102,0.35)] transition-all"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="32"
                  strokeLinecap="round"
                  className="opacity-25"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="32"
                  strokeDashoffset="24"
                  strokeLinecap="round"
                  className="opacity-75"
                />
              </svg>
              Processing claim...
            </span>
          ) : (
            "Submit Claim for Triage"
          )}
        </Button>
      </form>
    </div>
  );
}
