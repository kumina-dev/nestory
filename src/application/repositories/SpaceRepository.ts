import type { SpaceId, UserId } from "../../domain/shared/ids";
import type { RelationshipSpace, SpaceMembership } from "../../domain/spaces/Space";

export type SpaceMembershipQuery = {
  spaceId: SpaceId;
};

export interface SpaceRepository {
  getSpaceId(spaceId: SpaceId): Promise<RelationshipSpace | null>;
  listSpacesForUser(userId: UserId): Promise<RelationshipSpace[]>;
  listMemberships(query: SpaceMembershipQuery): Promise<SpaceMembership[]>;
  getMembership(spaceId: SpaceId, userId: UserId): Promise<SpaceMembership | null>;
  saveSpace(space: RelationshipSpace): Promise<void>;
  saveMembership(membership: SpaceMembership): Promise<void>;
}
