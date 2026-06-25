
import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ClipboardList,
  Stethoscope,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  CalendarClock,
  HeartPulse,
  UserRound,
  Sparkles,
  Droplets,
  CalendarCheck,
  LineChart as LineChartIcon,
  ListChecks,
  Inbox,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type RiskLevel = "Low" | "Medium" | "High";

interface OverviewStat {
  id: string;
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { direction: "up" | "down"; value: string };
}

interface RiskSlice {
  name: string;
  value: number;
  color: string;
}

interface TrendPoint {
  date: string;
  assessments: number;
}

interface ConditionBar {
  condition: string;
  count: number;
}

interface RecentSummary {
  lastAssessment: string;
  latestRisk: RiskLevel;
  latestCondition: string;
  latestSpecialist: string;
}

interface Recommendation {
  id: string;
  label: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface InsightsData {
  overview: OverviewStat[];
  risk: RiskSlice[];
  trend: TrendPoint[];
  conditions: ConditionBar[];
  recent: RecentSummary;
  recommendations: Recommendation[];
}

/* -------------------------------------------------------------------------- */
/*  Theme tokens                                                              */
/* -------------------------------------------------------------------------- */

const RISK_COLORS: Record<RiskLevel, { bg: string; text: string; ring: string; dot: string }> = {
  Low: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200", dot: "bg-emerald-500" },
  Medium: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200", dot: "bg-amber-500" },
  High: { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200", dot: "bg-rose-500" },
};

const CHART = {
  blue: "#2563eb",
  blueSoft: "#93c5fd",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
  grid: "#e2e8f0",
  axis: "#94a3b8",
};

/* -------------------------------------------------------------------------- */
/*  Mock data source (swap for your API call)                                 */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*  Small presentational helpers                                              */
/* -------------------------------------------------------------------------- */

function RiskBadge({ level }: { level: RiskLevel }) {
  console.log("Risk level received:", level);

  const c = RISK_COLORS[level] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    ring: "ring-gray-300",
    dot: "bg-gray-500",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${c.bg} ${c.text} ${c.ring}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {level} Risk
    </span>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
      {label && <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-semibold text-slate-800">
          <span
            className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm align-middle"
            style={{ background: entry.color || entry.fill }}
          />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Overview statistics                                              */
/* -------------------------------------------------------------------------- */

function OverviewCards({ stats }: { stats: OverviewStat[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;
        const up = s.trend?.direction === "up";
        return (
          <Card
            key={s.id}
            className="group rounded-2xl border-slate-200/80 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                {s.trend && (
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                      up ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    {s.trend.value}
                  </span>
                )}
              </div>
              <p className="mt-4 text-sm font-medium text-slate-500">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{s.value}</p>
              <p className="mt-1 text-xs text-slate-400">{s.hint}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Risk distribution (Pie)                                          */
/* -------------------------------------------------------------------------- */

function RiskDistribution({ data }: { data: RiskSlice[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">Risk Distribution</CardTitle>
        <CardDescription>Share of assessments by risk category.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-2 space-y-2">
          {data.map((d) => (
            <li key={d.name} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                {d.name}
              </span>
              <span className="font-semibold text-slate-900">{Math.round((d.value / total) * 100)}%</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Health trend analytics (Area)                                    */
/* -------------------------------------------------------------------------- */

function TrendAnalytics({ data }: { data: TrendPoint[] }) {
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">Assessment Trends</CardTitle>
        <CardDescription>Track health activity over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART.blue} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={CHART.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: CHART.axis }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: CHART.axis }} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="assessments"
                name="Assessments"
                stroke={CHART.blue}
                strokeWidth={2.5}
                fill="url(#trendFill)"
                dot={{ r: 3, fill: CHART.blue }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Condition analytics (Bar)                                        */
/* -------------------------------------------------------------------------- */

function ConditionAnalytics({ data }: { data: ConditionBar[] }) {
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">Most Common Conditions</CardTitle>
        <CardDescription>Frequency across your assessment history.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis
                dataKey="condition"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: CHART.axis }}
                interval={0}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: CHART.axis }} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(37,99,235,0.06)" }} />
              <Bar dataKey="count" name="Cases" fill={CHART.blue} radius={[6, 6, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: Recent health summary                                            */
/* -------------------------------------------------------------------------- */

function RecentSummaryCards({ recent }: { recent: RecentSummary }) {
  const items = [
    { label: "Last Assessment", value: recent.lastAssessment, icon: CalendarClock },
    { label: "Latest Risk Level", value: recent.latestRisk, icon: ShieldAlert, isRisk: true },
    { label: "Latest Condition", value: recent.latestCondition, icon: HeartPulse },
    { label: "Specialist Recommendation", value: recent.latestSpecialist, icon: UserRound },
  ];
  return (
    <Card className="rounded-2xl border-slate-200/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-slate-900">Recent Health Summary</CardTitle>
        <CardDescription>A snapshot of your most recent assessment.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <div
                key={it.label}
                className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">{it.label}</p>
                  {it.isRisk ? (
                    <div className="mt-1">
                      <RiskBadge level={recent.latestRisk} />
                    </div>
                  ) : (
                    <p className="truncate text-sm font-semibold text-slate-900">{it.value}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section: AI recommendations                                               */
/* -------------------------------------------------------------------------- */

function AiRecommendations({ recs }: { recs: Recommendation[] }) {
    const navigate = useNavigate();
    <Card className="rounded-2xl">
  <CardHeader>
    <CardTitle>Quick Actions</CardTitle>
  </CardHeader>

  <CardContent>
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => navigate("/analyze")}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
      >
        New Assessment
      </button>

      <button
        onClick={() => navigate("/doctors")}
        className="rounded-lg bg-green-600 px-4 py-2 text-white"
      >
        Find Doctors
      </button>

      <button
        onClick={() => navigate("/appointments")}
        className="rounded-lg bg-purple-600 px-4 py-2 text-white"
      >
        View Appointments
      </button>
    </div>
  </CardContent>
</Card>
  return (
    <Card className="overflow-hidden rounded-2xl border-blue-200/60 bg-gradient-to-br from-blue-50/80 to-white shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <CardTitle className="text-base font-semibold text-slate-900">AI Health Recommendations</CardTitle>
            <CardDescription>Generated from your assessment patterns.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {recs.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.id}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <Badge className="mb-1 bg-blue-600 hover:bg-blue-600">{r.label}</Badge>
                  <p className="text-sm text-slate-500">{r.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Loading skeleton                                                          */
/* -------------------------------------------------------------------------- */

function InsightsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="rounded-2xl border-slate-200/80">
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-[360px] rounded-2xl lg:col-span-1" />
        <Skeleton className="h-[360px] rounded-2xl lg:col-span-2" />
      </div>
      <Skeleton className="h-[360px] rounded-2xl" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Empty state                                                               */
/* -------------------------------------------------------------------------- */

function EmptyState() {
  return (
    <Card className="rounded-2xl border-dashed border-slate-300 bg-slate-50/50 shadow-none">
      <CardContent className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Inbox className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-lg font-semibold text-slate-900">No insights yet</h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Complete your first health assessment to unlock personalized analytics, risk trends, and AI recommendations.
        </p>
        <button className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          Start an assessment
        </button>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function HealthInsights() {
    

  
const [data, setData] = useState<any>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadInsights = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/insights",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Insights Status:", response.status);

const text = await response.text();

console.log("Insights Response:", text);

const insights = JSON.parse(text);

      console.log(insights);

      setData(insights);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadInsights();
}, []);
if (loading) {
  return (
    <div className="p-8">
      Loading Insights...
    </div>
  );
}
const overview = data
  ? [
      {
        id: "total",
        label: "Total Assessments",
        value: data.totalAssessments.toString(),
        hint: "Across all assessments",
        icon: ClipboardList,
      },
      {
        id: "appointments",
        label: "Appointments",
        value: data.totalAppointments.toString(),
        hint: "Booked consultations",
        icon: CalendarClock,
      },
      {
        id: "specialist",
        label: "Top Specialist",
        value: data.topSpecialist,
        hint: "Most recommended",
        icon: Stethoscope,
      },
    ]
  : [];

  const isEmpty = !loading && !data;

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Page header */}
       <header className="mb-8">
  <BackButton />

  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
    Health Insights
  </h1>

  <p className="mt-1.5 text-sm text-slate-500">
    Personalized health analytics and trends based on your assessment history.
  </p>
</header>

        {loading ? (
          <InsightsSkeleton />
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {/* Section 1 — Overview */}
            <OverviewCards stats={overview} />

            {/* Sections 2 & 3 — Risk + Trend */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
               {/* <RiskDistribution data={data!.risk} />*/}
              </div>
              <div className="lg:col-span-2">
               {/* <TrendAnalytics data={data!.trend} /> */}
              </div>
            </div>

            {/* Section 4 — Conditions */}
            {/* <ConditionAnalytics data={data!.conditions} /> */}

            {/* Sections 5 & 6 — Recent summary + AI recommendations */}
           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  <RecentSummaryCards
    recent={{
      lastAssessment:
        data?.recentAssessments?.[0]?.createdAt || "N/A",

      latestRisk:
        data?.recentAssessments?.[0]?.risk || "Low",

      latestCondition:
        data?.recentAssessments?.[0]?.condition || "Unknown",

      latestSpecialist:
        data?.recentAssessments?.[0]?.specialist ||
        "General Physician",
    }}
  />

  {/* Temporarily disable */}
  {/* <AiRecommendations recs={data!.recommendations} /> */}
</div>
          </div>
        )}
      </div>
    </div>
  );
}   
