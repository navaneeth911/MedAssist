import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function HealthChart({ data = [] }: any) {
  console.log("HealthChart Data:", data);

  if (!data.length) {
    return (
      <div className="h-[350px] flex items-center justify-center text-gray-500">
        No assessment data available
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 20,
            left: 20,
            bottom: 20,
          }}
        >
          <defs>
            <linearGradient
              id="riskGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#EF4444"
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor="#EF4444"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
  dataKey="assessment"
  stroke="#64748B"
  fontSize={12}
  tickLine={false}
  axisLine={false}
/>

          <YAxis
            domain={[1, 4]}
            ticks={[1, 2, 3, 4]}
            tickFormatter={(value) => {
              const labels: Record<number, string> = {
                1: "Low",
                2: "Medium",
                3: "High",
                4: "Emergency",
              };
              return labels[value];
            }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            formatter={(value: any) => {
              const labels: Record<number, string> = {
                1: "Low",
                2: "Medium",
                3: "High",
                4: "Emergency",
              };

              return [labels[value], "Risk"];
            }}
          />

          <Area
            type="monotone"
            dataKey="risk"
            stroke="#EF4444"
            strokeWidth={3}
            fill="url(#riskGradient)"
            dot={{ r: 5 }}
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}