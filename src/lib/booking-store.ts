// In-memory booking store (will be replaced with Supabase later)
import { useState, useSyncExternalStore, useCallback } from "react";

export interface Booking {
  id: string;
  locationType: "train" | "platform";
  stationName: string;
  bags: number;
  scheduleType: "now" | "pre";
  arrivalTime?: string;
  luggageImage?: string; // base64 data URL
  estimatedCost: number;
  otp: string;
  status: "pending" | "assigned" | "completed" | "cancelled";
  assignedCoolieId?: string;
  createdAt: number;
  needsAdminAttention: boolean;
}

let bookings: Booking[] = [];
let listeners: Set<() => void> = new Set();

function emitChange() {
  listeners.forEach((l) => l());
}

export const bookingStore = {
  getSnapshot: () => bookings,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  addBooking: (
    data: Omit<Booking, "id" | "otp" | "status" | "createdAt" | "needsAdminAttention" | "estimatedCost">
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
    emitChange();
  },

  cancelBooking: (bookingId: string) => {
    bookings = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: "cancelled", needsAdminAttention: false } : b
    );
    emitChange();
  },
};

export function useBookings() {
  return useSyncExternalStore(bookingStore.subscribe, bookingStore.getSnapshot, bookingStore.getSnapshot);
}
