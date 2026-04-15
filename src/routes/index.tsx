import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import {
  Package,
  Users,
  Heart,
  MapPin,
  Shield,
  Star,
  ArrowRight,
  Train,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

function HomePage() {
  return (
    <div className="mx-auto max-w-md px-4 pt-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-sm">
          <Train className="h-8 w-8 text-primary" />
        </div>
        <h1 className="gradient-text text-4xl font-extrabold tracking-tight">
          Coolie
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Smart Railway Luggage Assistance
        </p>
      </motion.div>

      {/* Mode Selection */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="mb-6"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Choose your mode
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/book">
            <GlassCard hover className="cursor-pointer text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-bold">Passenger</h3>
              <p className="mt-1 text-xs text-muted-foreground">Book assistance</p>
            </GlassCard>
          </Link>
          <Link to="/coolie-dashboard">
            <GlassCard hover className="cursor-pointer text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-sm font-bold">Coolie</h3>
              <p className="mt-1 text-xs text-muted-foreground">View tasks</p>
            </GlassCard>
          </Link>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick actions
        </p>
        <div className="space-y-3">
          <Link to="/book">
            <GlassCard hover className="flex cursor-pointer items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold">Book Now</h3>
                <p className="text-xs text-muted-foreground">Get instant luggage help at your station</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </GlassCard>
          </Link>

          <Link to="/sahyog">
            <GlassCard hover className="flex cursor-pointer items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                <Heart className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold">Sahyog</h3>
                <p className="text-xs text-muted-foreground">Donate clothes, food, or footwear</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </GlassCard>
          </Link>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}>
        <GlassCard className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1">
              <Shield className="h-3.5 w-3.5 text-success" />
              <span className="text-lg font-bold">12K+</span>
            </div>
            <p className="text-xs text-muted-foreground">Safe trips</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span className="text-lg font-bold">850</span>
            </div>
            <p className="text-xs text-muted-foreground">Active coolies</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1">
              <Star className="h-3.5 w-3.5 text-warning" />
              <span className="text-lg font-bold">4.8</span>
            </div>
            <p className="text-xs text-muted-foreground">Avg rating</p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
