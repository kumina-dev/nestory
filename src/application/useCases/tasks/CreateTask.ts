import type { SpaceId, UserId } from "../../../domain/shared/ids";
import type { SpaceTask, TaskCompletionMode, TaskRecurrence } from "../../../domain/tasks/Task";
import type { Clock, IdGenerator } from "../../ports";
import type { SpaceRepository, TaskRepository } from "../../repositories";

export type CreateTaskInput = {
  spaceId: SpaceId;
  createdByUserId: UserId;
  title: string;
  description?: string;
  assignedToUserId?: UserId;
  assignedToDisplayName?: string;
  recurrence?: TaskRecurrence;
  completionMode?: TaskCompletionMode;
  carePoints: number;
};

export type CreateTaskDependencies = {
  spaceRepository: SpaceRepository;
  taskRepository: TaskRepository;
  clock: Clock;
  idGenerator: IdGenerator;
};

export class CreateTaskUseCase {
  constructor(private readonly dependencies: CreateTaskDependencies) {}

  async execute(input: CreateTaskInput): Promise<SpaceTask> {
    const title = input.title.trim();

    if (!title) {
      throw new CreateTaskError("title-required");
    }

    if (!Number.isInteger(input.carePoints) || input.carePoints < 0) {
      throw new CreateTaskError("invalid-care-points");
    }

    const creatorMembership = await this.dependencies.spaceRepository.getMembership(
      input.spaceId,
      input.createdByUserId,
    );

    if (!creatorMembership || creatorMembership.status !== "active") {
      throw new CreateTaskError("space-access-denied");
    }

    if (input.assignedToUserId) {
      const assigneeMembership = await this.dependencies.spaceRepository.getMembership(
        input.spaceId,
        input.assignedToUserId,
      );

      if (!assigneeMembership || assigneeMembership.status !== "active") {
        throw new CreateTaskError("assignee-not-active-member");
      }
    }

    const now = this.dependencies.clock.now();

    const task: SpaceTask = {
      id: this.dependencies.idGenerator.createId("task"),
      spaceId: input.spaceId,
      title,
      description: input.description?.trim() || undefined,
      assignedToUserId: input.assignedToUserId,
      assignedToDisplayName: input.assignedToDisplayName,
      status: "open",
      recurrence: input.recurrence ?? { kind: "none" },
      completionMode: input.completionMode ?? "anyone",
      carePoints: input.carePoints,
      createdByUserId: input.createdByUserId,
      createdAt: now,
    };

    await this.dependencies.taskRepository.saveTask(task);

    return task;
  }
}

export type CreateTaskErrorCode =
  | "title-required"
  | "invalid-care-points"
  | "space-access-denied"
  | "assignee-not-active-member";

export class CreateTaskError extends Error {
  constructor(readonly code: CreateTaskErrorCode) {
    super(code);
    this.name = "CreateTaskError";
  }
}
