// In-memory booking & coolie store (will be replaced with Supabase later)
import { useSyncExternalStore } from "react";

/* ─── Coolie Profile ─── */
export interface CoolieProfile {
  id: string;
  name: string;
  photo: string; // URL or placeholder
  station: string;
  badge: string;
  rating: number;
  totalAccepted: number;
  totalRejected: number;
  totalCompleted: number;
  isOnline: boolean;
}

/* ─── Booking ─── */
export interface Booking {
  id: string;
  locationType: "train" | "platform";
  stationName: string;
  bags: number;
  scheduleType: "now" | "pre";
  arrivalTime?: string;
  luggageImage?: string;
  estimatedCost: number;
  otp: string;
  status: "pending" | "assigned" | "completed" | "cancelled" | "rejected";
  assignedCoolieId?: string;
  createdAt: number;
  needsAdminAttention: boolean;
  passengerName: string;
}

/* ─── Mock Coolies ─── */
const MOCK_COOLIES: CoolieProfile[] = [
  {
    id: "CL-1001",
    name: "Raju Kumar",
    photo: "https://api.dicebear.com/9.x/adventurer/svg?seed=Raju",
    station: "New Delhi Railway Station",
    badge: "Gold",
    rating: 4.8,
    totalAccepted: 142,
    totalRejected: 8,
    totalCompleted: 138,
    isOnline: true,
  },
  {
    id: "CL-1002",
    name: "Suresh Yadav",
    photo: "https://api.dicebear.com/9.x/adventurer/svg?seed=Suresh",
    station: "New Delhi Railway Station",
    badge: "Silver",
    rating: 4.5,
    totalAccepted: 89,
    totalRejected: 12,
    totalCompleted: 82,
    isOnline: true,
  },
  {
    id: "CL-1003",
    name: "Mohan Lal",
    photo: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mohan",
    station: "Mumbai CST",
    badge: "Bronze",
    rating: 4.2,
    totalAccepted: 56,
    totalRejected: 15,
    totalCompleted: 50,
    isOnline: false,
  },
  {
    id: "CL-1004",
    name: "Vikram Singh",
    photo: "https://api.dicebear.com/9.x/adventurer/svg?seed=Vikram",
    station: "New Delhi Railway Station",
    badge: "Gold",
    rating: 4.9,
    totalAccepted: 210,
    totalRejected: 5,
    totalCompleted: 205,
    isOnline: true,
  },
  {
    id: "CL-1005",
    name: "Deepak Sharma",
    photo: "https://api.dicebear.com/9.x/adventurer/svg?seed=Deepak",
    station: "Howrah Junction",
    badge: "Silver",
    rating: 4.6,
    totalAccepted: 97,
    totalRejected: 10,
    totalCompleted: 90,
    isOnline: true,
  },
];

/* ─── Store State ─── */
let bookings: Booking[] = [];
let coolies: CoolieProfile[] = [...MOCK_COOLIES];
let activeCoolieId: string | null = null; // simulates logged-in coolie
let listeners: Set<() => void> = new Set();

function emitChange() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/* ─── Booking Store ─── */
export const bookingStore = {
  getSnapshot: () => bookings,
  subscribe,

  addBooking: (
    data: Omit<Booking, "id" | "otp" | "status" | "createdAt" | "needsAdminAttention" | "estimatedCost" | "passengerName"> & { passengerName?: string }
  ) => {
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    const booking: Booking = {
      ...data,
      id: crypto.randomUUID(),
      otp,
      status: "pending",
      estimatedCost: data.bags * 50,
      createdAt: Date.now(),
      needsAdminAttention: false,
      passengerName: data.passengerName || "Passenger",
    };
    bookings = [booking, ...bookings];
    emitChange();

    // After 2 minutes, flag for admin attention if still pending
    setTimeout(() => {
      const current = bookings.find((b) => b.id === booking.id);
      if (current && current.status === "pending") {
        bookings = bookings.map((b) =>
          b.id === booking.id ? { ...b, needsAdminAttention: true } : b
        );
        emitChange();
      }
    }, 2 * 60 * 1000);

    return booking;
  },

  assignCoolie: (bookingId: string, coolieId: string) => {
    bookings = bookings.map((b) =>
      b.id === bookingId
        ? { ...b, status: "assigned", assignedCoolieId: coolieId, needsAdminAttention: false }
        : b
    );
    // Increment coolie accepted count
    coolies = coolies.map((c) =>
      c.id === coolieId ? { ...c, totalAccepted: c.totalAccepted + 1 } : c
    );
    emitChange();
  },

  acceptBooking: (bookingId: string, coolieId: string) => {
    bookings = bookings.map((b) =>
      b.id === bookingId
        ? { ...b, status: "assigned", assignedCoolieId: coolieId, needsAdminAttention: false }
        : b
    );
    coolies = coolies.map((c) =>
      c.id === coolieId ? { ...c, totalAccepted: c.totalAccepted + 1 } : c
    );
    emitChange();
  },

  rejectBooking: (bookingId: string, coolieId: string) => {
    // Coolie rejects — booking stays pending for others
    coolies = coolies.map((c) =>
      c.id === coolieId ? { ...c, totalRejected: c.totalRejected + 1 } : c
    );
    emitChange();
  },

  completeBooking: (bookingId: string) => {
    bookings = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: "completed" } : b
    );
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking?.assignedCoolieId) {
      coolies = coolies.map((c) =>
        c.id === booking.assignedCoolieId ? { ...c, totalCompleted: c.totalCompleted + 1 } : c
      );
    }
    emitChange();
  },

  cancelBooking: (bookingId: string) => {
    bookings = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: "cancelled", needsAdminAttention: false } : b
    );
    emitChange();
  },
};

/* ─── Coolie Store ─── */
export const coolieStore = {
  getSnapshot: () => coolies,
  subscribe,

  getCoolie: (id: string) => coolies.find((c) => c.id === id),

  getActiveCoolieId: () => activeCoolieId,
  setActiveCoolie: (id: string | null) => {
    activeCoolieId = id;
    emitChange();
  },

  getAllCoolies: () => coolies,
};

/* ─── Hooks ─── */
export function useBookings() {
  return useSyncExternalStore(subscribe, bookingStore.getSnapshot, bookingStore.getSnapshot);
}

export function useCoolies() {
  return useSyncExternalStore(subscribe, coolieStore.getSnapshot, coolieStore.getSnapshot);
}

export function useActiveCoolieId() {
  return useSyncExternalStore(
    subscribe,
    coolieStore.getActiveCoolieId,
    coolieStore.getActiveCoolieId
  );
}
