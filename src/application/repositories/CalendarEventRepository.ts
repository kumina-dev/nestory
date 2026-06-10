import type { SpaceCalendarEvent } from "../../domain/calendar/CalendarEvent";
import type { CalendarEventId, SpaceId } from "../../domain/shared/ids";
import type { IsoDateTimeString } from "../../domain/shared/time";

export type CalendarEventListQuery = {
  spaceId: SpaceId;
  startsAtOrAfter?: IsoDateTimeString;
  startsBefore?: IsoDateTimeString;
};

export interface CalendarEventRepository {
  getEventById(spaceId: SpaceId, eventId: CalendarEventId): Promise<SpaceCalendarEvent | null>;
  listEvents(query: CalendarEventListQuery): Promise<SpaceCalendarEvent[]>;
  saveEvent(event: SpaceCalendarEvent): Promise<void>;
  deleteEvent(spaceId: SpaceId, eventId: CalendarEventId): Promise<void>;
}
