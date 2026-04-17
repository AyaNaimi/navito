export type UserRole = "superadmin" | "driver" | "guide";
export type CallStatus = "idle" | "ringing" | "connected" | "ended";

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  fare: number;
  travelTimeMin: number;
  distanceKm: number;
  pickupCoords: [number, number];
  destinationCoords: [number, number];
  status: "pending" | "active" | "completed";
  requestedAt: string;
}

export interface Booking {
  id: string;
  touristName: string;
  date: string;
  destination: string;
  groupSize: number;
  status: "upcoming" | "in_progress" | "completed";
}
