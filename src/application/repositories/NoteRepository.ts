import type { NoteCategory, NoteVisibility, SpaceNote } from "../../domain/notes/Note";
import type { NoteId, SpaceId, UserId } from "../../domain/shared/ids";

export type NoteListQuery = {
  spaceId: SpaceId;
  requesterUserId: UserId;
  category?: NoteCategory;
  visibility?: NoteVisibility;
};

export type NoteLookupQuery = {
  spaceId: SpaceId;
  noteId: NoteId;
  requesterUserId: UserId;
};

export interface NoteRepository {
  getNoteById(query: NoteLookupQuery): Promise<SpaceNote | null>;
  listNotes(query: NoteListQuery): Promise<SpaceNote[]>;
  saveNote(note: SpaceNote): Promise<void>;
}
