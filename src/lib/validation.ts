// Client-side input validation utilities

export const LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 100,
  MOBILE_LENGTH: 10,
  STATION_MIN: 2,
  STATION_MAX: 100,
  TRAIN_NAME_MAX: 80,
  TRAIN_NUMBER_MAX: 10,
  COACH_MAX: 10,
  SEAT_MAX: 10,
  BAGS_MIN: 1,
  BAGS_MAX: 10,
  EXPERIENCE_MAX: 50,
} as const;

const MOBILE_REGEX = /^[6-9]\d{9}$/;
const NAME_REGEX = /^[a-zA-Z\s.'-]+$/;
const TRAIN_NUMBER_REGEX = /^[0-9]{4,5}$/;
const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9\s\-/]+$/;

export interface ValidationError {
  field: string;
  message: string;
}

export function validateName(name: string, field = "Name"): string | null {
  const trimmed = name.trim();
  if (!trimmed) return `${field} is required`;
  if (trimmed.length < LIMITS.NAME_MIN) return `${field} must be at least ${LIMITS.NAME_MIN} characters`;
  if (trimmed.length > LIMITS.NAME_MAX) return `${field} must be less than ${LIMITS.NAME_MAX} characters`;
  if (!NAME_REGEX.test(trimmed)) return `${field} contains invalid characters`;
  return null;
}

export function validateMobile(mobile: string): string | null {
  const trimmed = mobile.trim();
  if (!trimmed) return "Mobile number is required";
  if (!MOBILE_REGEX.test(trimmed)) return "Enter a valid 10-digit Indian mobile number";
  return null;
}

export function validateStation(station: string): string | null {
  const trimmed = station.trim();
  if (!trimmed) return "Station name is required";
  if (trimmed.length < LIMITS.STATION_MIN) return "Station name too short";
  if (trimmed.length > LIMITS.STATION_MAX) return "Station name too long";
  if (!ALPHANUMERIC_REGEX.test(trimmed)) return "Station name contains invalid characters";
  return null;
}

export function validateTrainNumber(trainNumber: string): string | null {
  if (!trainNumber.trim()) return null; // optional
  if (!TRAIN_NUMBER_REGEX.test(trainNumber.trim())) return "Enter a valid 4-5 digit train number";
  return null;
}

export function validateTrainName(trainName: string): string | null {
  if (!trainName.trim()) return null; // optional
  if (trainName.trim().length > LIMITS.TRAIN_NAME_MAX) return "Train name too long";
  return null;
}

export function validateCoachSeat(value: string, field: string): string | null {
  if (!value.trim()) return null; // optional
  if (value.trim().length > LIMITS.COACH_MAX) return `${field} too long`;
  if (!ALPHANUMERIC_REGEX.test(value.trim())) return `${field} contains invalid characters`;
  return null;
}

export function validateExperience(value: string): string | null {
  if (!value.trim()) return null;
  const num = Number(value);
  if (isNaN(num) || num < 0) return "Experience must be a positive number";
  if (num > LIMITS.EXPERIENCE_MAX) return `Experience cannot exceed ${LIMITS.EXPERIENCE_MAX} years`;
  return null;
}

export function sanitizeInput(value: string, maxLength: number): string {
  return value.slice(0, maxLength).replace(/[<>{}]/g, "");
}

// Booking form validation
export function validateBookingStep0(data: {
  passengerName: string;
  passengerMobile: string;
  trainName: string;
  trainNumber: string;
  coachNumber: string;
  seatNumber: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];
  const nameErr = validateName(data.passengerName, "Name");
  if (nameErr) errors.push({ field: "passengerName", message: nameErr });
  const mobileErr = validateMobile(data.passengerMobile);
  if (mobileErr) errors.push({ field: "passengerMobile", message: mobileErr });
  const trainNameErr = validateTrainName(data.trainName);
  if (trainNameErr) errors.push({ field: "trainName", message: trainNameErr });
  const trainNumErr = validateTrainNumber(data.trainNumber);
  if (trainNumErr) errors.push({ field: "trainNumber", message: trainNumErr });
  const coachErr = validateCoachSeat(data.coachNumber, "Coach");
  if (coachErr) errors.push({ field: "coachNumber", message: coachErr });
  const seatErr = validateCoachSeat(data.seatNumber, "Seat");
  if (seatErr) errors.push({ field: "seatNumber", message: seatErr });
  return errors;
}

export function validateBookingStep1(data: {
  locationType: string | null;
  stationName: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!data.locationType) errors.push({ field: "locationType", message: "Select a location type" });
  if (data.locationType) {
    const stationErr = validateStation(data.stationName);
    if (stationErr) errors.push({ field: "stationName", message: stationErr });
  }
  return errors;
}

// Coolie onboarding validation
export function validateCoolieApplication(data: {
  name: string;
  mobile: string;
  station: string;
  experience: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];
  const nameErr = validateName(data.name, "Name");
  if (nameErr) errors.push({ field: "name", message: nameErr });
  const mobileErr = validateMobile(data.mobile);
  if (mobileErr) errors.push({ field: "mobile", message: mobileErr });
  const stationErr = validateStation(data.station);
  if (stationErr) errors.push({ field: "station", message: stationErr });
  const expErr = validateExperience(data.experience);
  if (expErr) errors.push({ field: "experience", message: expErr });
  return errors;
}
