import type { Booking, Trip } from "./types";

export const monthlyRevenue = [
  { month: "Jan", revenue: 8400, trips: 220 },
  { month: "Feb", revenue: 9200, trips: 248 },
  { month: "Mar", revenue: 10100, trips: 271 },
  { month: "Apr", revenue: 11600, trips: 293 },
  { month: "May", revenue: 12400, trips: 315 },
  { month: "Jun", revenue: 13600, trips: 348 },
];

export const driverRequests: Trip[] = [
  {
    id: "TRP-1001",
    origin: "Airport Terminal 2",
    destination: "Old Medina",
    fare: 70,
    travelTimeMin: 24,
    distanceKm: 12.4,
    pickupCoords: [34.0494, -6.7516],
    destinationCoords: [34.0242, -6.8361],
    status: "pending",
    requestedAt: "2 min ago",
  },
  {
    id: "TRP-1002",
    origin: "City Center",
    destination: "Blue Port",
    fare: 55,
    travelTimeMin: 14,
    distanceKm: 7.1,
    pickupCoords: [34.0209, -6.8416],
    destinationCoords: [34.0072, -6.8289],
    status: "pending",
    requestedAt: "5 min ago",
  },
  {
    id: "TRP-1003",
    origin: "Museum District",
    destination: "Sunset Boulevard",
    fare: 62,
    travelTimeMin: 18,
    distanceKm: 9.3,
    pickupCoords: [34.0357, -6.8094],
    destinationCoords: [34.0491, -6.7747],
    status: "active",
    requestedAt: "Live",
  },
];

export const guideBookings: Booking[] = [
  {
    id: "BK-201",
    touristName: "Emma Johnson",
    date: "2026-04-03",
    destination: "Historic Quarter Walk",
    groupSize: 4,
    status: "upcoming",
  },
  {
    id: "BK-202",
    touristName: "Luca Rossi",
    date: "2026-04-04",
    destination: "Mountain Village Tour",
    groupSize: 2,
    status: "upcoming",
  },
  {
    id: "BK-203",
    touristName: "Amina Saeed",
    date: "2026-03-31",
    destination: "Food & Culture Trail",
    groupSize: 6,
    status: "in_progress",
  },
];

export const adminUsers = [
  {
    id: "USR-001",
    name: "Youssef Driver",
    email: "youssef.driver@navito.app",
    role: "driver",
    status: "verified",
    city: "Marrakech",
  },
  {
    id: "USR-002",
    name: "Amina Guide",
    email: "amina.guide@navito.app",
    role: "guide",
    status: "verified",
    city: "Fes",
  },
  {
    id: "USR-003",
    name: "Lina Tourist",
    email: "lina.tourist@navito.app",
    role: "tourist",
    status: "active",
    city: "Rabat",
  },
  {
    id: "USR-004",
    name: "Omar Driver",
    email: "omar.driver@navito.app",
    role: "driver",
    status: "pending",
    city: "Casablanca",
  },
];

export const adminDrivers = [
  {
    id: "DRV-101",
    name: "Youssef Driver",
    vehicle: "Toyota Prius",
    city: "Marrakech",
    rating: 4.9,
    trips: 238,
    verification: "verified",
  },
  {
    id: "DRV-102",
    name: "Omar Driver",
    vehicle: "Dacia Logan",
    city: "Casablanca",
    rating: 4.6,
    trips: 96,
    verification: "pending",
  },
];

export const adminGuides = [
  {
    id: "GDE-201",
    name: "Amina Guide",
    language: "French, English, Arabic",
    city: "Fes",
    rating: 4.8,
    tours: 154,
    verification: "verified",
  },
  {
    id: "GDE-202",
    name: "Salma Guide",
    language: "Spanish, English",
    city: "Chefchaouen",
    rating: 4.7,
    tours: 88,
    verification: "pending",
  },
];

export const adminActivities = [
  {
    id: "ACT-301",
    title: "Medina Street Food Walk",
    city: "Marrakech",
    host: "Amina Guide",
    participants: 14,
    status: "published",
  },
  {
    id: "ACT-302",
    title: "Atlas Sunrise Tour",
    city: "Imlil",
    host: "Salma Guide",
    participants: 7,
    status: "review",
  },
  {
    id: "ACT-303",
    title: "Desert Evening Camp",
    city: "Merzouga",
    host: "Travel Ops Team",
    participants: 21,
    status: "published",
  },
];
