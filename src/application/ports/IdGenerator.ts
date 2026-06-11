export type IdPrefix = "task" | "note" | "calendarEvent" | "carePointEntry" | "space" | "membership";

export interface IdGenerator {
  createId(prefix: IdPrefix): string;
}
