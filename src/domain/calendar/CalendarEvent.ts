import type { CalendarEventId, SpaceId, UserId } from "../shared/ids";
import type { IsoDateTimeString } from "../shared/time";

export type CalendarEventVisibility = "space";

export type SpaceCalendarEvent = {
  id: CalendarEventId;
  spaceId: SpaceId;
  title: string;
  description?: string;
  startsAt: IsoDateTimeString;
  endsAt?: IsoDateTimeString;
  visibility: CalendarEventVisibility;
  createdByUserId: UserId;
  createdAt: IsoDateTimeString;
};
