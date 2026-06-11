import { Timestamp } from "@react-native-firebase/firestore";

import type { IsoDateTimeString } from "../../../domain/shared/time";
import type { SpaceMembershipStatus } from "../../../domain/spaces/Space";
import type { TaskRecurrence } from "../../../domain/tasks/Task";
import type { RecurrenceRuleDocument, SpaceMemberDocument } from "./firestoreModels";

export function isoToTimestamp(value: IsoDateTimeString): Timestamp {
  return Timestamp.fromDate(new Date(value));
}

export function timestampToIso(value: Timestamp): IsoDateTimeString {
  return value.toDate().toISOString();
}

export function memberStatusFromFirestore(status: SpaceMemberDocument["status"]): SpaceMembershipStatus {
  return status === "active" ? "active" : "removed";
}

export function memberStatusToFirestore(status: SpaceMembershipStatus): SpaceMemberDocument["status"] {
  return status === "active" ? "active" : "left";
}

export function recurrenceFromFirestore(rule?: RecurrenceRuleDocument | null): TaskRecurrence {
  if (!rule) {
    return { kind: "none" };
  }

  if (rule.frequency === "daily") {
    return { kind: "daily" };
  }

  if (rule.frequency === "weekly") {
    return { kind: "weekly", daysOfWeek: rule.byWeekday ?? [] };
  }

  if (rule.frequency === "monthly") {
    return { kind: "monthly", daysOfMonth: rule.byMonthDay ?? [] };
  }

  return { kind: "none" };
}

export function recurrenceToFirestore(recurrence: TaskRecurrence): RecurrenceRuleDocument | null {
  if (recurrence.kind === "none") {
    return null;
  }

  if (recurrence.kind === "daily") {
    return { frequency: "daily", interval: 1 };
  }

  if (recurrence.kind === "weekly") {
    return { frequency: "weekly", interval: 1, byWeekday: recurrence.daysOfWeek };
  }

  return { frequency: "monthly", interval: 1, byMonthDay: recurrence.daysOfMonth };
}
