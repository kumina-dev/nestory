import type { SpaceId, UserId } from "../shared/ids";
import type { IsoDateTimeString } from "../shared/time";

export type SpaceRole = "owner" | "admin" | "member";

export type SpaceMembershipStatus = "active" | "invited" | "removed";

export type RelationshipSpace = {
  id: SpaceId;
  name: string;
  createdByUserId: UserId;
  createdAt: IsoDateTimeString;
  memberIds: UserId[];
};

export type SpaceMembership = {
  id: string;
  spaceId: SpaceId;
  userId: UserId;
  displayName: string;
  role: SpaceRole;
  status: SpaceMembershipStatus;
  joinedAt: IsoDateTimeString;
};
