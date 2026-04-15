import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import {
  Package,
  Camera,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  Train,
  Landmark,
  Plus,
  Minus,
} from "lucide-react";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book Assistance — Coolie" },
      { name: "description", content: "Book luggage assistance at your railway station." },
    ],
  }),
  component: BookPage,
});

const steps = ["Location", "Luggage", "Schedule", "Confirm"];

function BookPage() {
  const [step, setStep] = useState(0);
  const [bags, setBags] = useState(2);
  const [locationType, setLocationType] = useState<"train" | "platform" | null>(null);
  const [scheduleType, setScheduleType] = useState<"now" | "pre" | null>(null);

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="mx-auto max-w-md px-4 pt-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="text-2xl font-bold">Book Assistance</h1>
        <p className="text-sm text-muted-foreground">Fill in the details to get help</p>
      </motion.div>

      {/* Progress */}
      <div className="mb-6 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                i <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            {i < 3 && (
              <div className={`h-0.5 flex-1 rounded transition-colors ${i < step ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Steps */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="mb-3 text-sm font-semibold">Where are you right now?</p>
            <div className="grid grid-cols-2 gap-3">
              <GlassCard
                hover
                className={`cursor-pointer text-center ${locationType === "train" ? "!border-primary !bg-primary/10" : ""}`}
                onClick={() => setLocationType("train")}
              >
                <Train className="mx-auto mb-2 h-8 w-8 text-primary" />
                <p className="text-sm font-semibold">In Train</p>
                <p className="text-xs text-muted-foreground">Approaching station</p>
              </GlassCard>
              <GlassCard
                hover
                className={`cursor-pointer text-center ${locationType === "platform" ? "!border-primary !bg-primary/10" : ""}`}
                onClick={() => setLocationType("platform")}
              >
                <Landmark className="mx-auto mb-2 h-8 w-8 text-accent" />
                <p className="text-sm font-semibold">On Platform</p>
                <p className="text-xs text-muted-foreground">Already at station</p>
              </GlassCard>
            </div>
            {locationType && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <label className="mb-1.5 block text-sm font-semibold">Station Name</label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi Railway Station"
                  className="glass-input w-full px-4 py-3 text-sm"
                />
              </motion.div>
            )}
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="mb-3 text-sm font-semibold">Luggage Details</p>
            <GlassCard className="mb-4">
              <p className="mb-2 text-xs text-muted-foreground">Number of bags</p>
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setBags(Math.max(1, bags - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition hover:bg-muted/80"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-3xl font-bold">{bags}</span>
                <button
                  onClick={() => setBags(Math.min(10, bags + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition hover:bg-muted/80"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </GlassCard>

            <GlassCard hover className="cursor-pointer text-center">
              <Camera className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-semibold">Upload Luggage Photo</p>
              <p className="text-xs text-muted-foreground">Tap to capture or select</p>
            </GlassCard>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="mb-3 text-sm font-semibold">When do you need help?</p>
            <div className="space-y-3">
              <GlassCard
                hover
                className={`flex cursor-pointer items-center gap-4 ${scheduleType === "now" ? "!border-primary !bg-primary/10" : ""}`}
                onClick={() => setScheduleType("now")}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Right Now</p>
                  <p className="text-xs text-muted-foreground">I'm at the station and need help immediately</p>
                </div>
              </GlassCard>
              <GlassCard
                hover
                className={`flex cursor-pointer items-center gap-4 ${scheduleType === "pre" ? "!border-primary !bg-primary/10" : ""}`}
                onClick={() => setScheduleType("pre")}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold">Pre-book (30-60 min)</p>
                  <p className="text-xs text-muted-foreground">My train arrives soon, schedule in advance</p>
                </div>
              </GlassCard>
            </div>
            {scheduleType === "pre" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <label className="mb-1.5 block text-sm font-semibold">Train arrival time</label>
                <input type="time" className="glass-input w-full px-4 py-3 text-sm" />
              </motion.div>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="mb-3 text-sm font-semibold">Confirm Booking</p>
            <GlassCard className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Location</span>
                <span className="text-sm font-semibold capitalize">{locationType || "—"}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Bags</span>
                <span className="text-sm font-semibold">{bags}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Schedule</span>
                <span className="text-sm font-semibold capitalize">{scheduleType === "pre" ? "Pre-booked" : "Instant"}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Est. Cost</span>
                <span className="gradient-text text-lg font-bold">₹{bags * 50}</span>
              </div>
            </GlassCard>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="btn-primary-glow mt-5 w-full py-3.5 text-sm"
              onClick={() => alert("Booking confirmed! Your OTP is 4829")}
            >
              <Package className="mr-2 inline h-4 w-4" />
              Confirm & Book
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex items-center gap-3">
        {step > 0 && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={prev}
            className="glass-card flex items-center gap-1 px-5 py-2.5 text-sm font-semibold"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </motion.button>
        )}
        {step < 3 && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={next}
            className="btn-primary-glow ml-auto flex items-center gap-1 px-5 py-2.5 text-sm"
          >
            Next <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
