import type { SpaceId, TaskId, UserId } from "../shared/ids";
import type { IsoDateTimeString } from "../shared/time";

export type TaskStatus = "open" | "completed" | "archived";

export type TaskRecurrence =
  | { kind: "none" }
  | { kind: "daily" }
  | { kind: "weekly"; daysOfWeek: number[] }
  | { kind: "monthly"; daysOfMonth: number[] };

export type TaskCompletionMode = "anyone" | "assignedUserOnly" | "selfComplete";

export type SpaceTask = {
  id: TaskId;
  spaceId: SpaceId;
  title: string;
  description?: string;
  assignedToUserId?: UserId;
  assignedToDisplayName?: string;
  status: TaskStatus;
  recurrence: TaskRecurrence;
  completionMode: TaskCompletionMode;
  carePoints: number;
  createdByUserId: UserId;
  createdAt: IsoDateTimeString;
  completedAt?: IsoDateTimeString;
  completedByUserId?: UserId;
};
