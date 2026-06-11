export const firestorePaths = {
  users: () => "users",
  user: (userId: string) => `users/${userId}`,

  spaces: () => "spaces",
  space: (spaceId: string) => `spaces/${spaceId}`,

  spaceMembers: (spaceId: string) => `spaces/${spaceId}/members`,
  spaceMember: (spaceId: string, userId: string) => `spaces/${spaceId}/members/${userId}`,

  spaceTasks: (spaceId: string) => `spaces/${spaceId}/tasks`,
  spaceTask: (spaceId: string, taskId: string) => `spaces/${spaceId}/tasks/${taskId}`,

  spaceNotes: (spaceId: string) => `spaces/${spaceId}/notes`,
  spaceNote: (spaceId: string, noteId: string) => `spaces/${spaceId}/notes/${noteId}`,

  spaceEvents: (spaceId: string) => `spaces/${spaceId}/events`,
  spaceEvent: (spaceId: string, eventId: string) => `spaces/${spaceId}/events/${eventId}`,

  spaceCategories: (spaceId: string) => `spaces/${spaceId}/categories`,
  spaceCategory: (spaceId: string, categoryId: string) => `spaces/${spaceId}/categories/${categoryId}`,

  spacePointEvents: (spaceId: string) => `spaces/${spaceId}/pointEvents`,
  spacePointEvent: (spaceId: string, eventId: string) => `spaces/${spaceId}/pointEvents/${eventId}`,

  spacePointsPeriods: (spaceId: string) => `spaces/${spaceId}/pointsPeriods`,
  spacePointsPeriod: (spaceId: string, periodId: string) => `spaces/${spaceId}/pointsPeriods/${periodId}`,
} as const;
