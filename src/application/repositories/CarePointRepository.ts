import type { CarePointAccount, CarePointEntry, CarePointPeriodKey } from "../../domain/care/CarePoints";
import type { SpaceId, UserId } from "../../domain/shared/ids";

export type CarePointAccountQuery = {
  spaceId: SpaceId;
  userId: UserId;
};

export type CarePointEntryListQuery = {
  spaceId: SpaceId;
  userId?: UserId;
  periodKey?: CarePointPeriodKey;
};

export interface CarePointRepository {
  getAccount(query: CarePointAccountQuery): Promise<CarePointAccount | null>;
  listAccounts(spaceId: SpaceId): Promise<CarePointAccount[]>;
  listEntries(query: CarePointEntryListQuery): Promise<CarePointEntry[]>;
  saveEntry(entry: CarePointEntry): Promise<void>;
  saveAccount(account: CarePointAccount): Promise<void>;
}
