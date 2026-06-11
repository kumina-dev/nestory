import type { CalendarEventId, SpaceId, UserId } from "../../../domain/shared/ids";
import { SpacePermissionPolicy } from "../../policies";
import type { CalendarEventRepository, SpaceRepository } from "../../repositories";

export type DeleteCalendarEventInput = {
  spaceId: SpaceId;
  eventId: CalendarEventId;
  requesterUserId: UserId;
};

export type DeleteCalendarEventDependencies = {
  spaceRepository: SpaceRepository;
  calendarEventRepository: CalendarEventRepository;
  permissionPolicy?: SpacePermissionPolicy;
};

export class DeleteCalendarEventUseCase {
  constructor(private readonly dependencies: DeleteCalendarEventDependencies) {}

  async execute(input: DeleteCalendarEventInput): Promise<void> {
    const [membership, existingEvent] = await Promise.all([
      this.dependencies.spaceRepository.getMembership(input.spaceId, input.requesterUserId),
      this.dependencies.calendarEventRepository.getEventById(input.spaceId, input.eventId),
    ]);

    if (!membership || membership.status !== "active") {
      throw new DeleteCalendarEventError("space-access-denied");
    }

    if (!existingEvent) {
      throw new DeleteCalendarEventError("event-not-found");
    }

    if (!this.getPermissionPolicy().canManageContent(membership, existingEvent.createdByUserId)) {
      throw new DeleteCalendarEventError("event-delete-not-allowed");
    }

    await this.dependencies.calendarEventRepository.deleteEvent(input.spaceId, input.eventId);
  }

  private getPermissionPolicy(): SpacePermissionPolicy {
    return this.dependencies.permissionPolicy ?? new SpacePermissionPolicy();
  }
}

export type DeleteCalendarEventErrorCode =
  | "space-access-denied"
  | "event-not-found"
  | "event-delete-not-allowed";

export class DeleteCalendarEventError extends Error {
  constructor(readonly code: DeleteCalendarEventErrorCode) {
    super(code);
    this.name = "DeleteCalendarEventError";
  }
}
