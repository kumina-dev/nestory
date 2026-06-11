import type { IsoDateTimeString } from "../shared/time";
import type { CarePointPeriodKey } from "./CarePoints";

export function getMonthlyCarePointPeriodKey(value: IsoDateTimeString): CarePointPeriodKey {
  return value.slice(0, 7);
}
