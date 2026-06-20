import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  progress: number;
  tint: string;
  delay?: number;
}

export function InsightCard({ icon: Icon, title, description, progress, tint, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-shadow hover:shadow-elevated"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: `${tint}1a` }}>
          <Icon className="h-5 w-5" style={{ color: tint }} strokeWidth={2.2} />
        </div>
        <div>
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold" style={{ color: tint }}>{progress}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: tint }}
          />
        </div>
      </div>
    </motion.div>
  );
}
