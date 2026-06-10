import { SpaceCalendarEvent } from "../../domain/calendar/CalendarEvent";
import { SpaceNote } from "../../domain/notes/Note";
import type { RelationshipSpace, SpaceMembership, SpaceRole } from "../../domain/spaces/Space";
import { SpaceTask } from "../../domain/tasks/Task";

export type SpaceHomePreview = {
  space: RelationshipSpace;
  memberships: SpaceMembership[];
  userRole: SpaceRole;
  carePoints: number;
  level: number;
};

export type PreviewTask = SpaceTask & {
  recurrenceLabel: string;
};

export type PreviewEvent = SpaceCalendarEvent & {
  timeLabel: string;
};

const previewSpaceId = "space_demo_nest";
const userAveryId = "user_avery";
const userJulesId = "user_jules";
const userMinaId = "user_mina";
const createdAt = "2026-06-10T18:00:00.000Z";

export const previewSpace: SpaceHomePreview = {
  space: {
    id: previewSpaceId,
    name: "The Little Nest",
    createdByUserId: userAveryId,
    createdAt,
    memberIds: [userAveryId, userJulesId, userMinaId],
  },
  memberships: [
    {
      id: "membership_avery",
      spaceId: previewSpaceId,
      userId: userAveryId,
      displayName: "Avery",
      role: "owner",
      status: "active",
      joinedAt: createdAt,
    },
    {
      id: "membership_jules",
      spaceId: previewSpaceId,
      userId: userJulesId,
      displayName: "Jules",
      role: "admin",
      status: "active",
      joinedAt: createdAt,
    },
    {
      id: "membership_mina",
      spaceId: previewSpaceId,
      userId: userMinaId,
      displayName: "Mina",
      role: "member",
      status: "active",
      joinedAt: createdAt,
    },
  ],
  userRole: "owner",
  carePoints: 42,
  level: 3,
};

export const previewTasks: PreviewTask[] = [
  {
    id: "task_tea",
    spaceId: previewSpace.space.id,
    title: "Make evening tea",
    assignedToUserId: userAveryId,
    assignedToDisplayName: "Avery",
    status: "open",
    recurrence: { kind: "daily" },
    completionMode: "selfComplete",
    carePoints: 4,
    createdByUserId: userJulesId,
    createdAt,
    recurrenceLabel: "Daily",
  },
  {
    id: "task_plants",
    spaceId: previewSpace.space.id,
    title: "Water kitchen basil",
    assignedToUserId: userMinaId,
    assignedToDisplayName: "Mina",
    status: "open",
    recurrence: { kind: "weekly", daysOfWeek: [2, 5] },
    completionMode: "assignedUserOnly",
    carePoints: 2,
    createdByUserId: userAveryId,
    createdAt,
    recurrenceLabel: "Tue, Fri",
  },
];

export const previewNotes: SpaceNote[] = [
  {
    id: "note_comfort",
    spaceId: previewSpace.space.id,
    title: "Comfort list for low-energy days",
    body: "Tea, quiet lights, and no-pressure company.",
    category: "care",
    visibility: "shared",
    ownerUserId: userJulesId,
    createdAt,
    updatedAt: createdAt,
  },
  {
    id: "note_gift",
    spaceId: previewSpace.space.id,
    title: "Birthday idea stash",
    body: "Keep this one private until the party plan is real.",
    category: "private",
    visibility: "private",
    ownerUserId: userAveryId,
    createdAt,
    updatedAt: createdAt,
  },
];

export const previewEvents: PreviewEvent[] = [
  {
    id: "event_date",
    spaceId: previewSpace.space.id,
    title: "Cozy dinner night",
    startsAt: "2026-06-10T19:00:00.000Z",
    visibility: "space",
    createdByUserId: userMinaId,
    createdAt,
    timeLabel: "Today, 19:00",
  },
];
