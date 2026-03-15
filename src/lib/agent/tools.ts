import { tool } from "ai";
import { z } from "zod";
import { samplePolicies } from "@/lib/data/sample-policies";

// --- classifyClaim ---

const classifyClaimParams = z.object({
  claimText: z.string().describe("Raw claim description from the user"),
  claimType: z
    .enum(["auto", "home", "liability"])
    .optional()
    .describe("Optional user-provided claim type hint"),
});

export type ClassifyClaimResult = {
  claimType: "auto" | "home" | "liability" | "health";
  severity: "low" | "medium" | "high" | "critical";
  coverageArea: string;
  keyDetails: string[];
  summary: string;
};

function executeClassifyClaim(params: {
  claimText: string;
  claimType?: "auto" | "home" | "liability";
}): ClassifyClaimResult {
  const text = params.claimText.toLowerCase();

  // Determine claim type
  let claimType: ClassifyClaimResult["claimType"] = params.claimType ?? "auto";
  if (!params.claimType) {
    if (
      text.includes("vehicle") ||
      text.includes("car") ||
      text.includes("accident") ||
      text.includes("collision") ||
      text.includes("rear-ended") ||
      text.includes("driving") ||
      text.includes("parked") ||
      text.includes("towed")
    ) {
      claimType = "auto";
    } else if (
      text.includes("home") ||
      text.includes("house") ||
      text.includes("roof") ||
      text.includes("pipe") ||
      text.includes("kitchen") ||
      text.includes("garage") ||
      text.includes("foundation") ||
      text.includes("basement")
    ) {
      claimType = "home";
    } else if (
      text.includes("slipped") ||
      text.includes("fell") ||
      text.includes("injury") ||
      text.includes("customer") ||
      text.includes("tenant") ||
      text.includes("ceiling")
    ) {
      claimType = "liability";
    }
  }

  // Determine severity
  let severity: ClassifyClaimResult["severity"] = "low";
  let severityScore = 0;

  if (
    text.includes("total") ||
    text.includes("totaled") ||
    text.includes("destroyed")
  )
    severityScore += 3;
  if (text.includes("fire") || text.includes("caught fire")) severityScore += 3;
  if (text.includes("hospitalized") || text.includes("er ") || text.includes("emergency"))
    severityScore += 3;
  if (text.includes("concussion") || text.includes("laceration"))
    severityScore += 2;
  if (text.includes("multi") || text.includes("multiple")) severityScore += 2;
  if (text.includes("structural") || text.includes("foundation"))
    severityScore += 2;
  if (
    text.includes("mold") ||
    text.includes("smoke damage") ||
    text.includes("water damage")
  )
    severityScore += 2;
  if (text.includes("injury") || text.includes("pain")) severityScore += 1;
  if (text.includes("stolen") || text.includes("theft") || text.includes("break-in"))
    severityScore += 1;
  if (text.includes("dent") || text.includes("scratch") || text.includes("minor"))
    severityScore += 0;

  if (severityScore >= 7) severity = "critical";
  else if (severityScore >= 4) severity = "high";
  else if (severityScore >= 1) severity = "medium";
  else severity = "low";

  // Determine coverage area
  let coverageArea = "general";
  if (text.includes("collision") || text.includes("rear-ended") || text.includes("hit"))
    coverageArea = "collision";
  else if (text.includes("hail") || text.includes("storm") || text.includes("weather"))
    coverageArea = "comprehensive (weather)";
  else if (text.includes("theft") || text.includes("stolen") || text.includes("break-in"))
    coverageArea = "theft";
  else if (text.includes("fire")) coverageArea = "fire";
  else if (text.includes("water") || text.includes("pipe") || text.includes("flood"))
    coverageArea = "water damage";
  else if (text.includes("wind") || text.includes("tree") || text.includes("branch"))
    coverageArea = "windstorm";
  else if (text.includes("slip") || text.includes("fell") || text.includes("fall"))
    coverageArea = "bodily injury";
  else if (text.includes("ceiling") || text.includes("falling"))
    coverageArea = "falling objects";
  else if (text.includes("foundation") || text.includes("settling"))
    coverageArea = "earth movement / settling";

  // Extract key details
  const keyDetails: string[] = [];
  const dollarMatch = text.match(/\$[\d,]+/g);
  if (dollarMatch) keyDetails.push(`Amounts mentioned: ${dollarMatch.join(", ")}`);

  const policeMatch = text.match(
    /(?:police report|case|incident)[^.]*#[^.]+/gi
  );
  if (policeMatch) keyDetails.push(`Police/incident report: ${policeMatch[0]}`);

  if (text.includes("no injur") || text.includes("no one was"))
    keyDetails.push("No injuries reported");
  if (text.includes("injury") || text.includes("pain") || text.includes("er "))
    keyDetails.push("Injuries reported");
  if (text.includes("towed")) keyDetails.push("Vehicle towed");
  if (text.includes("hotel") || text.includes("staying"))
    keyDetails.push("Displaced from home");
  if (text.includes("witness")) keyDetails.push("Witnesses present");
  if (text.includes("no witness")) keyDetails.push("No witnesses");
  if (text.includes("camera") || text.includes("footage") || text.includes("cctv"))
    keyDetails.push("Video/photo evidence available");

  // Generate summary
  const summary = `${severity.charAt(0).toUpperCase() + severity.slice(1)}-severity ${claimType} claim involving ${coverageArea}. ${keyDetails.length > 0 ? keyDetails[0] + "." : ""}`;

  return { claimType, severity, coverageArea, keyDetails, summary };
}

// --- lookupPolicy ---

const lookupPolicyParams = z.object({
  policyId: z.string().describe("Policy number from the submission"),
});

export type LookupPolicyResult = {
  policyStatus: "active" | "expired" | "cancelled" | "not_found";
  coverageType: string;
  deductible: number;
  coverageLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  coveredPerils: string[];
};

function executeLookupPolicy(params: {
  policyId: string;
}): LookupPolicyResult {
  const policy = samplePolicies.find((p) => p.policyId === params.policyId);

  if (!policy) {
    return {
      policyStatus: "not_found",
      coverageType: "unknown",
      deductible: 0,
      coverageLimit: 0,
      startDate: "",
      endDate: "",
      isActive: false,
      coveredPerils: [],
    };
  }

  return {
    policyStatus: policy.policyStatus,
    coverageType: policy.coverageType,
    deductible: policy.deductible,
    coverageLimit: policy.coverageLimit,
    startDate: policy.startDate,
    endDate: policy.endDate,
    isActive: policy.policyStatus === "active",
    coveredPerils: policy.coveredPerils,
  };
}

// --- assessFraud ---

const assessFraudParams = z.object({
  claimText: z.string().describe("Raw claim description"),
  claimType: z.string().describe("From classifyClaim output"),
  severity: z.string().describe("From classifyClaim output"),
  policyStartDate: z.string().describe("From lookupPolicy output"),
  dateOfIncident: z.string().describe("Date the incident occurred"),
  coverageLimit: z.number().describe("From lookupPolicy output"),
});

export type AssessFraudResult = {
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  indicators: string[];
  recommendation: string;
};

function executeAssessFraud(params: {
  claimText: string;
  claimType: string;
  severity: string;
  policyStartDate: string;
  dateOfIncident: string;
  coverageLimit: number;
}): AssessFraudResult {
  const text = params.claimText.toLowerCase();
  const indicators: string[] = [];
  let riskScore = 0;

  // Check for new policy (claim shortly after inception)
  if (params.policyStartDate && params.dateOfIncident) {
    const policyStart = new Date(params.policyStartDate);
    const incident = new Date(params.dateOfIncident);
    const daysSinceInception = Math.floor(
      (incident.getTime() - policyStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceInception < 30 && daysSinceInception >= 0) {
      riskScore += 25;
      indicators.push(
        `Claim filed ${daysSinceInception} days after policy inception (less than 30 days)`
      );
    } else if (daysSinceInception < 90 && daysSinceInception >= 0) {
      riskScore += 10;
      indicators.push(
        `Claim filed ${daysSinceInception} days after policy inception (less than 90 days)`
      );
    }
  }

  // Check for claim amount near coverage limit
  const dollarMatches = text.match(/\$[\d,]+/g);
  if (dollarMatches && params.coverageLimit > 0) {
    const amounts = dollarMatches.map((m) =>
      parseInt(m.replace(/[$,]/g, ""), 10)
    );
    const maxAmount = Math.max(...amounts);
    if (maxAmount >= params.coverageLimit * 0.8) {
      riskScore += 20;
      indicators.push(
        `Claimed amount ($${maxAmount.toLocaleString()}) is near coverage limit ($${params.coverageLimit.toLocaleString()})`
      );
    }
  }

  // Check for no witnesses
  if (text.includes("no witness")) {
    riskScore += 10;
    indicators.push("No witnesses to the incident");
  }

  // Check for urgency / pressure to pay immediately
  if (text.includes("immediately") || text.includes("right away") || text.includes("urgent")) {
    riskScore += 15;
    indicators.push("Claimant pressuring for immediate payment");
  }

  // Check for inconsistencies
  if (text.includes("total") && text.includes("minor")) {
    riskScore += 15;
    indicators.push(
      "Inconsistent description: claims both total loss and minor damage"
    );
  }

  // Vehicle at family/friend shop
  if (text.includes("cousin") || text.includes("friend") || text.includes("brother")) {
    if (text.includes("shop") || text.includes("repair") || text.includes("assessment")) {
      riskScore += 15;
      indicators.push(
        "Vehicle assessed at a shop owned by a family member or friend"
      );
    }
  }

  // No forced entry for theft
  if (text.includes("no sign") && (text.includes("entry") || text.includes("forced"))) {
    riskScore += 15;
    indicators.push("Theft claim with no signs of forced entry");
  }

  // No alarm triggered
  if (text.includes("without triggering") || text.includes("alarm") && text.includes("didn")) {
    riskScore += 10;
    indicators.push("Security alarm not triggered during alleged break-in");
  }

  // Excessive value without documentation
  if (text.includes("no receipt") || text.includes("don't have receipt")) {
    riskScore += 10;
    indicators.push("No receipts or documentation for claimed items");
  }

  // High-value items
  if (dollarMatches) {
    const amounts = dollarMatches.map((m) =>
      parseInt(m.replace(/[$,]/g, ""), 10)
    );
    const totalClaimed = amounts.reduce((sum, a) => sum + a, 0);
    if (totalClaimed > 100000) {
      riskScore += 10;
      indicators.push(
        `High total claimed value: $${totalClaimed.toLocaleString()}`
      );
    }
  }

  // Cap at 100
  riskScore = Math.min(riskScore, 100);

  let riskLevel: AssessFraudResult["riskLevel"] = "low";
  if (riskScore >= 50) riskLevel = "high";
  else if (riskScore >= 25) riskLevel = "medium";

  let recommendation: string;
  if (riskLevel === "high") {
    recommendation =
      "Multiple fraud indicators detected. Recommend referral to Special Investigations Unit (SIU) for detailed review before proceeding with the claim.";
  } else if (riskLevel === "medium") {
    recommendation =
      "Some indicators warrant additional scrutiny. Recommend adjuster verify key details before approving.";
  } else {
    recommendation =
      "No significant fraud indicators detected. Claim appears straightforward.";
  }

  return { riskScore, riskLevel, indicators, recommendation };
}

// --- estimateResolution ---

const estimateResolutionParams = z.object({
  claimType: z.string().describe("From classifyClaim"),
  severity: z.string().describe("From classifyClaim"),
  coverageArea: z.string().describe("From classifyClaim"),
  policyStatus: z.string().describe("From lookupPolicy"),
  isActive: z.boolean().describe("From lookupPolicy"),
  deductible: z.number().describe("From lookupPolicy"),
  coverageLimit: z.number().describe("From lookupPolicy"),
  fraudRiskLevel: z.string().describe("From assessFraud"),
  fraudIndicators: z.array(z.string()).describe("From assessFraud"),
  claimSummary: z.string().describe("From classifyClaim"),
});

export type EstimateResolutionResult = {
  resolutionPath: "approve" | "investigate" | "escalate" | "deny";
  estimatedPayout: { min: number; max: number };
  confidence: "high" | "medium" | "low";
  reasoning: string;
  nextSteps: string[];
};

function executeEstimateResolution(params: {
  claimType: string;
  severity: string;
  coverageArea: string;
  policyStatus: string;
  isActive: boolean;
  deductible: number;
  coverageLimit: number;
  fraudRiskLevel: string;
  fraudIndicators: string[];
  claimSummary: string;
}): EstimateResolutionResult {
  // Deny path: policy issues
  if (!params.isActive || params.policyStatus === "not_found") {
    const reason =
      params.policyStatus === "not_found"
        ? "Policy not found in system"
        : `Policy is ${params.policyStatus}`;
    return {
      resolutionPath: "deny",
      estimatedPayout: { min: 0, max: 0 },
      confidence: "high",
      reasoning: `${reason}. Cannot proceed with claim processing without an active policy.`,
      nextSteps: [
        "Notify claimant that their policy is not active",
        "Advise claimant to verify their policy number",
        "If policy was recently cancelled, check for grace period provisions",
      ],
    };
  }

  // Escalate path: high fraud or critical severity
  if (params.fraudRiskLevel === "high") {
    return {
      resolutionPath: "escalate",
      estimatedPayout: { min: 0, max: params.coverageLimit },
      confidence: "low",
      reasoning: `High fraud risk detected with ${params.fraudIndicators.length} indicator(s). This claim requires Special Investigations Unit (SIU) review before any payout determination.`,
      nextSteps: [
        "Refer to SIU for investigation",
        "Request additional documentation from claimant",
        "Preserve all evidence and communications",
        "Do not discuss fraud concerns with claimant",
      ],
    };
  }

  if (params.severity === "critical") {
    const maxPayout = Math.min(params.coverageLimit, params.coverageLimit * 0.9);
    return {
      resolutionPath: "escalate",
      estimatedPayout: {
        min: params.coverageLimit * 0.3,
        max: maxPayout,
      },
      confidence: "low",
      reasoning: `Critical-severity claim involving ${params.coverageArea}. The complexity and potential payout require senior adjuster review and likely on-site or detailed inspection.`,
      nextSteps: [
        "Assign to senior adjuster with relevant specialization",
        "Schedule inspection or request detailed documentation",
        "Check for subrogation potential",
        "Contact claimant to acknowledge claim and set expectations",
        "If bodily injury involved, coordinate with medical review",
      ],
    };
  }

  // Investigate path: medium fraud or high severity
  if (params.fraudRiskLevel === "medium" || params.severity === "high") {
    const payoutMultiplier =
      params.severity === "high" ? { min: 0.2, max: 0.6 } : { min: 0.1, max: 0.4 };
    return {
      resolutionPath: "investigate",
      estimatedPayout: {
        min: Math.max(
          params.deductible,
          params.coverageLimit * payoutMultiplier.min
        ),
        max: params.coverageLimit * payoutMultiplier.max,
      },
      confidence: "medium",
      reasoning: `${params.severity === "high" ? "High severity" : "Medium fraud risk"} claim involving ${params.coverageArea}. Requires adjuster review to verify details and determine appropriate payout.`,
      nextSteps: [
        "Assign to adjuster for review",
        "Request supporting documentation (photos, receipts, reports)",
        "Verify details against police/incident reports",
        params.fraudRiskLevel === "medium"
          ? "Address specific fraud indicators during investigation"
          : "Standard investigation protocol",
      ],
    };
  }

  // Approve path: low severity + low fraud + active policy
  const basePayouts: Record<string, { min: number; max: number }> = {
    auto: { min: 500, max: 5000 },
    home: { min: 1000, max: 8000 },
    liability: { min: 2000, max: 15000 },
  };

  const base = basePayouts[params.claimType] ?? { min: 500, max: 5000 };
  const adjustedMin = Math.max(params.deductible, base.min);
  const adjustedMax = Math.min(params.coverageLimit, base.max);

  return {
    resolutionPath: "approve",
    estimatedPayout: { min: adjustedMin, max: adjustedMax },
    confidence: "high",
    reasoning: `Low-complexity ${params.claimType} claim with active policy, clear coverage, and no fraud indicators. Suitable for straight-through processing (STP).`,
    nextSteps: [
      "Process payout within standard STP timeline",
      `Apply deductible of $${params.deductible.toLocaleString()}`,
      "Send settlement offer to claimant",
      "Close claim after payment confirmation",
    ],
  };
}

// --- Tool exports for Vercel AI SDK ---

export const classifyClaim = tool({
  description:
    "Classify an insurance claim by analyzing the free-text description. Extracts claim type, severity level, coverage area, and key details.",
  inputSchema: classifyClaimParams,
  execute: async (params: z.infer<typeof classifyClaimParams>) =>
    executeClassifyClaim(params),
});

export const lookupPolicy = tool({
  description:
    "Look up an insurance policy by ID to verify coverage status, type, deductible, limits, and covered perils.",
  inputSchema: lookupPolicyParams,
  execute: async (params: z.infer<typeof lookupPolicyParams>) =>
    executeLookupPolicy(params),
});

export const assessFraud = tool({
  description:
    "Screen a claim for potential fraud indicators by analyzing claim details, policy timing, and red flag patterns.",
  inputSchema: assessFraudParams,
  execute: async (params: z.infer<typeof assessFraudParams>) =>
    executeAssessFraud(params),
});

export const estimateResolution = tool({
  description:
    "Recommend a resolution path (approve, investigate, escalate, or deny) with estimated payout range based on all prior analysis.",
  inputSchema: estimateResolutionParams,
  execute: async (params: z.infer<typeof estimateResolutionParams>) =>
    executeEstimateResolution(params),
});

// Export execute functions for testing
export {
  executeClassifyClaim,
  executeLookupPolicy,
  executeAssessFraud,
  executeEstimateResolution,
};
