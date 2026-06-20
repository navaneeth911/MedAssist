import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { m: "Jan", score: 72, ai: 88 },
  { m: "Feb", score: 75, ai: 90 },
  { m: "Mar", score: 71, ai: 87 },
  { m: "Apr", score: 78, ai: 91 },
  { m: "May", score: 82, ai: 93 },
  { m: "Jun", score: 80, ai: 94 },
  { m: "Jul", score: 86, ai: 95 },
  { m: "Aug", score: 88, ai: 96 },
];

export function HealthChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="cs" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ca" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="m" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #E2E8F0",
              boxShadow: "0 8px 30px -8px rgba(37,99,235,0.18)",
              fontSize: 12,
            }}
          />
          <Area type="monotone" dataKey="score" stroke="#2563EB" strokeWidth={2.5} fill="url(#cs)" name="Health Score" />
          <Area type="monotone" dataKey="ai" stroke="#14B8A6" strokeWidth={2.5} fill="url(#ca)" name="AI Confidence" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
