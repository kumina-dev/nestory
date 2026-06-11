import type { Timestamp } from "@react-native-firebase/firestore";

export type FirestoreTimestamp = Timestamp;

export type UserProfileDocument = {
  displayName: string;
  email: string;
  photoURL?: string | null;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  level: number;
  totalLifetimePoints: number;
};

export type SpaceDocument = {
  name: string;
  ownerId: string;
  theme?: string | null;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  pointsResetInterval: "monthly" | "weekly" | "custom";
  currentPointsPeriodStart: FirestoreTimestamp;
  currentPointsPeriodEnd: FirestoreTimestamp;
  archived: boolean;
};

export type SpaceMemberDocument = {
  userId: string;
  role: "owner" | "admin" | "member";
  status: "active" | "left";
  joinedAt: FirestoreTimestamp;
  leftAt?: FirestoreTimestamp | null;
  displayNameSnapshot: string;
  anonymized: boolean;
};

export type RecurrenceRuleDocument = {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  byWeekday?: number[];
  byMonthDay?: number[];
  until?: FirestoreTimestamp | null;
  count?: number | null;
};

export type TaskDocument = {
  title: string;
  description?: string | null;
  date?: FirestoreTimestamp | null;
  recurrenceRule?: RecurrenceRuleDocument | null;
  assignedUserIds: string[];
  points: number;
  status: "open" | "completed" | "archived";
  createdBy: string;
  completedBy?: string | null;
  completedAt?: FirestoreTimestamp | null;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
};

export type NoteContentBlockDocument = {
  id: string;
  type: "text" | "markdown" | "checklist";
  text?: string;
  checked?: boolean;
};

export type NoteDocument = {
  title: string;
  contentBlocks: NoteContentBlockDocument[];
  categoryIds: string[];
  visibility: "space" | "private";
  visibleToUserIds?: string[];
  createdBy: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  archived: boolean;
};

export type CalendarEventDocument = {
  title: string;
  description?: string | null;
  startAt: FirestoreTimestamp;
  endAt: FirestoreTimestamp;
  allDay: boolean;
  createdBy: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
  archived: boolean;
};

export type CategoryDocument = {
  name: string;
  color?: string | null;
  type: "note" | "task" | "event";
  createdBy: string;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
};

export type PointEventDocument = {
  userId: string;
  taskId?: string | null;
  points: number;
  reason: "task_completed" | "manual_adjustment" | "task_uncompleted";
  createdBy: string;
  createdAt: FirestoreTimestamp;
};

export type PointsPeriodDocument = {
  startAt: FirestoreTimestamp;
  endAt: FirestoreTimestamp;
  userPoints: Record<string, number>;
  createdAt: FirestoreTimestamp;
  closedAt?: FirestoreTimestamp | null;
};
