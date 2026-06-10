export type SpaceRole = "owner" | "admin" | "member";

export type SpaceHomePreview = {
  id: string;
  name: string;
  memberSummary: string;
  userRole: SpaceRole;
  carePoints: number;
  level: number;
};

export type PreviewTask = {
  id: string;
  spaceId: string;
  title: string;
  assignedTo: string;
  carePoints: number;
  recurrenceLabel: string;
};

export type PreviewNote = {
  id: string;
  spaceId: string;
  title: string;
  category: string;
  visibility: "shared" | "private";
};

export type PreviewEvent = {
  id: string;
  spaceId: string;
  title: string;
  timeLabel: string;
};

export const previewSpace: SpaceHomePreview = {
  id: "space_demo_nest",
  name: "The Little Nest",
  memberSummary: "Avery, Jules, and Mina",
  userRole: "owner",
  carePoints: 42,
  level: 3,
};

export const previewTasks: PreviewTask[] = [
  {
    id: "task_tea",
    spaceId: previewSpace.id,
    title: "Make evening tea",
    assignedTo: "Avery",
    carePoints: 4,
    recurrenceLabel: "Daily",
  },
  {
    id: "task_plants",
    spaceId: previewSpace.id,
    title: "Water kitchen basil",
    assignedTo: "Mina",
    carePoints: 2,
    recurrenceLabel: "Tue, Fri",
  },
];

export const previewNotes: PreviewNote[] = [
  {
    id: "note_comfort",
    spaceId: previewSpace.id,
    title: "Comfort list for low-energy days",
    category: "Care",
    visibility: "shared",
  },
  {
    id: "note_gift",
    spaceId: previewSpace.id,
    title: "Birthday idea stash",
    category: "Private",
    visibility: "private",
  },
];

export const previewEvents: PreviewEvent[] = [
  {
    id: "event_date",
    spaceId: previewSpace.id,
    title: "Cozy dinner night",
    timeLabel: "Today, 19:00",
  },
];
