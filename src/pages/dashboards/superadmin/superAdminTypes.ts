export type UserAccountStatus = "active" | "pending" | "verified" | "suspended";

export type MoroccoUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: UserAccountStatus;
  /** Driver rating (1–5); only for drivers */
  rating?: number;
  /** Set when admin validates or rejects from the dashboard (ISO datetime) */
  adminDecisionAt?: string;
  registrationDate: string;
  avatarUrl?: string;
  bookingHistory: Array<{
    id: string;
    date: string;
    title: string;
    status: "completed" | "upcoming" | "cancelled";
  }>;
};

export type GuideDayAssignment = {
  guideId: string;
  guideName: string;
  activity: string;
  city: string;
};
