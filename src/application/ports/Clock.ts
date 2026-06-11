import type { IsoDateTimeString } from "../../domain/shared/time";

export interface Clock {
  now(): IsoDateTimeString;
}
