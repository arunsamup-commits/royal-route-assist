import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { MapPin, Phone, Shield, Navigation } from "lucide-react";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Live Tracking — Coolie" },
      { name: "description", content: "Track your assigned coolie in real-time." },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  return (
    <div className="mx-auto max-w-md px-4 pt-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold">Live Tracking</h1>
        <p className="mb-6 text-sm text-muted-foreground">Real-time coolie location</p>
      </motion.div>

      {/* Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="relative mb-6 flex h-56 items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-royal/10 to-purple-deep/10" />
          <div className="relative z-10 text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Navigation className="mx-auto mb-2 h-10 w-10 text-primary" />
            </motion.div>
            <p className="text-sm font-semibold">Map View</p>
            <p className="text-xs text-muted-foreground">Live location appears here</p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Active Booking */}
      <GlassCard className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Booking</p>
          <span className="rounded-full bg-success/20 px-2.5 py-0.5 text-xs font-semibold text-success">
            En Route
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
            RK
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Raju Kumar</p>
            <p className="text-xs text-muted-foreground">ID: CL-4829 • New Delhi Station</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Estimated arrival: <span className="font-semibold text-foreground">3 mins</span></p>
        </div>
      </GlassCard>

      {/* OTP & Actions */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="text-center">
          <Shield className="mx-auto mb-1 h-5 w-5 text-warning" />
          <p className="text-xs text-muted-foreground">Your OTP</p>
          <p className="mt-1 text-2xl font-bold tracking-widest">4829</p>
        </GlassCard>
        <GlassCard hover className="cursor-pointer text-center">
          <Phone className="mx-auto mb-1 h-5 w-5 text-success" />
          <p className="text-xs text-muted-foreground">Private Call</p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn-primary-glow mt-2 w-full py-2 text-xs"
          >
            Call Coolie
          </motion.button>
        </GlassCard>
      </div>
    </div>
  );
}
