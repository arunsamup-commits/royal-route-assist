import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { User, Settings, Globe, Star, Package, LogOut, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Coolie" },
      { name: "description", content: "Manage your Coolie account and settings." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="mx-auto max-w-md px-4 pt-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Avatar & Info */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 backdrop-blur-sm">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-xl font-bold">Guest User</h1>
          <p className="text-sm text-muted-foreground">Sign in to access all features</p>
        </div>

        {/* Stats */}
        <GlassCard className="mb-6 grid grid-cols-3 text-center">
          <div>
            <Package className="mx-auto mb-1 h-4 w-4 text-primary" />
            <p className="text-lg font-bold">0</p>
            <p className="text-xs text-muted-foreground">Bookings</p>
          </div>
          <div>
            <Star className="mx-auto mb-1 h-4 w-4 text-warning" />
            <p className="text-lg font-bold">—</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          <div>
            <Globe className="mx-auto mb-1 h-4 w-4 text-accent" />
            <p className="text-lg font-bold">EN</p>
            <p className="text-xs text-muted-foreground">Language</p>
          </div>
        </GlassCard>

        {/* Menu */}
        <div className="space-y-2">
          {[
            { icon: Settings, label: "Account Settings" },
            { icon: Globe, label: "Language: English / हिंदी" },
            { icon: Package, label: "Booking History" },
            { icon: Star, label: "Rate & Review" },
            { icon: LogOut, label: "Sign Out" },
          ].map((item) => (
            <GlassCard key={item.label} hover className="flex cursor-pointer items-center gap-3 !p-3.5">
              <item.icon className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
