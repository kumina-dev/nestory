import type { NoteId, SpaceId, UserId } from "../shared/ids";
import type { IsoDateTimeString } from "../shared/time";

export type NoteVisibility = "shared" | "private";

export type NoteCategory = "care" | "home" | "plans" | "memories" | "private" | "other";

export type SpaceNote = {
  id: NoteId;
  spaceId: SpaceId;
  title: string;
  body: string;
  category: NoteCategory;
  visibility: NoteVisibility;
  ownerUserId: UserId;
  createdAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};
