import { motion } from "framer-motion";
import { Star, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Props {
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  initials: string;
  tint: string;
  delay?: number;
}

export function DoctorCard({ name, specialty, rating, experience, initials, tint, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-shadow hover:shadow-elevated"
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12 ring-2 ring-background" style={{ boxShadow: `0 0 0 2px ${tint}33` }}>
          <AvatarFallback className="text-sm font-semibold text-white" style={{ background: tint }}>
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{name}</div>
          <div className="truncate text-xs text-muted-foreground">{specialty}</div>
          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span className="font-medium text-foreground">{rating}</span>
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {experience}
            </span>
          </div>
        </div>
      </div>
      <button className="mt-4 w-full rounded-xl bg-foreground py-2 text-xs font-semibold text-background transition-all hover:opacity-90 group-hover:bg-primary group-hover:text-primary-foreground">
        Book Appointment
      </button>
    </motion.div>
  );
}
