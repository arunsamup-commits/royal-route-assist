import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { GlassCard } from "@/components/GlassCard";
import {
  useBookings,
  useCoolies,
  useActiveCoolieId,
  coolieStore,
  bookingStore,
  applicationStore,
  type CoolieProfile,
} from "@/lib/booking-store";
import {
  MapPin,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Navigation,
  Star,
  User,
  LogIn,
  Award,
  Image as ImageIcon,
  Search,
  UserPlus,
  Upload,
  X,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/coolie-dashboard")({
  head: () => ({
    meta: [
      { title: "Coolie Dashboard — Coolie" },
      { name: "description", content: "View and accept luggage tasks at your station." },
    ],
  }),
  component: CoolieDashboard,
});

function CoolieDashboard() {
  const bookings = useBookings();
  const coolies = useCoolies();
  const activeCoolieId = useActiveCoolieId();
  const activeCoolie = activeCoolieId ? coolies.find((c) => c.id === activeCoolieId) : null;
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  if (showOnboarding) {
    return <CoolieOnboardingForm onBack={() => setShowOnboarding(false)} />;
  }

  if (!activeCoolie) {
    return (
      <CoolieLoginSelector
        coolies={coolies}
        onShowOnboarding={() => setShowOnboarding(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
      />
    );
  }

  const pendingBookings = bookings.filter(
    (b) => b.status === "pending" && b.stationName.toLowerCase().includes(activeCoolie.station.toLowerCase().split(" ")[0])
  );
  const myBookings = bookings.filter((b) => b.assignedCoolieId === activeCoolie.id);
  const myActive = myBookings.filter((b) => b.status === "assigned");
  const myCompleted = myBookings.filter((b) => b.status === "completed");

  return (
    <div className="mx-auto max-w-md px-4 pt-8 pb-24">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <div className="flex items-center gap-3">
          <img
            src={activeCoolie.photo}
            alt={activeCoolie.name}
            className="h-14 w-14 rounded-full border-2 border-primary/50 bg-muted"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{activeCoolie.name}</h1>
              <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-semibold text-success">Online</span>
            </div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {activeCoolie.station}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className="flex items-center gap-0.5 text-warning">
                <Star className="h-3 w-3" /> {activeCoolie.rating}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="flex items-center gap-0.5 text-primary">
                <Award className="h-3 w-3" /> {activeCoolie.badge}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{activeCoolie.id}</span>
            </div>
          </div>
          <button
            onClick={() => coolieStore.setActiveCoolie(null)}
            className="rounded-lg bg-muted px-2 py-1.5 text-xs font-semibold text-muted-foreground"
          >
            Logout
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <GlassCard className="mb-6 grid grid-cols-4 text-center">
        <div>
          <p className="text-xl font-bold text-primary">{pendingBookings.length}</p>
          <p className="text-xs text-muted-foreground">Available</p>
        </div>
        <div>
          <p className="text-xl font-bold text-warning">{myActive.length}</p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
        <div>
          <p className="text-xl font-bold text-success">{activeCoolie.totalAccepted}</p>
          <p className="text-xs text-muted-foreground">Accepted</p>
        </div>
        <div>
          <p className="text-xl font-bold text-destructive">{activeCoolie.totalRejected}</p>
          <p className="text-xs text-muted-foreground">Rejected</p>
        </div>
      </GlassCard>

      {/* My Active Tasks */}
      {myActive.length > 0 && (
        <>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            My Active Tasks
          </p>
          <div className="mb-6 space-y-3">
            {myActive.map((booking) => (
              <GlassCard key={booking.id} className="!border-success/30">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold">{booking.passengerName}</span>
                  <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-semibold text-success">
                    In Progress
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {booking.bags} bags</span>
                  <span className="flex items-center gap-1"><Navigation className="h-3 w-3" /> {booking.stationName}</span>
                </div>
                {booking.trainName && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Train: {booking.trainName} {booking.trainNumber && `(${booking.trainNumber})`} {booking.coachNumber && `· Coach ${booking.coachNumber}`} {booking.seatNumber && `· Seat ${booking.seatNumber}`}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  OTP: <span className="font-mono font-bold text-primary">{booking.otp}</span>
                </p>
                <button
                  onClick={() => bookingStore.completeBooking(booking.id)}
                  className="btn-primary-glow mt-3 w-full py-2 text-xs"
                >
                  <CheckCircle className="mr-1 inline h-3.5 w-3.5" /> Mark Completed
                </button>
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {/* Available Tasks */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Available Tasks ({pendingBookings.length})
      </p>
      {pendingBookings.length === 0 ? (
        <GlassCard className="py-8 text-center">
          <Package className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No tasks available at your station</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {pendingBookings.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <GlassCard hover>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold">{booking.passengerName}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {getTimeAgo(booking.createdAt)}
                  </span>
                </div>
                <div className="mb-2 flex items-center gap-3">
                  {booking.luggageImage ? (
                    <img src={booking.luggageImage} alt="Luggage" className="h-12 w-12 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted/30">
                      <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="flex-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1"><Package className="h-3 w-3" /> {booking.bags} bags · ₹{booking.estimatedCost}</p>
                    <p className="flex items-center gap-1"><Navigation className="h-3 w-3" /> {booking.stationName || "Unknown"}</p>
                    <p className="capitalize">{booking.locationType} · {booking.scheduleType === "pre" ? "Pre-booked" : "Instant"}</p>
                    {booking.passengerMobile && (
                      <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {booking.passengerMobile}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => bookingStore.acceptBooking(booking.id, activeCoolie.id)}
                    className="btn-primary-glow flex flex-1 items-center justify-center gap-1 py-2 text-xs"
                  >
                    <CheckCircle className="h-3.5 w-3.5" /> Accept
                  </motion.button>
                  <button
                    onClick={() => bookingStore.rejectBooking(booking.id, activeCoolie.id)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-destructive/15 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/25"
                  >
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Completed History */}
      {myCompleted.length > 0 && (
        <>
          <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Completed ({myCompleted.length})
          </p>
          <div className="space-y-2">
            {myCompleted.map((b) => (
              <GlassCard key={b.id} className="flex items-center gap-3 opacity-70">
                <CheckCircle className="h-4 w-4 shrink-0 text-success" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{b.passengerName}</p>
                  <p className="text-xs text-muted-foreground">{b.bags} bags · ₹{b.estimatedCost}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Coolie Login Selector with Search & Onboarding ─── */
function CoolieLoginSelector({
  coolies,
  onShowOnboarding,
  searchQuery,
  setSearchQuery,
  showSearch,
  setShowSearch,
}: {
  coolies: CoolieProfile[];
  onShowOnboarding: () => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  showSearch: boolean;
  setShowSearch: (v: boolean) => void;
}) {
  const filteredCoolies = searchQuery.trim()
    ? coolieStore.searchByStation(searchQuery)
    : coolies;

  return (
    <div className="mx-auto max-w-md px-4 pt-8 pb-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20">
          <LogIn className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold gradient-text">Coolie Login</h1>
        <p className="text-sm text-muted-foreground">Select your profile to continue</p>
      </motion.div>

      {/* Header Actions: Search + Join */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition ${showSearch ? "btn-primary-glow" : "glass-card text-muted-foreground"}`}
        >
          <Search className="h-4 w-4" /> Search Coolie
        </button>
        <button
          onClick={onShowOnboarding}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-success/20 py-2.5 text-sm font-semibold text-success transition hover:bg-success/30"
        >
          <UserPlus className="h-4 w-4" /> Join as Coolie
        </button>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, station, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full py-3 pl-10 pr-4 text-sm"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {filteredCoolies.length === 0 ? (
          <GlassCard className="py-8 text-center">
            <Search className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No coolies found</p>
          </GlassCard>
        ) : (
          filteredCoolies.map((coolie, i) => (
            <motion.div
              key={coolie.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard
                hover
                className="flex cursor-pointer items-center gap-3"
                onClick={() => coolieStore.setActiveCoolie(coolie.id)}
              >
                <img
                  src={coolie.photo}
                  alt={coolie.name}
                  className="h-12 w-12 rounded-full border border-glass-border bg-muted"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold">{coolie.name}</p>
                    {coolie.isOnline && <span className="h-2 w-2 rounded-full bg-success" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{coolie.id} · {coolie.station}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-0.5 text-warning">
                      <Star className="h-3 w-3" /> {coolie.rating}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-primary">{coolie.badge}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-success">{coolie.totalAccepted} accepted</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Coolie Onboarding Form ─── */
function CoolieOnboardingForm({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [station, setStation] = useState("");
  const [experience, setExperience] = useState("");
  const [availFrom, setAvailFrom] = useState("");
  const [availTo, setAvailTo] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [bankPassbook, setBankPassbook] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const passbookRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!name || !mobile || !station) return;
    applicationStore.addApplication({
      name,
      mobile,
      station,
      experienceYears: Number(experience) || 0,
      availableFrom: availFrom,
      availableTo: availTo,
      photo: photo || undefined,
      bankPassbook: bankPassbook || undefined,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-md px-4 pt-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-success" />
        </motion.div>
        <h2 className="mb-2 text-2xl font-bold">Application Submitted!</h2>
        <p className="mb-6 text-sm text-muted-foreground">
          Admin will review your application and approve it. You'll be notified once accepted.
        </p>
        <button onClick={onBack} className="btn-primary-glow px-6 py-2.5 text-sm">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-8 pb-24">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <button onClick={onBack} className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20">
            <UserPlus className="h-5 w-5 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Join as Coolie</h1>
            <p className="text-sm text-muted-foreground">Fill your details to get started</p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <User className="h-3 w-3" /> Full Name *
          </label>
          <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="glass-input w-full px-4 py-3 text-sm" />
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Phone className="h-3 w-3" /> Mobile Number *
          </label>
          <input type="tel" placeholder="10-digit mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} className="glass-input w-full px-4 py-3 text-sm" maxLength={10} />
        </div>

        <div>
          <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <MapPin className="h-3 w-3" /> Station *
          </label>
          <input type="text" placeholder="Which station will you work at?" value={station} onChange={(e) => setStation(e.target.value)} className="glass-input w-full px-4 py-3 text-sm" />
        </div>

        <div>
          <label className="mb-1 text-xs font-semibold text-muted-foreground">Years of Experience as Coolie</label>
          <input type="number" placeholder="e.g. 5" value={experience} onChange={(e) => setExperience(e.target.value)} className="glass-input w-full px-4 py-3 text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 text-xs font-semibold text-muted-foreground">Available From</label>
            <input type="time" value={availFrom} onChange={(e) => setAvailFrom(e.target.value)} className="glass-input w-full px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 text-xs font-semibold text-muted-foreground">Available To</label>
            <input type="time" value={availTo} onChange={(e) => setAvailTo(e.target.value)} className="glass-input w-full px-4 py-3 text-sm" />
          </div>
        </div>

        {/* Photo Upload */}
        <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setPhoto)} />
        <GlassCard
          hover
          className="cursor-pointer text-center"
          onClick={() => photoRef.current?.click()}
        >
          {photo ? (
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setPhoto(null); }} className="absolute top-0 right-0 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                <X className="h-3 w-3" />
              </button>
              <img src={photo} alt="Your Photo" className="mx-auto h-24 w-24 rounded-full object-cover" />
            </div>
          ) : (
            <>
              <Upload className="mx-auto mb-1 h-6 w-6 text-primary" />
              <p className="text-sm font-semibold">Upload Your Photo</p>
              <p className="text-xs text-muted-foreground">Tap to select</p>
            </>
          )}
        </GlassCard>

        {/* Bank Passbook Upload */}
        <input ref={passbookRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileUpload(e, setBankPassbook)} />
        <GlassCard
          hover
          className="cursor-pointer text-center"
          onClick={() => passbookRef.current?.click()}
        >
          {bankPassbook ? (
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setBankPassbook(null); }} className="absolute top-0 right-0 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
                <X className="h-3 w-3" />
              </button>
              <CheckCircle className="mx-auto mb-1 h-6 w-6 text-success" />
              <p className="text-sm font-semibold text-success">Passbook Uploaded</p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto mb-1 h-6 w-6 text-accent" />
              <p className="text-sm font-semibold">Upload Bank Passbook</p>
              <p className="text-xs text-muted-foreground">Required for verification</p>
            </>
          )}
        </GlassCard>

        <motion.button
          whileTap={{ scale: 0.97 }}
          className="btn-primary-glow mt-4 w-full py-3.5 text-sm"
          onClick={handleSubmit}
        >
          <UserPlus className="mr-2 inline h-4 w-4" />
          Submit Application
        </motion.button>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}
