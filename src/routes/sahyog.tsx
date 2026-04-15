import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";
import { Heart, Shirt, UtensilsCrossed, Footprints, MapPin, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/sahyog")({
  head: () => ({
    meta: [
      { title: "Sahyog — Coolie Social Impact" },
      { name: "description", content: "Donate clothes, food, or footwear to those in need through Coolie's Sahyog program." },
    ],
  }),
  component: SahyogPage,
});

const categories = [
  { id: "clothes", label: "Clothes", icon: Shirt, color: "text-primary" },
  { id: "food", label: "Food", icon: UtensilsCrossed, color: "text-success" },
  { id: "footwear", label: "Footwear", icon: Footprints, color: "text-accent" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

function SahyogPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-md px-4 pt-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-1 flex items-center gap-2">
          <Heart className="h-5 w-5 text-accent" />
          <h1 className="text-2xl font-bold">Sahyog</h1>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          Give what you can. Help those outside the station.
        </p>
      </motion.div>

      {/* Impact Banner */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
        <GlassCard className="mb-6 text-center">
          <p className="text-xs text-muted-foreground">Total items donated</p>
          <p className="gradient-text text-3xl font-extrabold">2,340+</p>
          <p className="mt-1 text-xs text-muted-foreground">items distributed across 45 stations</p>
        </GlassCard>
      </motion.div>

      {/* Category Selection */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1} className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          What would you like to donate?
        </p>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => (
            <GlassCard
              key={cat.id}
              hover
              className={`cursor-pointer text-center ${selected === cat.id ? "!border-primary !bg-primary/10" : ""}`}
              onClick={() => setSelected(cat.id)}
            >
              <cat.icon className={`mx-auto mb-2 h-7 w-7 ${cat.color}`} />
              <p className="text-xs font-semibold">{cat.label}</p>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* Pickup Form */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Pickup Station</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Enter your station name"
                className="glass-input w-full py-3 pl-10 pr-4 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Description</label>
            <textarea
              placeholder="Describe what you're donating..."
              rows={3}
              className="glass-input w-full px-4 py-3 text-sm"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="btn-primary-glow flex w-full items-center justify-center gap-2 py-3.5 text-sm"
          >
            Request Sahyog Pickup <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      )}

      {/* Recent Donations */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="mt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent donations</p>
        <div className="space-y-2">
          {[
            { name: "Amit S.", item: "Winter jackets (3)", station: "New Delhi" },
            { name: "Priya M.", item: "Packed meals (10)", station: "Mumbai CST" },
            { name: "Raj K.", item: "Shoes (2 pairs)", station: "Howrah" },
          ].map((d) => (
            <GlassCard key={d.name} className="flex items-center gap-3 !p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                {d.name[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{d.item}</p>
                <p className="text-xs text-muted-foreground">{d.name} • {d.station}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
