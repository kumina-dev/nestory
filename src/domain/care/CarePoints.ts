import type { CarePointEntryId, SpaceId, TaskId, UserId } from "../shared/ids";
import type { IsoDateTimeString } from "../shared/time";

export type CarePointPeriodKey = string;

export type CarePointSource =
  | { kind: "taskCompletion"; taskId: TaskId }
  | { kind: "monthlyReset" }
  | { kind: "manualAdjustment"; note?: string };

export type CarePointEntry = {
  id: CarePointEntryId;
  spaceId: SpaceId;
  userId: UserId;
  amount: number;
  periodKey: CarePointPeriodKey;
  source: CarePointSource;
  createdAt: IsoDateTimeString;
  createdByUserId: UserId;
};

export type CarePointAccount = {
  spaceId: SpaceId;
  userId: UserId;
  currentPeriodKey: CarePointPeriodKey;
  currentPeriodPoints: number;
  lifetimePoints: number;
  level: number;
  updatedAt: IsoDateTimeString;
};
