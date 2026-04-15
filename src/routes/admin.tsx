import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { useBookings, bookingStore, type Booking } from "@/lib/booking-store";
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
  const bookings = useBookings();
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [coolieInput, setCoolieInput] = useState("");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const attentionCount = bookings.filter((b) => b.needsAdminAttention).length;

  const handleAssign = (bookingId: string) => {
    if (coolieInput.trim()) {
      bookingStore.assignCoolie(bookingId, coolieInput.trim());
      setAssigningId(null);
      setCoolieInput("");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 pt-8 pb-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Live Booking Management</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <GlassCard className="p-3 text-center">
          <p className="text-2xl font-bold">{bookings.length}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <p className="text-2xl font-bold text-warning">{pendingCount}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </GlassCard>
        <GlassCard className={`p-3 text-center ${attentionCount > 0 ? "!border-destructive/50" : ""}`}>
          <p className="text-2xl font-bold text-destructive">{attentionCount}</p>
          <p className="text-xs text-muted-foreground">Attention</p>
        </GlassCard>
      </div>

      {/* Bookings List */}
      {bookings.length === 0 ? (
        <GlassCard className="py-12 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No bookings yet</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Bookings from /book will appear here in real-time
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isAssigning={assigningId === booking.id}
                coolieInput={coolieInput}
                onStartAssign={() => {
                  setAssigningId(booking.id);
                  setCoolieInput("");
                }}
                onCancelAssign={() => setAssigningId(null)}
                onCoolieInputChange={setCoolieInput}
                onConfirmAssign={() => handleAssign(booking.id)}
                onCancel={() => bookingStore.cancelBooking(booking.id)}
                onImageClick={(src) => setLightboxImage(src)}
              />
            ))}
          </AnimatePresence>
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
              <img
                src={lightboxImage}
                alt="Luggage"
                className="max-h-[80vh] rounded-xl object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Booking Card ─── */
interface BookingCardProps {
  booking: Booking;
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
  booking,
  isAssigning,
  coolieInput,
  onStartAssign,
  onCancelAssign,
  onCoolieInputChange,
  onConfirmAssign,
  onCancel,
  onImageClick,
}: BookingCardProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-warning/20 text-warning",
    assigned: "bg-success/20 text-success",
    completed: "bg-primary/20 text-primary",
    cancelled: "bg-destructive/20 text-destructive",
  };

  const timeAgo = getTimeAgo(booking.createdAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <GlassCard
        className={`relative overflow-hidden ${booking.needsAdminAttention ? "!border-destructive/60 ring-1 ring-destructive/30" : ""}`}
      >
        {/* Admin Attention Flag */}
        {booking.needsAdminAttention && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-destructive/15 px-3 py-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            <span className="text-xs font-semibold text-destructive">Admin Attention — No coolie response</span>
          </div>
        )}

        {/* Top row: status + time */}
        <div className="mb-3 flex items-center justify-between">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${statusColors[booking.status]}`}>
            {booking.status}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" /> {timeAgo}
          </span>
        </div>

        {/* Info row */}
        <div className="mb-3 flex items-start gap-3">
          {/* Luggage thumbnail */}
          {booking.luggageImage ? (
            <button
              onClick={() => onImageClick(booking.luggageImage!)}
              className="shrink-0 overflow-hidden rounded-lg border border-glass-border"
            >
              <img
                src={booking.luggageImage}
                alt="Luggage"
                className="h-14 w-14 object-cover transition hover:scale-110"
              />
            </button>
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted/30">
              <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
            </div>
          )}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              {booking.locationType === "train" ? (
                <Train className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Landmark className="h-3.5 w-3.5 text-accent" />
              )}
              {booking.stationName || "Unknown Station"}
            </div>
            <p className="text-xs text-muted-foreground">
              {booking.bags} bag{booking.bags !== 1 ? "s" : ""} · ₹{booking.estimatedCost} ·{" "}
              {booking.scheduleType === "pre" ? "Pre-booked" : "Instant"}
            </p>
            <p className="text-xs text-muted-foreground">OTP: <span className="font-mono font-bold text-primary">{booking.otp}</span></p>
            {booking.assignedCoolieId && (
              <p className="text-xs text-success font-semibold">Coolie: {booking.assignedCoolieId}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {booking.status === "pending" && (
          <div className="space-y-2">
            {isAssigning ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coolie ID"
                  value={coolieInput}
                  onChange={(e) => onCoolieInputChange(e.target.value)}
                  className="glass-input flex-1 px-3 py-2 text-sm"
                  autoFocus
                />
                <button onClick={onConfirmAssign} className="btn-primary-glow px-3 py-2 text-xs">
                  Assign
                </button>
                <button onClick={onCancelAssign} className="rounded-lg bg-muted px-3 py-2 text-xs font-semibold">
                  Cancel
                </button>
              </motion.div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={onStartAssign}
                  className="btn-primary-glow flex flex-1 items-center justify-center gap-1.5 py-2 text-xs"
                >
                  <UserCheck className="h-3.5 w-3.5" /> Manual Assign
                </button>
                <button
                  onClick={onCancel}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-destructive/15 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/25"
                >
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
