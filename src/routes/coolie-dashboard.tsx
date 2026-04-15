import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { MapPin, Package, Clock, CheckCircle, Phone, Navigation } from "lucide-react";

export const Route = createFileRoute("/coolie-dashboard")({
  head: () => ({
    meta: [
      { title: "Coolie Dashboard — Coolie" },
      { name: "description", content: "View and accept luggage tasks at your station." },
    ],
  }),
  component: CoolieDashboard,
});

const tasks = [
  { id: 1, passenger: "Amit S.", bags: 3, platform: "Platform 5", time: "2 min ago", status: "new" as const },
  { id: 2, passenger: "Priya M.", bags: 1, platform: "Platform 2", time: "5 min ago", status: "new" as const },
  { id: 3, passenger: "Raj K.", bags: 4, platform: "Platform 8", time: "12 min ago", status: "accepted" as const },
];

function CoolieDashboard() {
  return (
    <div className="mx-auto max-w-md px-4 pt-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-1 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Coolie Dashboard</h1>
          <span className="rounded-full bg-success/20 px-3 py-1 text-xs font-semibold text-success">Online</span>
        </div>
        <div className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>New Delhi Railway Station</span>
        </div>
      </motion.div>

      {/* Stats */}
      <GlassCard className="mb-6 grid grid-cols-3 text-center">
        <div>
          <p className="text-xl font-bold text-primary">3</p>
          <p className="text-xs text-muted-foreground">Available</p>
        </div>
        <div>
          <p className="text-xl font-bold text-warning">1</p>
          <p className="text-xs text-muted-foreground">In Progress</p>
        </div>
        <div>
          <p className="text-xl font-bold text-success">12</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
      </GlassCard>

      {/* Tasks */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Available Tasks
      </p>
      <div className="space-y-3">
        {tasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard hover className="cursor-pointer">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-bold">{task.passenger}</span>
                {task.status === "new" ? (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">New</span>
                ) : (
                  <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs font-semibold text-warning">Accepted</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {task.bags} bags</span>
                <span className="flex items-center gap-1"><Navigation className="h-3 w-3" /> {task.platform}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {task.time}</span>
              </div>
              {task.status === "new" && (
                <div className="mt-3 flex gap-2">
                  <motion.button whileTap={{ scale: 0.97 }} className="btn-primary-glow flex-1 py-2 text-xs">
                    <CheckCircle className="mr-1 inline h-3.5 w-3.5" /> Accept
                  </motion.button>
                  <button className="glass-card flex items-center justify-center rounded-lg px-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
