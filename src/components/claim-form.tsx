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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { samplePolicies } from "@/lib/data/sample-policies";
import { sampleClaims } from "@/lib/data/sample-claims";

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
    onSubmit({ claimantName, policyId, claimType, dateOfIncident, description });
  };

  const loadSampleClaim = (claimId: string | null) => {
    if (!claimId) return;
    const claim = sampleClaims.find((c) => c.id === claimId);
    if (!claim) return;
    setClaimantName(claim.claimantName);
    setPolicyId(claim.policyId);
    setClaimType(claim.claimType);
    setDateOfIncident(claim.dateOfIncident);
    setDescription(claim.description);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Submit a Claim (FNOL)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter claim details below or load a sample claim for demo purposes.
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Load sample claim
          </Label>
          <Select onValueChange={loadSampleClaim}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a sample claim..." />
            </SelectTrigger>
            <SelectContent>
              {sampleClaims.map((claim) => (
                <SelectItem key={claim.id} value={claim.id}>
                  {claim.id} - {claim.claimantName} ({claim.claimType},{" "}
                  {claim.expectedSeverity})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <hr className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="claimantName">Claimant Name</Label>
              <Input
                id="claimantName"
                value={claimantName}
                onChange={(e) => setClaimantName(e.target.value)}
                placeholder="e.g., James Mitchell"
                required
              />
            </div>
            <div>
              <Label htmlFor="policyId">Policy Number</Label>
              <Select value={policyId} onValueChange={(v) => setPolicyId(v ?? "")}>
                <SelectTrigger id="policyId">
                  <SelectValue placeholder="Select policy..." />
                </SelectTrigger>
                <SelectContent>
                  {samplePolicies.map((policy) => (
                    <SelectItem key={policy.policyId} value={policy.policyId}>
                      {policy.policyId} - {policy.holderName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="claimType">Claim Type (optional)</Label>
              <Select value={claimType} onValueChange={(v) => setClaimType(v ?? "")}>
                <SelectTrigger id="claimType">
                  <SelectValue placeholder="Agent will classify..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="liability">Liability</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dateOfIncident">Date of Incident</Label>
              <Input
                id="dateOfIncident"
                type="date"
                value={dateOfIncident}
                onChange={(e) => setDateOfIncident(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Claim Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened in detail..."
              rows={5}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Submit Claim for Triage"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
