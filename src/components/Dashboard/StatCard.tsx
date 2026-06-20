import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface Props {
  label: string;
  value: number;
  suffix?: string;
  trend: number;
  icon: LucideIcon;
  tint: "primary" | "secondary" | "success" | "warning";
  data: { v: number }[];
  delay?: number;
}

const tints = {
  primary: { bg: "bg-primary/10", text: "text-primary", stroke: "#2563EB" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary", stroke: "#14B8A6" },
  success: { bg: "bg-success/10", text: "text-success", stroke: "#22C55E" },
  warning: { bg: "bg-warning/10", text: "text-warning", stroke: "#F59E0B" },
};

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (inView) {
      const c = animate(mv, to, { duration: 1.4, ease: "easeOut" });
      return c.stop;
    }
  }, [inView, to, mv]);
  useEffect(() => rounded.on("change", (v) => { if (ref.current) ref.current.textContent = v; }), [rounded]);
  return <span ref={ref}>0</span>;
}

export function StatCard({ label, value, suffix, trend, icon: Icon, tint, data, delay = 0 }: Props) {
  const t = tints[tint];
  const positive = trend >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-shadow hover:shadow-elevated"
    >
      <div className="flex items-start justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${t.bg}`}>
          <Icon className={`h-5 w-5 ${t.text}`} strokeWidth={2.2} />
        </div>
        <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <div className="mt-5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 text-3xl font-bold tracking-tight">
          <Counter to={value} />{suffix}
        </div>
      </div>
      <div className="mt-2 h-12 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`g-${label}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={t.stroke} stopOpacity={0.35} />
                <stop offset="100%" stopColor={t.stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke={t.stroke} strokeWidth={2} fill={`url(#g-${label})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
