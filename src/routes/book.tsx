import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { GlassCard } from "@/components/GlassCard";
import { bookingStore } from "@/lib/booking-store";
import {
  validateBookingStep0,
  validateBookingStep1,
  sanitizeInput,
  LIMITS,
  type ValidationError,
} from "@/lib/validation";
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
  CheckCircle,
  X,
  User,
  Phone,
  Hash,
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

const steps = ["Details", "Location", "Luggage", "Schedule", "Confirm"];

function BookPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [bags, setBags] = useState(2);
  const [locationType, setLocationType] = useState<"train" | "platform" | null>(null);
  const [stationName, setStationName] = useState("");
  const [scheduleType, setScheduleType] = useState<"now" | "pre" | null>(null);
  const [arrivalTime, setArrivalTime] = useState("");
  const [luggageImage, setLuggageImage] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ otp: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New passenger fields
  const [passengerName, setPassengerName] = useState("");
  const [passengerMobile, setPassengerMobile] = useState("");
  const [trainName, setTrainName] = useState("");
  const [trainNumber, setTrainNumber] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [coachNumber, setCoachNumber] = useState("");

  const [errors, setErrors] = useState<ValidationError[]>([]);

  const getError = (field: string) => errors.find((e) => e.field === field)?.message;

  const next = () => {
    let stepErrors: ValidationError[] = [];
    if (step === 0) {
      stepErrors = validateBookingStep0({ passengerName, passengerMobile, trainName, trainNumber, coachNumber, seatNumber });
    } else if (step === 1) {
      stepErrors = validateBookingStep1({ locationType, stationName });
    } else if (step === 3 && !scheduleType) {
      stepErrors = [{ field: "scheduleType", message: "Select a schedule" }];
    }
    setErrors(stepErrors);
    if (stepErrors.length > 0) return;
    setStep((s) => Math.min(s + 1, 4));
  };
  const prev = () => { setErrors([]); setStep((s) => Math.max(s - 1, 0)); };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLuggageImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    if (!locationType || !scheduleType) return;
    const booking = bookingStore.addBooking({
      locationType,
      stationName,
      bags,
      scheduleType,
      arrivalTime: arrivalTime || undefined,
      luggageImage: luggageImage || undefined,
      passengerName: passengerName || "Passenger",
      passengerMobile: passengerMobile || "",
      trainName: trainName || undefined,
      trainNumber: trainNumber || undefined,
      seatNumber: seatNumber || undefined,
      coachNumber: coachNumber || undefined,
    });
    setConfirmed({ otp: booking.otp });
  };

  if (confirmed) {
    return (
      <div className="mx-auto max-w-md px-4 pt-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-success" />
        </motion.div>
        <h2 className="mb-2 text-2xl font-bold">Booking Confirmed!</h2>
        <p className="mb-4 text-sm text-muted-foreground">Share this OTP with your coolie</p>
        <GlassCard className="mx-auto mb-6 inline-block px-8 py-4">
          <p className="font-mono text-4xl font-bold tracking-[0.3em] text-primary">{confirmed.otp}</p>
        </GlassCard>
        <div className="flex justify-center gap-3">
          <button onClick={() => navigate({ to: "/track" })} className="btn-primary-glow px-5 py-2.5 text-sm">
            Track Booking
          </button>
          <button onClick={() => navigate({ to: "/" })} className="glass-card px-5 py-2.5 text-sm font-semibold">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-8 pb-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="text-2xl font-bold gradient-text">Book Assistance</h1>
        <p className="text-sm text-muted-foreground">Fill in the details to get help</p>
      </motion.div>

      {/* Progress */}
      <div className="mb-6 flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-1">
            <div
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                i <= step ? "bg-primary text-primary-foreground shadow-[0_0_12px_oklch(0.6_0.24_264/50%)]" : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            {i < 4 && (
              <div className={`h-0.5 flex-1 rounded transition-colors ${i < step ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Passenger Details */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="mb-3 text-sm font-semibold">Your Details</p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <User className="h-3 w-3" /> Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={passengerName}
                  onChange={(e) => setPassengerName(sanitizeInput(e.target.value, LIMITS.NAME_MAX))}
                  className={`glass-input w-full px-4 py-3 text-sm ${getError("passengerName") ? "!border-destructive" : ""}`}
                />
                {getError("passengerName") && <p className="mt-1 text-xs text-destructive">{getError("passengerName")}</p>}
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <Phone className="h-3 w-3" /> Mobile Number *
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={passengerMobile}
                  onChange={(e) => setPassengerMobile(e.target.value.replace(/\D/g, "").slice(0, LIMITS.MOBILE_LENGTH))}
                  className={`glass-input w-full px-4 py-3 text-sm ${getError("passengerMobile") ? "!border-destructive" : ""}`}
                  maxLength={10}
                />
                {getError("passengerMobile") && <p className="mt-1 text-xs text-destructive">{getError("passengerMobile")}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Train className="h-3 w-3" /> Train Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajdhani"
                    value={trainName}
                    onChange={(e) => setTrainName(sanitizeInput(e.target.value, LIMITS.TRAIN_NAME_MAX))}
                    className={`glass-input w-full px-4 py-3 text-sm ${getError("trainName") ? "!border-destructive" : ""}`}
                  />
                  {getError("trainName") && <p className="mt-1 text-xs text-destructive">{getError("trainName")}</p>}
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    <Hash className="h-3 w-3" /> Train Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12301"
                    value={trainNumber}
                    onChange={(e) => setTrainNumber(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    className={`glass-input w-full px-4 py-3 text-sm ${getError("trainNumber") ? "!border-destructive" : ""}`}
                  />
                  {getError("trainNumber") && <p className="mt-1 text-xs text-destructive">{getError("trainNumber")}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    Coach Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B3"
                    value={coachNumber}
                    onChange={(e) => setCoachNumber(sanitizeInput(e.target.value, LIMITS.COACH_MAX))}
                    className={`glass-input w-full px-4 py-3 text-sm ${getError("coachNumber") ? "!border-destructive" : ""}`}
                  />
                </div>
                <div>
                  <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                    Seat Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 42"
                    value={seatNumber}
                    onChange={(e) => setSeatNumber(sanitizeInput(e.target.value, LIMITS.SEAT_MAX))}
                    className={`glass-input w-full px-4 py-3 text-sm ${getError("seatNumber") ? "!border-destructive" : ""}`}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="mb-3 text-sm font-semibold">Where are you right now?</p>
            <div className="grid grid-cols-2 gap-3">
              <GlassCard
                hover
                className={`cursor-pointer text-center ${locationType === "train" ? "!border-primary !bg-primary/15" : ""}`}
                onClick={() => setLocationType("train")}
              >
                <Train className="mx-auto mb-2 h-8 w-8 text-primary" />
                <p className="text-sm font-semibold">In Train</p>
                <p className="text-xs text-muted-foreground">Approaching station</p>
              </GlassCard>
              <GlassCard
                hover
                className={`cursor-pointer text-center ${locationType === "platform" ? "!border-accent !bg-accent/15" : ""}`}
                onClick={() => setLocationType("platform")}
              >
                <Landmark className="mx-auto mb-2 h-8 w-8 text-accent" />
                <p className="text-sm font-semibold">On Platform</p>
                <p className="text-xs text-muted-foreground">Already at station</p>
              </GlassCard>
            </div>
            {locationType && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <MapPin className="h-3 w-3" /> Station Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi Railway Station"
                  value={stationName}
                  onChange={(e) => setStationName(sanitizeInput(e.target.value, LIMITS.STATION_MAX))}
                  className={`glass-input w-full px-4 py-3 text-sm ${getError("stationName") ? "!border-destructive" : ""}`}
                />
                {getError("stationName") && <p className="mt-1 text-xs text-destructive">{getError("stationName")}</p>}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 2: Luggage */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
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
                <span className="text-3xl font-bold gradient-text">{bags}</span>
                <button
                  onClick={() => setBags(Math.min(10, bags + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition hover:bg-muted/80"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </GlassCard>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageUpload}
            />

            {luggageImage ? (
              <GlassCard className="relative">
                <button
                  onClick={() => setLuggageImage(null)}
                  className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
                <img src={luggageImage} alt="Luggage" className="w-full rounded-lg object-cover max-h-40" />
              </GlassCard>
            ) : (
              <GlassCard
                hover
                className="cursor-pointer text-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-semibold">Upload Luggage Photo</p>
                <p className="text-xs text-muted-foreground">Tap to capture or select</p>
              </GlassCard>
            )}
          </motion.div>
        )}

        {/* Step 3: Schedule */}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="mb-3 text-sm font-semibold">When do you need help?</p>
            <div className="space-y-3">
              <GlassCard
                hover
                className={`flex cursor-pointer items-center gap-4 ${scheduleType === "now" ? "!border-primary !bg-primary/15" : ""}`}
                onClick={() => setScheduleType("now")}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold">Right Now</p>
                  <p className="text-xs text-muted-foreground">I need help immediately</p>
                </div>
              </GlassCard>
              <GlassCard
                hover
                className={`flex cursor-pointer items-center gap-4 ${scheduleType === "pre" ? "!border-accent !bg-accent/15" : ""}`}
                onClick={() => setScheduleType("pre")}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold">Pre-book (30-60 min)</p>
                  <p className="text-xs text-muted-foreground">Schedule in advance</p>
                </div>
              </GlassCard>
            </div>
            {scheduleType === "pre" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
                <label className="mb-1.5 block text-sm font-semibold">Train arrival time</label>
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="glass-input w-full px-4 py-3 text-sm"
                />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="mb-3 text-sm font-semibold">Confirm Booking</p>
            <GlassCard className="space-y-2.5">
              {[
                { label: "Name", value: passengerName || "—" },
                { label: "Mobile", value: passengerMobile || "—" },
                { label: "Location", value: locationType ? locationType.charAt(0).toUpperCase() + locationType.slice(1) : "—" },
                { label: "Station", value: stationName || "—" },
                ...(trainName ? [{ label: "Train", value: `${trainName} ${trainNumber ? `(${trainNumber})` : ""}` }] : []),
                ...(coachNumber ? [{ label: "Coach/Seat", value: `${coachNumber} / ${seatNumber || "—"}` }] : []),
                { label: "Bags", value: String(bags) },
                { label: "Schedule", value: scheduleType === "pre" ? "Pre-booked" : "Instant" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-semibold">{item.value}</span>
                  </div>
                  {i < 7 && <div className="mt-2 h-px bg-border" />}
                </div>
              ))}
              {luggageImage && (
                <>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Photo</span>
                    <img src={luggageImage} alt="Luggage" className="h-10 w-10 rounded-md object-cover" />
                  </div>
                </>
              )}
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Est. Cost</span>
                <span className="gradient-text text-lg font-bold">₹{bags * 50}</span>
              </div>
            </GlassCard>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="btn-primary-glow mt-5 w-full py-3.5 text-sm"
              onClick={handleConfirm}
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
        {step < 4 && (
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
