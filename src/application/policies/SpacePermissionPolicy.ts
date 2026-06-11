import type { UserId } from "../../domain/shared/ids";
import type { SpaceMembership } from "../../domain/spaces/Space";

export class SpacePermissionPolicy {
  canCreateSpaceContent(membership: SpaceMembership | null): boolean {
    return membership?.status === "active";
  }

  canManageContent(membership: SpaceMembership | null, creatorUserId: UserId): boolean {
    if (!membership || membership.status !== "active") {
      return false;
    }

    return membership.userId === creatorUserId || membership.role === "owner" || membership.role === "admin";
  }

  canReadPrivateNote(membership: SpaceMembership | null, ownerUserId: UserId): boolean {
    if (!membership || membership.status !== "active") {
      return false;
    }

    return membership.userId === ownerUserId;
  }
}
