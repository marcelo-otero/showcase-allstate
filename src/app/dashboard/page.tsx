import { Badge } from "@/components/ui/badge";
import { getDashboardStats, getRecentClaims } from "@/lib/db/queries";

function StatCard({
  label,
  value,
  subtitle,
  accent,
}: {
  label: string;
  value: string;
  subtitle?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#d6dce6] shadow-[0_2px_8px_rgba(14,25,65,0.06)] p-5">
      <p className="text-xs font-medium text-[#5a6578] tracking-wide uppercase">
        {label}
      </p>
      <p className={`text-3xl font-bold tracking-tight mt-1 text-[#0e1941] ${accent ?? ""}`}>
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-[#5a6578] mt-1">{subtitle}</p>
      )}
    </div>
  );
}

function BarChart({
  data,
  colorMap,
}: {
  data: { label: string; count: number }[];
  colorMap?: Record<string, string>;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-2.5">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-xs font-medium w-20 text-right truncate capitalize text-[#5a6578]">
            {item.label}
          </span>
          <div className="flex-1 h-7 bg-[#eef2f7] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full flex items-center px-2.5 text-[11px] font-semibold text-white transition-all duration-500 ${
                colorMap?.[item.label] ?? "bg-[#0033a0]"
              }`}
              style={{ width: `${Math.max((item.count / max) * 100, 12)}%` }}
            >
              {item.count}
            </div>
          </div>
        </div>
      ))}
    </div>
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
      className={`px-2 py-0.5 rounded-full text-[11px] font-medium ring-1 ring-inset ${styles[severity] ?? "bg-gray-100 ring-gray-600/20"}`}
    >
      {severity}
    </span>
  );
}

export default function DashboardPage() {
  const stats = getDashboardStats();
  const recentClaims = getRecentClaims(20);

  const severityColors: Record<string, string> = {
    low: "bg-green-600",
    medium: "bg-[#ed7766]",
    high: "bg-[#0033a0]",
    critical: "bg-[#0e1941]",
  };

  const resolutionColors: Record<string, string> = {
    approve: "bg-green-600",
    investigate: "bg-[#ed7766]",
    escalate: "bg-[#0033a0]",
    deny: "bg-[#0e1941]",
  };

  const fraudColors: Record<string, string> = {
    low: "bg-green-600",
    medium: "bg-[#ed7766]",
    high: "bg-[#0e1941]",
  };

  const claimTypeColors: Record<string, string> = {
    auto: "bg-[#0033a0]",
    home: "bg-[#45bce5]",
    liability: "bg-[#0e1941]",
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-[#d6dce6] to-transparent" />
          <span className="text-xs font-medium tracking-widest uppercase text-[#5a6578]">
            Operations
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-[#d6dce6] to-transparent" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-center text-[#0e1941]">
          Analytics Dashboard
        </h1>
        <p className="text-[#5a6578] mt-2 text-center text-[15px]">
          Triage performance across {stats.totalClaims} processed claims.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Claims"
          value={String(stats.totalClaims)}
        />
        <StatCard
          label="Avg Triage Time"
          value={
            stats.avgTriageTimeMs < 1000
              ? `${Math.round(stats.avgTriageTimeMs)}ms`
              : `${(stats.avgTriageTimeMs / 1000).toFixed(1)}s`
          }
          subtitle="vs. 24-48 hrs manual"
          accent="!text-green-700"
        />
        <StatCard
          label="Fraud Flag Rate"
          value={`${(stats.fraudFlagRate * 100).toFixed(0)}%`}
          subtitle="medium + high risk"
        />
        <StatCard
          label="Auto-Resolution"
          value={`${(stats.autoResolutionRate * 100).toFixed(0)}%`}
          subtitle="STP candidates"
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-[#d6dce6] shadow-[0_2px_8px_rgba(14,25,65,0.06)] p-5">
          <h3 className="text-sm font-semibold mb-4 text-[#0e1941]">Claims by Type</h3>
          <BarChart
            data={stats.claimsByType.map((c) => ({
              label: c.type,
              count: c.count,
            }))}
            colorMap={claimTypeColors}
          />
        </div>

        <div className="bg-white rounded-xl border border-[#d6dce6] shadow-[0_2px_8px_rgba(14,25,65,0.06)] p-5">
          <h3 className="text-sm font-semibold mb-4 text-[#0e1941]">
            Severity Distribution
          </h3>
          <BarChart
            data={stats.severityDistribution.map((s) => ({
              label: s.severity,
              count: s.count,
            }))}
            colorMap={severityColors}
          />
        </div>

        <div className="bg-white rounded-xl border border-[#d6dce6] shadow-[0_2px_8px_rgba(14,25,65,0.06)] p-5">
          <h3 className="text-sm font-semibold mb-4 text-[#0e1941]">Resolution Outcomes</h3>
          <BarChart
            data={stats.resolutionBreakdown.map((r) => ({
              label: r.path,
              count: r.count,
            }))}
            colorMap={resolutionColors}
          />
        </div>

        <div className="bg-white rounded-xl border border-[#d6dce6] shadow-[0_2px_8px_rgba(14,25,65,0.06)] p-5">
          <h3 className="text-sm font-semibold mb-4 text-[#0e1941]">
            Fraud Risk Distribution
          </h3>
          <BarChart
            data={stats.fraudRiskDistribution.map((f) => ({
              label: f.level,
              count: f.count,
            }))}
            colorMap={fraudColors}
          />
        </div>
      </div>

      {/* Recent Claims Table */}
      <div className="bg-white rounded-xl border border-[#d6dce6] shadow-[0_2px_8px_rgba(14,25,65,0.06)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#d6dce6]">
          <h3 className="text-sm font-semibold text-[#0e1941]">Recent Claims</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#d6dce6] bg-[#eef2f7]/50">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-[#5a6578]">
                  ID
                </th>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-[#5a6578]">
                  Claimant
                </th>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-[#5a6578]">
                  Type
                </th>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-[#5a6578]">
                  Severity
                </th>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-[#5a6578]">
                  Status
                </th>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-[#5a6578]">
                  Incident Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentClaims.map((claim, i) => (
                <tr
                  key={claim.id}
                  className={`border-b border-[#d6dce6]/60 last:border-0 ${
                    i % 2 === 0 ? "" : "bg-[#eef2f7]/25"
                  }`}
                >
                  <td className="px-5 py-2.5 font-mono text-xs text-[#5a6578]">
                    {claim.id}
                  </td>
                  <td className="px-5 py-2.5 font-medium text-[#0e1941]">
                    {claim.claimant_name}
                  </td>
                  <td className="px-5 py-2.5">
                    <Badge variant="outline" className="capitalize text-[11px]">
                      {claim.claim_type}
                    </Badge>
                  </td>
                  <td className="px-5 py-2.5">
                    {claim.severity ? (
                      <SeverityBadge severity={claim.severity} />
                    ) : (
                      <span className="text-[#5a6578] text-xs">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-2.5">
                    <span
                      className={`text-xs font-medium ${
                        claim.status === "triaged"
                          ? "text-green-700"
                          : "text-[#5a6578]"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-[#5a6578] text-xs font-mono">
                    {claim.date_of_incident}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
