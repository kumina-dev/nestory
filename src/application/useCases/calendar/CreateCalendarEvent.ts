import type { SpaceCalendarEvent } from "../../../domain/calendar/CalendarEvent";
import type { SpaceId, UserId } from "../../../domain/shared/ids";
import type { IsoDateTimeString } from "../../../domain/shared/time";
import { SpacePermissionPolicy } from "../../policies";
import type { Clock, IdGenerator } from "../../ports";
import type { CalendarEventRepository, SpaceRepository } from "../../repositories";

export type CreateCalendarEventInput = {
  spaceId: SpaceId;
  createdByUserId: UserId;
  title: string;
  description?: string;
  startsAt: IsoDateTimeString;
  endsAt?: IsoDateTimeString;
};

export type CreateCalendarEventDependencies = {
  spaceRepository: SpaceRepository;
  calendarEventRepository: CalendarEventRepository;
  clock: Clock;
  idGenerator: IdGenerator;
  permissionPolicy?: SpacePermissionPolicy;
};

export class CreateCalendarEventUseCase {
  constructor(private readonly dependencies: CreateCalendarEventDependencies) {}

  async execute(input: CreateCalendarEventInput): Promise<SpaceCalendarEvent> {
    const title = input.title.trim();

    if (!title) {
      throw new CreateCalendarEventError("title-required");
    }

    if (input.endsAt && input.endsAt <= input.startsAt) {
      throw new CreateCalendarEventError("invalid-time-range");
    }

    const membership = await this.dependencies.spaceRepository.getMembership(input.spaceId, input.createdByUserId);

    if (!this.getPermissionPolicy().canCreateSpaceContent(membership)) {
      throw new CreateCalendarEventError("space-access-denied");
    }

    const event: SpaceCalendarEvent = {
      id: this.dependencies.idGenerator.createId("calendarEvent"),
      spaceId: input.spaceId,
      title,
      description: input.description?.trim() || undefined,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      visibility: "space",
      createdByUserId: input.createdByUserId,
      createdAt: this.dependencies.clock.now(),
    };

    await this.dependencies.calendarEventRepository.saveEvent(event);

    return event;
  }

  private getPermissionPolicy(): SpacePermissionPolicy {
    return this.dependencies.permissionPolicy ?? new SpacePermissionPolicy();
  }
}

export type CreateCalendarEventErrorCode = "title-required" | "invalid-time-range" | "space-access-denied";

export class CreateCalendarEventError extends Error {
  constructor(readonly code: CreateCalendarEventErrorCode) {
    super(code);
    this.name = "CreateCalendarEventError";
  }
}
