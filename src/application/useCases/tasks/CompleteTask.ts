import { CarePointLevelPolicy } from "../../../domain/care";
import { getMonthlyCarePointPeriodKey } from "../../../domain/care/CarePointPeriod";
import type { CarePointAccount, CarePointEntry } from "../../../domain/care/CarePoints";
import type { SpaceId, TaskId, UserId } from "../../../domain/shared/ids";
import type { SpaceTask } from "../../../domain/tasks/Task";
import type { Clock, IdGenerator } from "../../ports";
import type { CarePointRepository, SpaceRepository, TaskRepository } from "../../repositories";

export type CompleteTaskInput = {
  spaceId: SpaceId;
  taskId: TaskId;
  completedByUserId: UserId;
};

export type CompleteTaskResult = {
  task: SpaceTask;
  carePointEntry: CarePointEntry | null;
  carePointAccount: CarePointAccount | null;
};

export type CompleteTaskDependencies = {
  spaceRepository: SpaceRepository;
  taskRepository: TaskRepository;
  carePointRepository: CarePointRepository;
  clock: Clock;
  idGenerator: IdGenerator;
  carePointLevelPolicy?: CarePointLevelPolicy;
};

export class CompleteTaskUseCase {
  constructor(private readonly dependencies: CompleteTaskDependencies) {}

  async execute(input: CompleteTaskInput): Promise<CompleteTaskResult> {
    const membership = await this.dependencies.spaceRepository.getMembership(input.spaceId, input.completedByUserId);

    if (!membership || membership.status !== "active") {
      throw new CompleteTaskError("space-access-denied");
    }

    const task = await this.dependencies.taskRepository.getTaskById(input.spaceId, input.taskId);

    if (!task) {
      throw new CompleteTaskError("task-not-found");
    }

    if (task.status !== "open") {
      throw new CompleteTaskError("task-not-open");
    }

    this.assertCanCompleteTask(task, input.completedByUserId);

    const now = this.dependencies.clock.now();
    const completedTask: SpaceTask = {
      ...task,
      status: "completed",
      completedAt: now,
      completedByUserId: input.completedByUserId,
    };

    const carePointResult = await this.buildCarePointResult({
      task,
      completedByUserId: input.completedByUserId,
      now,
    });

    await this.dependencies.taskRepository.saveTask(completedTask);

    if (carePointResult.entry && carePointResult.account) {
      await this.dependencies.carePointRepository.saveEntry(carePointResult.entry);
      await this.dependencies.carePointRepository.saveAccount(carePointResult.account);
    }

    return {
      task: completedTask,
      carePointEntry: carePointResult.entry,
      carePointAccount: carePointResult.account,
    };
  }

  private assertCanCompleteTask(task: SpaceTask, completedByUserId: UserId): void {
    if (task.completionMode === "anyone") {
      return;
    }

    if (!task.assignedToUserId || task.assignedToUserId !== completedByUserId) {
      throw new CompleteTaskError("completion-not-allowed");
    }
  }

  private async buildCarePointResult(input: {
    task: SpaceTask;
    completedByUserId: UserId;
    now: string;
  }): Promise<{ entry: CarePointEntry | null; account: CarePointAccount | null }> {
    if (input.task.carePoints <= 0) {
      return { entry: null, account: null };
    }

    const periodKey = getMonthlyCarePointPeriodKey(input.now);
    const existingAccount = await this.dependencies.carePointRepository.getAccount({
      spaceId: input.task.spaceId,
      userId: input.completedByUserId,
    });

    const currentPeriodPoints =
      existingAccount?.currentPeriodKey === periodKey ? existingAccount.currentPeriodPoints : 0;

    const lifetimePoints = (existingAccount?.lifetimePoints ?? 0) + input.task.carePoints;
    const level = this.getCarePointLevelPolicy().getLevel(lifetimePoints);

    const entry: CarePointEntry = {
      id: this.dependencies.idGenerator.createId("carePointEntry"),
      spaceId: input.task.spaceId,
      userId: input.completedByUserId,
      amount: input.task.carePoints,
      periodKey,
      source: {
        kind: "taskCompletion",
        taskId: input.task.id,
      },
      createdAt: input.now,
      createdByUserId: input.completedByUserId,
    };

    const account: CarePointAccount = {
      spaceId: input.task.spaceId,
      userId: input.completedByUserId,
      currentPeriodKey: periodKey,
      currentPeriodPoints: currentPeriodPoints + input.task.carePoints,
      lifetimePoints,
      level,
      updatedAt: input.now,
    };

    return { entry, account };
  }

  private getCarePointLevelPolicy(): CarePointLevelPolicy {
    return this.dependencies.carePointLevelPolicy ?? new CarePointLevelPolicy();
  }
}

export type CompleteTaskErrorCode =
  | "space-access-denied"
  | "task-not-found"
  | "task-not-open"
  | "completion-not-allowed";

export class CompleteTaskError extends Error {
  constructor(readonly code: CompleteTaskErrorCode) {
    super(code);
    this.name = "CompleteTaskError";
  }
}
