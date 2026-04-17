import type { GuideDayAssignment, MoroccoUserRow } from "./superAdminTypes";

/** Mock data for Morocco Travel Assistant — Super Admin */
export const moroccoSuperAdminUsers: MoroccoUserRow[] = [
  {
    id: "USR-001",
    name: "Youssef Alami",
    email: "youssef.driver@mta.ma",
    role: "driver",
    status: "verified",
    rating: 4.8,
    registrationDate: "2024-01-15",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    bookingHistory: [
      { id: "BK-9001", date: "2026-03-28", title: "Airport → Medina", status: "completed" },
      { id: "BK-9002", date: "2026-03-30", title: "Coastal day trip", status: "upcoming" },
    ],
  },
  {
    id: "USR-002",
    name: "Amina Benkirane",
    email: "amina.guide@mta.ma",
    role: "guide",
    status: "verified",
    registrationDate: "2023-11-02",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    bookingHistory: [
      { id: "BK-9101", date: "2026-03-25", title: "Historic Quarter Walk", status: "completed" },
      { id: "BK-9102", date: "2026-04-02", title: "Food & Culture Trail", status: "upcoming" },
    ],
  },
  {
    id: "USR-003",
    name: "Lina Verstraeten",
    email: "lina.tourist@mta.ma",
    role: "tourist",
    status: "active",
    registrationDate: "2025-06-10",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80",
    bookingHistory: [
      { id: "BK-9201", date: "2026-02-14", title: "Atlas day excursion", status: "completed" },
    ],
  },
  {
    id: "USR-004",
    name: "Omar Tazi",
    email: "omar.driver@mta.ma",
    role: "driver",
    status: "pending",
    rating: 4.2,
    registrationDate: "2026-03-01",
    bookingHistory: [],
  },
  {
    id: "USR-005",
    name: "Karim El Fassi",
    email: "karim.driver@mta.ma",
    role: "driver",
    status: "pending",
    rating: 4.9,
    registrationDate: "2026-03-20",
    bookingHistory: [],
  },
  {
    id: "USR-006",
    name: "Sophie Martin",
    email: "sophie.tourist@mta.ma",
    role: "tourist",
    status: "active",
    registrationDate: "2025-12-01",
    bookingHistory: [],
  },
];

/** Guides scheduled per day (YYYY-MM-DD) */
export const guidesByDate: Record<string, GuideDayAssignment[]> = {
  "2026-04-01": [
    {
      guideId: "GDE-201",
      guideName: "Amina Benkirane",
      activity: "Medina & Souks orientation",
      city: "Fès",
    },
    {
      guideId: "GDE-202",
      guideName: "Salma Idrissi",
      activity: "Chefchaouen blue lanes",
      city: "Chefchaouen",
    },
  ],
  "2026-04-03": [
    {
      guideId: "GDE-201",
      guideName: "Amina Benkirane",
      activity: "Historic Quarter Walk",
      city: "Fès",
    },
  ],
  "2026-04-05": [
    {
      guideId: "GDE-203",
      guideName: "Hicham El Mansouri",
      activity: "Desert camp handover",
      city: "Merzouga",
    },
    {
      guideId: "GDE-202",
      guideName: "Salma Idrissi",
      activity: "Photography sunset tour",
      city: "Chefchaouen",
    },
  ],
  "2026-04-10": [
    {
      guideId: "GDE-201",
      guideName: "Amina Benkirane",
      activity: "Food & Culture Trail",
      city: "Marrakech",
    },
  ],
};
