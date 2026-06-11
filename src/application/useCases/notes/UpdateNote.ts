import type { NoteCategory, NoteVisibility, SpaceNote } from "../../../domain/notes/Note";
import type { NoteId, SpaceId, UserId } from "../../../domain/shared/ids";
import { SpacePermissionPolicy } from "../../policies";
import type { Clock } from "../../ports";
import type { NoteRepository, SpaceRepository } from "../../repositories";

export type UpdateNoteInput = {
  spaceId: SpaceId;
  noteId: NoteId;
  requesterUserId: UserId;
  title?: string;
  body?: string;
  category?: NoteCategory;
  visibility?: NoteVisibility;
};

export type UpdateNoteDependencies = {
  spaceRepository: SpaceRepository;
  noteRepository: NoteRepository;
  clock: Clock;
  permissionPolicy?: SpacePermissionPolicy;
};

export class UpdateNoteUseCase {
  constructor(private readonly dependencies: UpdateNoteDependencies) {}

  async execute(input: UpdateNoteInput): Promise<SpaceNote> {
    const [membership, existingNote] = await Promise.all([
      this.dependencies.spaceRepository.getMembership(input.spaceId, input.requesterUserId),
      this.dependencies.noteRepository.getNoteById({
        spaceId: input.spaceId,
        noteId: input.noteId,
        requesterUserId: input.requesterUserId,
      }),
    ]);

    if (!membership || membership.status !== "active") {
      throw new UpdateNoteError("space-access-denied");
    }

    if (!existingNote) {
      throw new UpdateNoteError("note-not-found");
    }

    if (!this.getPermissionPolicy().canManageContent(membership, existingNote.ownerUserId)) {
      throw new UpdateNoteError("note-update-not-allowed");
    }

    const nextTitle = input.title === undefined ? existingNote.title : input.title.trim();

    if (!nextTitle) {
      throw new UpdateNoteError("title-required");
    }

    const updatedNote: SpaceNote = {
      ...existingNote,
      title: nextTitle,
      body: input.body === undefined ? existingNote.body : input.body.trim(),
      category: input.category ?? existingNote.category,
      visibility: input.visibility ?? existingNote.visibility,
      updatedAt: this.dependencies.clock.now(),
    };

    await this.dependencies.noteRepository.saveNote(updatedNote);

    return updatedNote;
  }

  private getPermissionPolicy(): SpacePermissionPolicy {
    return this.dependencies.permissionPolicy ?? new SpacePermissionPolicy();
  }
}

export type UpdateNoteErrorCode =
  | "space-access-denied"
  | "note-not-found"
  | "note-update-not-allowed"
  | "title-required";

export class UpdateNoteError extends Error {
  constructor(readonly code: UpdateNoteErrorCode) {
    super(code);
    this.name = "UpdateNoteError";
  }
}
