import { getDb } from "../src/lib/db/schema";
import { insertClaim, insertTriageResult } from "../src/lib/db/queries";
import { sampleClaims } from "../src/lib/data/sample-claims";
import {
  executeClassifyClaim,
  executeLookupPolicy,
  executeAssessFraud,
  executeEstimateResolution,
} from "../src/lib/agent/tools";
import fs from "fs";
import path from "path";

// Ensure data directory exists
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log("Seeding database...\n");

// Initialize db (creates tables)
getDb();

let seeded = 0;

for (const claim of sampleClaims) {
  console.log(`Processing ${claim.id}: ${claim.claimantName} (${claim.claimType})...`);

  const startTime = performance.now();

  // Insert claim
  insertClaim({
    id: claim.id,
    claimantName: claim.claimantName,
    policyId: claim.policyId,
    claimType: claim.claimType,
    dateOfIncident: claim.dateOfIncident,
    description: claim.description,
  });

  // Run triage tools
  const classification = executeClassifyClaim({
    claimText: claim.description,
    claimType: claim.claimType,
  });

  const policyLookup = executeLookupPolicy({
    policyId: claim.policyId,
  });

  const fraudAssessment = executeAssessFraud({
    claimText: claim.description,
    claimType: classification.claimType,
    severity: classification.severity,
    policyStartDate: policyLookup.startDate,
    dateOfIncident: claim.dateOfIncident,
    coverageLimit: policyLookup.coverageLimit,
  });

  const resolution = executeEstimateResolution({
    claimType: classification.claimType,
    severity: classification.severity,
    coverageArea: classification.coverageArea,
    policyStatus: policyLookup.policyStatus,
    isActive: policyLookup.isActive,
    deductible: policyLookup.deductible,
    coverageLimit: policyLookup.coverageLimit,
    fraudRiskLevel: fraudAssessment.riskLevel,
    fraudIndicators: fraudAssessment.indicators,
    claimSummary: classification.summary,
  });

  const triageTimeMs = Math.round(performance.now() - startTime);

  // Insert triage result
  insertTriageResult({
    id: `TRI-${claim.id}`,
    claimId: claim.id,
    classification,
    policyLookup,
    fraudAssessment,
    resolution,
    triageTimeMs,
  });

  console.log(
    `  -> ${classification.severity} severity, ${fraudAssessment.riskLevel} fraud risk, ${resolution.resolutionPath} (${triageTimeMs}ms)\n`
  );
  seeded++;
}

console.log(`\nSeeded ${seeded} claims with triage results.`);
console.log(`Database: ${path.join(dataDir, "claimpilot.db")}`);
