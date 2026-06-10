import type { SpaceId, TaskId, UserId } from "../../domain/shared/ids";
import type { SpaceTask, TaskStatus } from "../../domain/tasks/Task";

export type TaskListQuery = {
  spaceId: SpaceId;
  status?: TaskStatus;
  assignedToUserId?: UserId;
};

export interface TaskRepository {
  getTaskById(spaceId: SpaceId, taskId: TaskId): Promise<SpaceTask | null>;
  listTasks(query: TaskListQuery): Promise<SpaceTask[]>;
  saveTask(task: SpaceTask): Promise<void>;
}
