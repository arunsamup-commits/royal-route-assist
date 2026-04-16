import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import {
  useBookings,
  useCoolies,
  useCoolieApplications,
  bookingStore,
  applicationStore,
  type Booking,
  type CoolieProfile,
  type CoolieApplication,
} from "@/lib/booking-store";
import {
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  XCircle,
  Package,
  Clock,
  Image as ImageIcon,
  X,
  Train,
  Landmark,
  Star,
  Award,
  Users,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Phone,
  MapPin,
  CheckCircle,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Coolie" },
      { name: "description", content: "Admin dashboard to manage live bookings." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const bookings = useBookings();
  const coolies = useCoolies();
  const applications = useCoolieApplications();
  const [tab, setTab] = useState<"bookings" | "coolies" | "applications">("bookings");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [coolieInput, setCoolieInput] = useState("");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const ADMIN_PIN = "7890";

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-md px-4 pt-20 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold gradient-text mb-2">Admin Access</h1>
          <p className="text-sm text-muted-foreground mb-6">Enter the admin PIN to continue</p>
          <GlassCard className="p-6">
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => { setPin(e.target.value); setPinError(false); }}
              placeholder="Enter 4-digit PIN"
              className="glass-input mb-3 w-full text-center text-2xl tracking-[0.5em]"
            />
            {pinError && <p className="text-xs text-destructive mb-3">Incorrect PIN. Try again.</p>}
            <button
              onClick={() => {
                if (pin === ADMIN_PIN) {
                  setAuthenticated(true);
                } else {
                  setPinError(true);
                  setPin("");
                }
              }}
              className="btn-primary-glow w-full py-2.5 text-sm font-semibold"
            >
              Unlock Admin Panel
            </button>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const attentionCount = bookings.filter((b) => b.needsAdminAttention).length;
  const pendingApps = applications.filter((a) => a.status === "pending").length;

  const handleAssign = (bookingId: string) => {
    if (coolieInput.trim()) {
      bookingStore.assignCoolie(bookingId, coolieInput.trim());
      setAssigningId(null);
      setCoolieInput("");
    }
  };

  const sortedCoolies = [...coolies].sort((a, b) => b.totalAccepted - a.totalAccepted);

  return (
    <div className="mx-auto max-w-md px-4 pt-8 pb-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage bookings, coolies & applications</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="mb-4 grid grid-cols-4 gap-2">
        <GlassCard className="p-2.5 text-center">
          <p className="text-xl font-bold">{bookings.length}</p>
          <p className="text-[10px] text-muted-foreground">Total</p>
        </GlassCard>
        <GlassCard className="p-2.5 text-center">
          <p className="text-xl font-bold text-warning">{pendingCount}</p>
          <p className="text-[10px] text-muted-foreground">Pending</p>
        </GlassCard>
        <GlassCard className={`p-2.5 text-center ${attentionCount > 0 ? "!border-destructive/50" : ""}`}>
          <p className="text-xl font-bold text-destructive">{attentionCount}</p>
          <p className="text-[10px] text-muted-foreground">Attention</p>
        </GlassCard>
        <GlassCard className={`p-2.5 text-center ${pendingApps > 0 ? "!border-success/50" : ""}`}>
          <p className="text-xl font-bold text-success">{pendingApps}</p>
          <p className="text-[10px] text-muted-foreground">New Apps</p>
        </GlassCard>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-2">
        {[
          { key: "bookings" as const, icon: Package, label: "Bookings" },
          { key: "coolies" as const, icon: Users, label: "Coolies" },
          { key: "applications" as const, icon: UserPlus, label: `Apps${pendingApps > 0 ? ` (${pendingApps})` : ""}` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex flex-1 items-center justify-center gap-1 rounded-xl py-2.5 text-xs font-semibold transition ${
              tab === t.key ? "btn-primary-glow" : "glass-card text-muted-foreground"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "bookings" ? (
        bookings.length === 0 ? (
          <GlassCard className="py-12 text-center">
            <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No bookings yet</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {bookings.map((booking) => {
                const assignedCoolie = booking.assignedCoolieId
                  ? coolies.find((c) => c.id === booking.assignedCoolieId)
                  : null;
                return (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    assignedCoolie={assignedCoolie || null}
                    isAssigning={assigningId === booking.id}
                    coolieInput={coolieInput}
                    onStartAssign={() => { setAssigningId(booking.id); setCoolieInput(""); }}
                    onCancelAssign={() => setAssigningId(null)}
                    onCoolieInputChange={setCoolieInput}
                    onConfirmAssign={() => handleAssign(booking.id)}
                    onCancel={() => bookingStore.cancelBooking(booking.id)}
                    onImageClick={(src) => setLightboxImage(src)}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        )
      ) : tab === "coolies" ? (
        <div className="space-y-3">
          {sortedCoolies.map((coolie, i) => (
            <motion.div key={coolie.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <CoolieCard coolie={coolie} rank={i + 1} />
            </motion.div>
          ))}
        </div>
      ) : (
        /* Applications Tab */
        <div className="space-y-3">
          {applications.length === 0 ? (
            <GlassCard className="py-12 text-center">
              <UserPlus className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No applications yet</p>
            </GlassCard>
          ) : (
            applications.map((app, i) => (
              <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ApplicationCard app={app} onImageClick={(src) => setLightboxImage(src)} />
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-h-[80vh] max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              <img src={lightboxImage} alt="Preview" className="max-h-[80vh] rounded-xl object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Application Card ─── */
function ApplicationCard({ app, onImageClick }: { app: CoolieApplication; onImageClick: (src: string) => void }) {
  const statusColors: Record<string, string> = {
    pending: "bg-warning/20 text-warning",
    accepted: "bg-success/20 text-success",
    declined: "bg-destructive/20 text-destructive",
  };

  return (
    <GlassCard className={`${app.status === "pending" ? "!border-warning/30" : ""}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${statusColors[app.status]}`}>
          {app.status}
        </span>
        <span className="text-xs text-muted-foreground">{getTimeAgo(app.createdAt)}</span>
      </div>

      <div className="mb-3 flex items-start gap-3">
        {app.photo ? (
          <button onClick={() => onImageClick(app.photo!)} className="shrink-0">
            <img src={app.photo} alt={app.name} className="h-14 w-14 rounded-full border border-glass-border object-cover" />
          </button>
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-muted/30">
            <Users className="h-5 w-5 text-muted-foreground/50" />
          </div>
        )}
        <div className="flex-1 space-y-1">
          <p className="text-sm font-bold">{app.name}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" /> {app.mobile}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {app.station}
          </p>
          <p className="text-xs text-muted-foreground">
            {app.experienceYears} yrs exp · {app.availableFrom || "?"} - {app.availableTo || "?"}
          </p>
        </div>
      </div>

      {app.bankPassbook && (
        <button
          onClick={() => onImageClick(app.bankPassbook!)}
          className="mb-3 flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2 text-xs text-muted-foreground transition hover:bg-muted/50"
        >
          <ImageIcon className="h-3.5 w-3.5" /> View Bank Passbook
        </button>
      )}

      {app.status === "pending" && (
        <div className="flex gap-2">
          <button
            onClick={() => applicationStore.acceptApplication(app.id)}
            className="btn-primary-glow flex flex-1 items-center justify-center gap-1.5 py-2 text-xs"
          >
            <CheckCircle className="h-3.5 w-3.5" /> Accept
          </button>
          <button
            onClick={() => applicationStore.declineApplication(app.id)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-destructive/15 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/25"
          >
            <XCircle className="h-3.5 w-3.5" /> Decline
          </button>
        </div>
      )}
    </GlassCard>
  );
}

/* ─── Coolie Card (Admin View) ─── */
function CoolieCard({ coolie, rank }: { coolie: CoolieProfile; rank: number }) {
  const acceptRate = coolie.totalAccepted + coolie.totalRejected > 0
    ? Math.round((coolie.totalAccepted / (coolie.totalAccepted + coolie.totalRejected)) * 100)
    : 0;

  return (
    <GlassCard className="flex items-center gap-3">
      <div className="relative">
        <img src={coolie.photo} alt={coolie.name} className="h-12 w-12 rounded-full border border-glass-border bg-muted" />
        {rank <= 3 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-black">
            {rank}
          </span>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold">{coolie.name}</p>
          {coolie.isOnline && <span className="h-2 w-2 rounded-full bg-success" />}
        </div>
        <p className="text-xs text-muted-foreground">{coolie.id} · {coolie.station}</p>
        <div className="mt-1 flex items-center gap-3 text-xs">
          <span className="flex items-center gap-0.5 text-warning"><Star className="h-3 w-3" /> {coolie.rating}</span>
          <span className="flex items-center gap-0.5 text-primary"><Award className="h-3 w-3" /> {coolie.badge}</span>
        </div>
      </div>
      <div className="text-right text-xs">
        <div className="flex items-center gap-1 text-success"><TrendingUp className="h-3 w-3" /> {coolie.totalAccepted}</div>
        <div className="flex items-center gap-1 text-destructive"><TrendingDown className="h-3 w-3" /> {coolie.totalRejected}</div>
        <p className="mt-0.5 text-muted-foreground">{acceptRate}% rate</p>
      </div>
    </GlassCard>
  );
}

/* ─── Booking Card ─── */
interface BookingCardProps {
  booking: Booking;
  assignedCoolie: CoolieProfile | null;
  isAssigning: boolean;
  coolieInput: string;
  onStartAssign: () => void;
  onCancelAssign: () => void;
  onCoolieInputChange: (v: string) => void;
  onConfirmAssign: () => void;
  onCancel: () => void;
  onImageClick: (src: string) => void;
}

function BookingCard({
  booking, assignedCoolie, isAssigning, coolieInput,
  onCoolieInputChange, onStartAssign, onCancelAssign, onConfirmAssign, onCancel, onImageClick,
}: BookingCardProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-warning/20 text-warning",
    assigned: "bg-success/20 text-success",
    completed: "bg-primary/20 text-primary",
    cancelled: "bg-destructive/20 text-destructive",
  };

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <GlassCard className={`relative overflow-hidden ${booking.needsAdminAttention ? "!border-destructive/60 ring-1 ring-destructive/30" : ""}`}>
        {booking.needsAdminAttention && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-destructive/15 px-3 py-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs font-semibold text-destructive">Admin Attention — No coolie response</span>
          </div>
        )}

        <div className="mb-3 flex items-center justify-between">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${statusColors[booking.status]}`}>
            {booking.status}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {getTimeAgo(booking.createdAt)}
          </span>
        </div>

        <div className="mb-3 flex items-start gap-3">
          {booking.luggageImage ? (
            <button onClick={() => onImageClick(booking.luggageImage!)} className="shrink-0 overflow-hidden rounded-lg border border-glass-border">
              <img src={booking.luggageImage} alt="Luggage" className="h-14 w-14 object-cover transition hover:scale-110" />
            </button>
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted/30">
              <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
            </div>
          )}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-semibold">{booking.passengerName}</p>
            {booking.passengerMobile && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" /> {booking.passengerMobile}
              </p>
            )}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {booking.locationType === "train" ? <Train className="h-3 w-3 text-primary" /> : <Landmark className="h-3 w-3 text-accent" />}
              {booking.stationName || "Unknown Station"}
            </div>
            <p className="text-xs text-muted-foreground">
              {booking.bags} bags · ₹{booking.estimatedCost} · {booking.scheduleType === "pre" ? "Pre-booked" : "Instant"}
            </p>
            {booking.trainName && (
              <p className="text-xs text-muted-foreground">
                Train: {booking.trainName} {booking.trainNumber && `(${booking.trainNumber})`} {booking.coachNumber && `· ${booking.coachNumber}`} {booking.seatNumber && `/ ${booking.seatNumber}`}
              </p>
            )}
            <p className="text-xs text-muted-foreground">OTP: <span className="font-mono font-bold text-primary">{booking.otp}</span></p>
          </div>
        </div>

        {assignedCoolie && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2">
            <img src={assignedCoolie.photo} alt={assignedCoolie.name} className="h-8 w-8 rounded-full border border-glass-border bg-muted" />
            <div className="flex-1">
              <p className="text-xs font-semibold">{assignedCoolie.name}</p>
              <p className="text-xs text-muted-foreground">{assignedCoolie.id} · <Star className="inline h-3 w-3 text-warning" /> {assignedCoolie.rating}</p>
            </div>
          </div>
        )}

        {booking.status === "pending" && (
          <div className="space-y-2">
            {isAssigning ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                <input type="text" placeholder="Coolie ID (e.g. CL-1001)" value={coolieInput} onChange={(e) => onCoolieInputChange(e.target.value)} className="glass-input flex-1 px-3 py-2 text-sm" autoFocus />
                <button onClick={onConfirmAssign} className="btn-primary-glow px-3 py-2 text-xs">Assign</button>
                <button onClick={onCancelAssign} className="rounded-lg bg-muted px-3 py-2 text-xs font-semibold">Cancel</button>
              </motion.div>
            ) : (
              <div className="flex gap-2">
                <button onClick={onStartAssign} className="btn-primary-glow flex flex-1 items-center justify-center gap-1.5 py-2 text-xs">
                  <UserCheck className="h-3.5 w-3.5" /> Manual Assign
                </button>
                <button onClick={onCancel} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-destructive/15 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/25">
                  <XCircle className="h-3.5 w-3.5" /> Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

function getTimeAgo(timestamp: number): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}
