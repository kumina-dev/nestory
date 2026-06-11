import type { SpaceCalendarEvent } from "../../../domain/calendar/CalendarEvent";
import type { CalendarEventId, SpaceId, UserId } from "../../../domain/shared/ids";
import type { IsoDateTimeString } from "../../../domain/shared/time";
import { SpacePermissionPolicy } from "../../policies";
import type { CalendarEventRepository, SpaceRepository } from "../../repositories";

export type UpdateCalendarEventInput = {
  spaceId: SpaceId;
  eventId: CalendarEventId;
  requesterUserId: UserId;
  title?: string;
  description?: string;
  startsAt?: IsoDateTimeString;
  endsAt?: IsoDateTimeString;
};

export type UpdateCalendarEventDependencies = {
  spaceRepository: SpaceRepository;
  calendarEventRepository: CalendarEventRepository;
  permissionPolicy?: SpacePermissionPolicy;
};

export class UpdateCalendarEventUseCase {
  constructor(private readonly dependencies: UpdateCalendarEventDependencies) {}

  async execute(input: UpdateCalendarEventInput): Promise<SpaceCalendarEvent> {
    const [membership, existingEvent] = await Promise.all([
      this.dependencies.spaceRepository.getMembership(input.spaceId, input.requesterUserId),
      this.dependencies.calendarEventRepository.getEventById(input.spaceId, input.eventId),
    ]);

    if (!membership || membership.status !== "active") {
      throw new UpdateCalendarEventError("space-access-denied");
    }

    if (!existingEvent) {
      throw new UpdateCalendarEventError("event-not-found");
    }

    if (!this.getPermissionPolicy().canManageContent(membership, existingEvent.createdByUserId)) {
      throw new UpdateCalendarEventError("event-update-not-allowed");
    }

    const nextTitle = input.title === undefined ? existingEvent.title : input.title.trim();
    const nextStartsAt = input.startsAt ?? existingEvent.startsAt;
    const nextEndsAt = input.endsAt === undefined ? existingEvent.endsAt : input.endsAt;

    if (!nextTitle) {
      throw new UpdateCalendarEventError("title-required");
    }

    if (nextEndsAt && nextEndsAt <= nextStartsAt) {
      throw new UpdateCalendarEventError("invalid-time-range");
    }

    const updatedEvent: SpaceCalendarEvent = {
      ...existingEvent,
      title: nextTitle,
      description: input.description === undefined ? existingEvent.description : input.description.trim() || undefined,
      startsAt: nextStartsAt,
      endsAt: nextEndsAt,
    };

    await this.dependencies.calendarEventRepository.saveEvent(updatedEvent);

    return updatedEvent;
  }

  private getPermissionPolicy(): SpacePermissionPolicy {
    return this.dependencies.permissionPolicy ?? new SpacePermissionPolicy();
  }
}

export type UpdateCalendarEventErrorCode =
  | "space-access-denied"
  | "event-not-found"
  | "event-update-not-allowed"
  | "title-required"
  | "invalid-time-range";

export class UpdateCalendarEventError extends Error {
  constructor(readonly code: UpdateCalendarEventErrorCode) {
    super(code);
    this.name = "UpdateCalendarEventError";
  }
}
