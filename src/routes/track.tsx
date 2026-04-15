import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { useBookings, useCoolies } from "@/lib/booking-store";
import { MapPin, Phone, Shield, Navigation, Star, Award, Package, User } from "lucide-react";

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
  const bookings = useBookings();
  const coolies = useCoolies();

  // Find most recent assigned booking
  const activeBooking = bookings.find((b) => b.status === "assigned");
  const assignedCoolie = activeBooking?.assignedCoolieId
    ? coolies.find((c) => c.id === activeBooking.assignedCoolieId)
    : null;

  return (
    <div className="mx-auto max-w-md px-4 pt-8 pb-24">
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

      {/* Active Booking with Coolie Profile */}
      {activeBooking ? (
        <GlassCard className="mb-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active Booking</p>
            <span className="rounded-full bg-success/20 px-2.5 py-0.5 text-xs font-semibold text-success">
              En Route
            </span>
          </div>

          {assignedCoolie ? (
            <div className="mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={assignedCoolie.photo}
                  alt={assignedCoolie.name}
                  className="h-14 w-14 rounded-full border-2 border-primary/50 bg-muted"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold">{assignedCoolie.name}</p>
                  <p className="text-xs text-muted-foreground">{assignedCoolie.id} · {assignedCoolie.station}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-0.5 text-warning">
                      <Star className="h-3 w-3" /> {assignedCoolie.rating}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="flex items-center gap-0.5 text-primary">
                      <Award className="h-3 w-3" /> {assignedCoolie.badge}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-success">{assignedCoolie.totalCompleted} trips</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">Coolie Assigned</p>
                <p className="text-xs text-muted-foreground">{activeBooking.assignedCoolieId}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2.5">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {activeBooking.bags} bags · ₹{activeBooking.estimatedCost} ·{" "}
              <span className="font-semibold text-foreground">Estimated: 3 mins</span>
            </p>
          </div>
        </GlassCard>
      ) : (
        <GlassCard className="mb-4 py-8 text-center">
          <Package className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No active booking</p>
          <p className="text-xs text-muted-foreground/70">Book assistance to start tracking</p>
        </GlassCard>
      )}

      {/* OTP & Actions */}
      {activeBooking && (
        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="text-center">
            <Shield className="mx-auto mb-1 h-5 w-5 text-warning" />
            <p className="text-xs text-muted-foreground">Your OTP</p>
            <p className="mt-1 text-2xl font-bold tracking-widest">{activeBooking.otp}</p>
          </GlassCard>
          <GlassCard hover className="cursor-pointer text-center">
            <Phone className="mx-auto mb-1 h-5 w-5 text-success" />
            <p className="text-xs text-muted-foreground">Private Call</p>
            <motion.button whileTap={{ scale: 0.95 }} className="btn-primary-glow mt-2 w-full py-2 text-xs">
              Call Coolie
            </motion.button>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
