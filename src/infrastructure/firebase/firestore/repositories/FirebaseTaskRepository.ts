import { orderBy, where, type QueryConstraint } from "@react-native-firebase/firestore";

import type { TaskListQuery, TaskRepository } from "../../../../application/repositories";
import type { SpaceId, TaskId } from "../../../../domain/shared/ids";
import type { SpaceTask } from "../../../../domain/tasks/Task";
import { isoToTimestamp, recurrenceFromFirestore, recurrenceToFirestore, timestampToIso } from "../firestoreMappers";
import type { TaskDocument } from "../firestoreModels";
import { firestorePaths } from "../firestorePaths";
import { getDocument, listDocuments, saveDocument } from "../firestoreService";

export class FirebaseTaskRepository implements TaskRepository {
  async getTaskById(spaceId: SpaceId, taskId: TaskId): Promise<SpaceTask | null> {
    const result = await getDocument<TaskDocument>(firestorePaths.spaceTask(spaceId, taskId));
    return result ? this.toDomainTask(spaceId, result.id, result.data) : null;
  }

  async listTasks(queryInput: TaskListQuery): Promise<SpaceTask[]> {
    const constraints: QueryConstraint[] = [orderBy("createdAt", "desc")];

    if (queryInput.status) {
      constraints.unshift(where("status", "==", queryInput.status));
    }

    if (queryInput.assignedToUserId) {
      constraints.unshift(where("assignedUserIds", "array-contains", queryInput.assignedToUserId));
    }

    const results = await listDocuments<TaskDocument>(firestorePaths.spaceTasks(queryInput.spaceId), constraints);
    return results.map((result) => this.toDomainTask(queryInput.spaceId, result.id, result.data));
  }

  async saveTask(task: SpaceTask): Promise<void> {
    const assignedUserIds = task.assignedToUserId ? [task.assignedToUserId] : [];

    const document: TaskDocument = {
      title: task.title,
      description: task.description ?? null,
      date: null,
      recurrenceRule: recurrenceToFirestore(task.recurrence),
      assignedUserIds,
      points: task.carePoints,
      status: task.status,
      createdBy: task.createdByUserId,
      completedBy: task.completedByUserId ?? null,
      completedAt: task.completedAt ? isoToTimestamp(task.completedAt) : null,
      createdAt: isoToTimestamp(task.createdAt),
      updatedAt: isoToTimestamp(task.completedAt ?? task.createdAt),
    };

    await saveDocument<TaskDocument>(firestorePaths.spaceTask(task.spaceId, task.id), document);
  }

  private toDomainTask(spaceId: SpaceId, id: TaskId, document: TaskDocument): SpaceTask {
    const assignedToUserId = document.assignedUserIds[0];

    return {
      id,
      spaceId,
      title: document.title,
      description: document.description ?? undefined,
      assignedToUserId,
      status: document.status,
      recurrence: recurrenceFromFirestore(document.recurrenceRule),
      completionMode: assignedToUserId ? "assignedUserOnly" : "anyone",
      carePoints: document.points,
      createdByUserId: document.createdBy,
      createdAt: timestampToIso(document.createdAt),
      completedAt: document.completedAt ? timestampToIso(document.completedAt) : undefined,
      completedByUserId: document.completedBy ?? undefined,
    };
  }
}
