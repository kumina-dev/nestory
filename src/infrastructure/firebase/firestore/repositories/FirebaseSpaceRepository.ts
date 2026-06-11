import { collectionGroup, getDocs, query, where } from "@react-native-firebase/firestore";

import type { SpaceRepository } from "../../../../application/repositories";
import type { SpaceId, UserId } from "../../../../domain/shared/ids";
import type { RelationshipSpace, SpaceMembership } from "../../../../domain/spaces/Space";
import { isoToTimestamp, memberStatusFromFirestore, memberStatusToFirestore, timestampToIso } from "../firestoreMappers";
import type { SpaceDocument, SpaceMemberDocument } from "../firestoreModels";
import { firestorePaths } from "../firestorePaths";
import { getDocument, getNestoryFirestore, listDocuments, saveDocument } from "../firestoreService";

export class FirebaseSpaceRepository implements SpaceRepository {
  async getSpaceById(spaceId: SpaceId): Promise<RelationshipSpace | null> {
    const result = await getDocument<SpaceDocument>(firestorePaths.space(spaceId));
    return result ? this.toDomainSpace(result.id, result.data, []) : null;
  }

  async listSpacesForUser(userId: UserId): Promise<RelationshipSpace[]> {
    const membersQuery = query(
      collectionGroup(getNestoryFirestore(), "members"),
      where("userId", "==", userId),
      where("status", "==", "active"),
    );

    const memberSnapshots = await getDocs(membersQuery);
    const spaceIds = memberSnapshots.docs
      .map((snapshot) => snapshot.ref.parent.parent?.id)
      .filter((spaceId): spaceId is string => Boolean(spaceId));

    const spaces = await Promise.all(spaceIds.map((spaceId) => this.getSpaceById(spaceId)));
    return spaces.filter((space): space is RelationshipSpace => Boolean(space));
  }

  async listMemberships(queryInput: { spaceId: SpaceId }): Promise<SpaceMembership[]> {
    const results = await listDocuments<SpaceMemberDocument>(firestorePaths.spaceMembers(queryInput.spaceId));
    return results.map((result) => this.toDomainMembership(queryInput.spaceId, result.id, result.data));
  }

  async getMembership(spaceId: SpaceId, userId: UserId): Promise<SpaceMembership | null> {
    const result = await getDocument<SpaceMemberDocument>(firestorePaths.spaceMember(spaceId, userId));
    return result ? this.toDomainMembership(spaceId, result.id, result.data) : null;
  }

  async saveSpace(space: RelationshipSpace): Promise<void> {
    const document: SpaceDocument = {
      name: space.name,
      ownerId: space.createdByUserId,
      createdAt: isoToTimestamp(space.createdAt),
      updatedAt: isoToTimestamp(space.createdAt),
      pointsResetInterval: "monthly",
      currentPointsPeriodStart: isoToTimestamp(space.createdAt),
      currentPointsPeriodEnd: isoToTimestamp(space.createdAt),
      archived: false,
    };

    await saveDocument<SpaceDocument>(firestorePaths.space(space.id), document);
  }

  async saveMembership(membership: SpaceMembership): Promise<void> {
    const document: SpaceMemberDocument = {
      userId: membership.userId,
      role: membership.role,
      status: memberStatusToFirestore(membership.status),
      joinedAt: isoToTimestamp(membership.joinedAt),
      displayNameSnapshot: membership.displayName,
      anonymized: false,
    };

    await saveDocument<SpaceMemberDocument>(
      firestorePaths.spaceMember(membership.spaceId, membership.userId),
      document,
    );
  }

  private toDomainSpace(id: SpaceId, document: SpaceDocument, memberIds: UserId[]): RelationshipSpace {
    return {
      id,
      name: document.name,
      createdByUserId: document.ownerId,
      createdAt: timestampToIso(document.createdAt),
      memberIds,
    };
  }

  private toDomainMembership(spaceId: SpaceId, id: string, document: SpaceMemberDocument): SpaceMembership {
    return {
      id,
      spaceId,
      userId: document.userId,
      displayName: document.displayNameSnapshot,
      role: document.role,
      status: memberStatusFromFirestore(document.status),
      joinedAt: timestampToIso(document.joinedAt),
    };
  }
}
