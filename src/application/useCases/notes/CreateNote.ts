import type { NoteCategory, NoteVisibility, SpaceNote } from "../../../domain/notes/Note";
import type { SpaceId, UserId } from "../../../domain/shared/ids";
import { SpacePermissionPolicy } from "../../policies";
import type { Clock, IdGenerator } from "../../ports";
import type { NoteRepository, SpaceRepository } from "../../repositories";

export type CreateNoteInput = {
  spaceId: SpaceId;
  ownerUserId: UserId;
  title: string;
  body: string;
  category: NoteCategory;
  visibility: NoteVisibility;
};

export type CreateNoteDependencies = {
  spaceRepository: SpaceRepository;
  noteRepository: NoteRepository;
  clock: Clock;
  idGenerator: IdGenerator;
  permissionPolicy?: SpacePermissionPolicy;
};

export class CreateNoteUseCase {
  constructor(private readonly dependencies: CreateNoteDependencies) {}

  async execute(input: CreateNoteInput): Promise<SpaceNote> {
    const title = input.title.trim();

    if (!title) {
      throw new CreateNoteError("title-required");
    }

    const membership = await this.dependencies.spaceRepository.getMembership(input.spaceId, input.ownerUserId);

    if (!this.getPermissionPolicy().canCreateSpaceContent(membership)) {
      throw new CreateNoteError("space-access-denied");
    }

    const now = this.dependencies.clock.now();

    const note: SpaceNote = {
      id: this.dependencies.idGenerator.createId("note"),
      spaceId: input.spaceId,
      title,
      body: input.body.trim(),
      category: input.category,
      visibility: input.visibility,
      ownerUserId: input.ownerUserId,
      createdAt: now,
      updatedAt: now,
    };

    await this.dependencies.noteRepository.saveNote(note);

    return note;
  }

  private getPermissionPolicy(): SpacePermissionPolicy {
    return this.dependencies.permissionPolicy ?? new SpacePermissionPolicy();
  }
}

export type CreateNoteErrorCode = "title-required" | "space-access-denied";

export class CreateNoteError extends Error {
  constructor(readonly code: CreateNoteErrorCode) {
    super(code);
    this.name = "CreateNoteError";
  }
}
