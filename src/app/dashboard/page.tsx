import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getDashboardStats, getRecentClaims } from "@/lib/db/queries";

function BarChart({
  data,
  colorMap,
}: {
  data: { label: string; count: number }[];
  colorMap?: Record<string, string>;
}) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-sm w-24 text-right truncate capitalize">
            {item.label}
          </span>
          <div className="flex-1 h-7 bg-muted rounded-md overflow-hidden">
            <div
              className={`h-full rounded-md flex items-center px-2 text-xs font-medium text-white transition-all ${
                colorMap?.[item.label] ?? "bg-blue-500"
              }`}
              style={{ width: `${Math.max((item.count / max) * 100, 8)}%` }}
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

export default function DashboardPage() {
  const stats = getDashboardStats();
  const recentClaims = getRecentClaims(20);

  const severityColors: Record<string, string> = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  };

  const resolutionColors: Record<string, string> = {
    approve: "bg-green-500",
    investigate: "bg-yellow-500",
    escalate: "bg-red-500",
    deny: "bg-purple-500",
  };

  const fraudColors: Record<string, string> = {
    low: "bg-green-500",
    medium: "bg-amber-500",
    high: "bg-red-500",
  };

  const claimTypeColors: Record<string, string> = {
    auto: "bg-blue-500",
    home: "bg-teal-500",
    liability: "bg-indigo-500",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Claims triage metrics from {stats.totalClaims} processed claims.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalClaims}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Avg Triage Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {stats.avgTriageTimeMs < 1000
                ? `${Math.round(stats.avgTriageTimeMs)}ms`
                : `${(stats.avgTriageTimeMs / 1000).toFixed(1)}s`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              vs. 24-48 hrs manual
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Fraud Flag Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(stats.fraudFlagRate * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              medium + high risk
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Auto-Resolution Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {(stats.autoResolutionRate * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              STP candidates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Claims by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={stats.claimsByType.map((c) => ({
                label: c.type,
                count: c.count,
              }))}
              colorMap={claimTypeColors}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={stats.severityDistribution.map((s) => ({
                label: s.severity,
                count: s.count,
              }))}
              colorMap={severityColors}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resolution Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={stats.resolutionBreakdown.map((r) => ({
                label: r.path,
                count: r.count,
              }))}
              colorMap={resolutionColors}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Fraud Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={stats.fraudRiskDistribution.map((f) => ({
                label: f.level,
                count: f.count,
              }))}
              colorMap={fraudColors}
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Claims</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Claimant</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Severity</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.map((claim) => (
                  <tr key={claim.id} className="border-b last:border-0">
                    <td className="py-2 font-mono text-xs">{claim.id}</td>
                    <td className="py-2">{claim.claimant_name}</td>
                    <td className="py-2">
                      <Badge variant="outline" className="capitalize">
                        {claim.claim_type}
                      </Badge>
                    </td>
                    <td className="py-2">
                      {claim.severity ? (
                        <SeverityBadge severity={claim.severity} />
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </td>
                    <td className="py-2">
                      <Badge
                        variant={
                          claim.status === "triaged" ? "secondary" : "outline"
                        }
                      >
                        {claim.status}
                      </Badge>
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {claim.date_of_incident}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
