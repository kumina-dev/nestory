import { SpaceCalendarEvent } from "../../../domain/calendar/CalendarEvent";
import { CarePointAccount, CarePointLevelPolicy, CarePointLevelProgress } from "../../../domain/care";
import { SpaceNote } from "../../../domain/notes/Note";
import { SpaceId, UserId } from "../../../domain/shared/ids";
import { IsoDateTimeString } from "../../../domain/shared/time";
import { RelationshipSpace, SpaceMembership } from "../../../domain/spaces/Space";
import { SpaceTask } from "../../../domain/tasks/Task";
import {
  CalendarEventRepository,
  CarePointRepository,
  NoteRepository,
  SpaceRepository,
  TaskRepository,
} from "../../repositories";

export type LoadSpaceHomeInput = {
  spaceId: SpaceId;
  requesterUserId: UserId;
  eventWindowStart?: IsoDateTimeString;
  eventWindowEnd?: IsoDateTimeString;
};

export type SpaceHomeData = {
  space: RelationshipSpace;
  memberships: SpaceMembership[];
  currentMembership: SpaceMembership;
  openTasks: SpaceTask[];
  visibleNotes: SpaceNote[];
  upcomingEvents: SpaceCalendarEvent[];
  currentCarePointAccount: CarePointAccount | null;
  currentCarePointLevelProgress: CarePointLevelProgress | null;
  openCarePointTotal: number;
};

export type LoadSpaceHomeDependencies = {
  spaceRepository: SpaceRepository;
  taskRepository: TaskRepository;
  noteRepository: NoteRepository;
  calendarEventRepository: CalendarEventRepository;
  carePointRepository: CarePointRepository;
  carePointLevelPolicy?: CarePointLevelPolicy;
};

export class LoadSpaceHomeUseCase {
  constructor(private readonly dependencies: LoadSpaceHomeDependencies) {}

  async execute(input: LoadSpaceHomeInput): Promise<SpaceHomeData> {
    const { spaceRepository, taskRepository, noteRepository, calendarEventRepository, carePointRepository } =
      this.dependencies;

    const [space, currentMembership] = await Promise.all([
      spaceRepository.getSpaceById(input.spaceId),
      spaceRepository.getMembership(input.spaceId, input.requesterUserId),
    ]);

    if (!space) {
      throw new LoadSpaceHomeError("space-not-found");
    }

    if (!currentMembership || currentMembership.status !== "active") {
      throw new LoadSpaceHomeError("space-access-denied");
    }

    const [memberships, openTasks, visibleNotes, upcomingEvents, currentCarePointAccount] = await Promise.all([
      spaceRepository.listMemberships({ spaceId: input.spaceId }),
      taskRepository.listTasks({ spaceId: input.spaceId, status: "open" }),
      noteRepository.listNotes({
        spaceId: input.spaceId,
        requesterUserId: input.requesterUserId,
      }),
      calendarEventRepository.listEvents({
        spaceId: input.spaceId,
        startsAtOrAfter: input.eventWindowStart,
        startsBefore: input.eventWindowEnd,
      }),
      carePointRepository.getAccount({
        spaceId: input.spaceId,
        userId: input.requesterUserId,
      }),
    ]);

    return {
      space,
      memberships: memberships.filter((membership) => membership.status === "active"),
      currentMembership,
      openTasks,
      visibleNotes,
      upcomingEvents,
      currentCarePointAccount,
      currentCarePointLevelProgress: currentCarePointAccount
        ? this.getCarePointLevelPolicy().getProgress(currentCarePointAccount.lifetimePoints)
        : null,
      openCarePointTotal: openTasks.reduce((total, task) => total + task.carePoints, 0),
    };
  }

  private getCarePointLevelPolicy(): CarePointLevelPolicy {
    return this.dependencies.carePointLevelPolicy ?? new CarePointLevelPolicy();
  }
}

export type LoadSpaceHomeErrorCode = "space-not-found" | "space-access-denied";

export class LoadSpaceHomeError extends Error {
  constructor(readonly code: LoadSpaceHomeErrorCode) {
    super(code);
    this.name = "LoadSpaceHomeError";
  }
}
