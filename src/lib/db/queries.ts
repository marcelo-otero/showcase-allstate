import { getDb } from "./schema";
import type {
  ClassifyClaimResult,
  LookupPolicyResult,
  AssessFraudResult,
  EstimateResolutionResult,
} from "@/lib/agent/tools";

export interface ClaimRow {
  id: string;
  claimant_name: string;
  policy_id: string;
  claim_type: string;
  severity: string | null;
  date_of_incident: string;
  description: string;
  status: string;
  created_at: string;
}

export interface TriageResultRow {
  id: string;
  claim_id: string;
  classification: string;
  policy_lookup: string;
  fraud_assessment: string;
  resolution: string;
  triage_time_ms: number;
  created_at: string;
}

export function insertClaim(claim: {
  id: string;
  claimantName: string;
  policyId: string;
  claimType: string;
  severity?: string;
  dateOfIncident: string;
  description: string;
}): void {
  const db = getDb();
  db.prepare(
    `INSERT OR REPLACE INTO claims (id, claimant_name, policy_id, claim_type, severity, date_of_incident, description)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    claim.id,
    claim.claimantName,
    claim.policyId,
    claim.claimType,
    claim.severity ?? null,
    claim.dateOfIncident,
    claim.description
  );
}

export function insertTriageResult(result: {
  id: string;
  claimId: string;
  classification: ClassifyClaimResult;
  policyLookup: LookupPolicyResult;
  fraudAssessment: AssessFraudResult;
  resolution: EstimateResolutionResult;
  triageTimeMs: number;
}): void {
  const db = getDb();
  db.prepare(
    `INSERT OR REPLACE INTO triage_results (id, claim_id, classification, policy_lookup, fraud_assessment, resolution, triage_time_ms)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    result.id,
    result.claimId,
    JSON.stringify(result.classification),
    JSON.stringify(result.policyLookup),
    JSON.stringify(result.fraudAssessment),
    JSON.stringify(result.resolution),
    result.triageTimeMs
  );

  db.prepare(`UPDATE claims SET status = 'triaged', severity = ? WHERE id = ?`).run(
    result.classification.severity,
    result.claimId
  );
}

export function getRecentClaims(limit = 50): ClaimRow[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM claims ORDER BY created_at DESC LIMIT ?`
    )
    .all(limit) as ClaimRow[];
}

export function getClaimById(id: string): (ClaimRow & { triage?: TriageResultRow }) | null {
  const db = getDb();
  const claim = db.prepare(`SELECT * FROM claims WHERE id = ?`).get(id) as ClaimRow | undefined;
  if (!claim) return null;

  const triage = db
    .prepare(`SELECT * FROM triage_results WHERE claim_id = ? ORDER BY created_at DESC LIMIT 1`)
    .get(id) as TriageResultRow | undefined;

  return { ...claim, triage: triage ?? undefined };
}

export interface DashboardStats {
  totalClaims: number;
  avgTriageTimeMs: number;
  fraudFlagRate: number;
  autoResolutionRate: number;
  claimsByType: { type: string; count: number }[];
  severityDistribution: { severity: string; count: number }[];
  resolutionBreakdown: { path: string; count: number }[];
  fraudRiskDistribution: { level: string; count: number }[];
}

export function getDashboardStats(): DashboardStats {
  const db = getDb();

  const totalClaims = (
    db.prepare(`SELECT COUNT(*) as count FROM claims`).get() as { count: number }
  ).count;

  const avgResult = db
    .prepare(`SELECT AVG(triage_time_ms) as avg FROM triage_results`)
    .get() as { avg: number | null };
  const avgTriageTimeMs = avgResult.avg ?? 0;

  const totalTriaged = (
    db.prepare(`SELECT COUNT(*) as count FROM triage_results`).get() as { count: number }
  ).count;

  // Fraud flag rate
  const fraudFlagged = (
    db
      .prepare(
        `SELECT COUNT(*) as count FROM triage_results
         WHERE json_extract(fraud_assessment, '$.riskLevel') IN ('medium', 'high')`
      )
      .get() as { count: number }
  ).count;
  const fraudFlagRate = totalTriaged > 0 ? fraudFlagged / totalTriaged : 0;

  // Auto-resolution rate
  const autoResolved = (
    db
      .prepare(
        `SELECT COUNT(*) as count FROM triage_results
         WHERE json_extract(resolution, '$.resolutionPath') = 'approve'`
      )
      .get() as { count: number }
  ).count;
  const autoResolutionRate = totalTriaged > 0 ? autoResolved / totalTriaged : 0;

  // Claims by type
  const claimsByType = db
    .prepare(
      `SELECT claim_type as type, COUNT(*) as count FROM claims GROUP BY claim_type ORDER BY count DESC`
    )
    .all() as { type: string; count: number }[];

  // Severity distribution
  const severityDistribution = db
    .prepare(
      `SELECT severity, COUNT(*) as count FROM claims WHERE severity IS NOT NULL GROUP BY severity ORDER BY
       CASE severity WHEN 'low' THEN 1 WHEN 'medium' THEN 2 WHEN 'high' THEN 3 WHEN 'critical' THEN 4 END`
    )
    .all() as { severity: string; count: number }[];

  // Resolution breakdown
  const resolutionBreakdown = db
    .prepare(
      `SELECT json_extract(resolution, '$.resolutionPath') as path, COUNT(*) as count
       FROM triage_results GROUP BY path ORDER BY count DESC`
    )
    .all() as { path: string; count: number }[];

  // Fraud risk distribution
  const fraudRiskDistribution = db
    .prepare(
      `SELECT json_extract(fraud_assessment, '$.riskLevel') as level, COUNT(*) as count
       FROM triage_results GROUP BY level ORDER BY
       CASE level WHEN 'low' THEN 1 WHEN 'medium' THEN 2 WHEN 'high' THEN 3 END`
    )
    .all() as { level: string; count: number }[];

  return {
    totalClaims,
    avgTriageTimeMs,
    fraudFlagRate,
    autoResolutionRate,
    claimsByType,
    severityDistribution,
    resolutionBreakdown,
    fraudRiskDistribution,
  };
}
