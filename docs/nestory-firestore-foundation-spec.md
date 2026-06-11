# Nestory Firestore Foundation Spec

This document is the source of truth for the first Firebase/Firestore implementation.

## Product context

Nestory is an Android-first Expo React Native relationship-space app.

The MVP shows one active relationship space in the UI, but the database must support multiple spaces later.

Nestory supports couples and multi-partner/group relationship structures, so the schema must not assume only two users.

## Core data rule

Every shared resource belongs to a space.

Global user account data belongs under `users/{userId}`.

Shared relationship/group data belongs under `spaces/{spaceId}` and its subcollections.

Messages/chat are not MVP and should not be added yet.

## Collection layout

```txt
users/{userId}
spaces/{spaceId}
spaces/{spaceId}/members/{userId}
spaces/{spaceId}/tasks/{taskId}
spaces/{spaceId}/notes/{noteId}
spaces/{spaceId}/events/{eventId}
spaces/{spaceId}/categories/{categoryId}
spaces/{spaceId}/pointEvents/{eventId}
spaces/{spaceId}/pointsPeriods/{periodId}
```

## Data models

### users/{userId}

```ts
type UserProfile = {
  displayName: string;
  email: string;
  photoURL?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  level: number;
  totalLifetimePoints: number;
};
```

### spaces/{spaceId}

```ts
type Space = {
  name: string;
  ownerId: string;
  theme?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  pointsResetInterval: "monthly" | "weekly" | "custom";
  currentPointsPeriodStart: Timestamp;
  currentPointsPeriodEnd: Timestamp;
  archived: boolean;
};
```

### spaces/{spaceId}/members/{userId}

```ts
type SpaceMember = {
  userId: string;
  role: "owner" | "admin" | "member";
  status: "active" | "left";
  joinedAt: Timestamp;
  leftAt?: Timestamp | null;
  displayNameSnapshot: string;
  anonymized: boolean;
};
```

### spaces/{spaceId}/tasks/{taskId}

```ts
type RecurrenceRule = {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  byWeekday?: number[];
  byMonthDay?: number[];
  until?: Timestamp | null;
  count?: number | null;
};

type Task = {
  title: string;
  description?: string | null;
  date?: Timestamp | null;
  recurrenceRule?: RecurrenceRule | null;
  assignedUserIds: string[];
  points: number;
  status: "open" | "completed" | "archived";
  createdBy: string;
  completedBy?: string | null;
  completedAt?: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
```

### spaces/{spaceId}/notes/{noteId}

```ts
type NoteContentBlock = {
  id: string;
  type: "text" | "markdown" | "checklist";
  text?: string;
  checked?: boolean;
};

type Note = {
  title: string;
  contentBlocks: NoteContentBlock[];
  categoryIds: string[];
  visibility: "space" | "private";
  visibleToUserIds?: string[];
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  archived: boolean;
};
```

### spaces/{spaceId}/events/{eventId}

```ts
type CalendarEvent = {
  title: string;
  description?: string | null;
  startAt: Timestamp;
  endAt: Timestamp;
  allDay: boolean;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  archived: boolean;
};
```

### spaces/{spaceId}/categories/{categoryId}

```ts
type Category = {
  name: string;
  color?: string | null;
  type: "note" | "task" | "event";
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
```

### spaces/{spaceId}/pointEvents/{eventId}

```ts
type PointEvent = {
  userId: string;
  taskId?: string | null;
  points: number;
  reason: "task_completed" | "manual_adjustment" | "task_uncompleted";
  createdBy: string;
  createdAt: Timestamp;
};
```

### spaces/{spaceId}/pointsPeriods/{periodId}

```ts
type PointsPeriod = {
  startAt: Timestamp;
  endAt: Timestamp;
  userPoints: Record<string, number>;
  createdAt: Timestamp;
  closedAt?: Timestamp | null;
};
```

## Design decisions

- `users` are global account profiles.
- `spaces` are relationship/group containers.
- `members` define access and role.
- Tasks, notes, events, categories, and points live under spaces.
- Private notes still live under the space, but visibility controls access.
- MVP UI can show one active space, but all reads/writes must use `spaceId`.
- Do not add chat/message collections yet.
- Do not add multiple-space switching UI yet.
- Avoid hard deletes in MVP. Prefer `archived` or `status`.

## Security-rule requirements

Rules must enforce:

1. `request.auth` must exist for all app data.
2. Users can read, create, and update their own user document.
3. Users cannot delete user documents from the client.
4. A user can read a space only if they are an active member.
5. A user can read space subcollections only if they are an active member.
6. Owner/admin can update space settings.
7. Owner/admin can create/update member documents for invites/admin actions.
8. Members can update their own member document only for leaving the space.
9. Normal members cannot change their role.
10. Owner role cannot be removed or downgraded by normal member actions.
11. Active members can create tasks, notes, events, categories, and point events inside their space.
12. Active members can update shared tasks/events/categories.
13. Private notes can only be read by creator or users listed in `visibleToUserIds`.
14. Private notes can only be updated by the creator for now.
15. `pointEvents` should be append-only from the client.
16. Hard deletes should be blocked.
17. All space subcollection access must check active membership.

## Security-rule helper shape

```js
function signedIn() {
  return request.auth != null;
}

function isSelf(userId) {
  return signedIn() && request.auth.uid == userId;
}

function memberPath(spaceId) {
  return /databases/$(database)/documents/spaces/$(spaceId)/members/$(request.auth.uid);
}

function isActiveMember(spaceId) {
  return signedIn()
    && exists(memberPath(spaceId))
    && get(memberPath(spaceId)).data.status == "active";
}

function memberRole(spaceId) {
  return get(memberPath(spaceId)).data.role;
}

function isAdminOrOwner(spaceId) {
  return isActiveMember(spaceId)
    && (memberRole(spaceId) == "owner" || memberRole(spaceId) == "admin");
}

function isOwner(spaceId) {
  return isActiveMember(spaceId)
    && memberRole(spaceId) == "owner";
}
```

## Initial `firestore.rules` shape

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function isSelf(userId) {
      return signedIn() && request.auth.uid == userId;
    }

    function memberPath(spaceId) {
      return /databases/$(database)/documents/spaces/$(spaceId)/members/$(request.auth.uid);
    }

    function isActiveMember(spaceId) {
      return signedIn()
        && exists(memberPath(spaceId))
        && get(memberPath(spaceId)).data.status == "active";
    }

    function memberRole(spaceId) {
      return get(memberPath(spaceId)).data.role;
    }

    function isAdminOrOwner(spaceId) {
      return isActiveMember(spaceId)
        && (memberRole(spaceId) == "owner" || memberRole(spaceId) == "admin");
    }

    function isOwner(spaceId) {
      return isActiveMember(spaceId)
        && memberRole(spaceId) == "owner";
    }

    match /users/{userId} {
      allow read, create, update: if isSelf(userId);
      allow delete: if false;
    }

    match /spaces/{spaceId} {
      allow read: if isActiveMember(spaceId);
      allow create: if signedIn()
        && request.resource.data.ownerId == request.auth.uid;
      allow update: if isAdminOrOwner(spaceId);
      allow delete: if false;

      match /members/{userId} {
        allow read: if isActiveMember(spaceId);
        allow create, update: if isAdminOrOwner(spaceId);
        allow delete: if false;
      }

      match /tasks/{taskId} {
        allow read: if isActiveMember(spaceId);
        allow create: if isActiveMember(spaceId)
          && request.resource.data.createdBy == request.auth.uid;
        allow update: if isActiveMember(spaceId);
        allow delete: if false;
      }

      match /notes/{noteId} {
        allow read: if isActiveMember(spaceId)
          && (
            resource.data.visibility == "space"
            || resource.data.createdBy == request.auth.uid
            || request.auth.uid in resource.data.visibleToUserIds
          );

        allow create: if isActiveMember(spaceId)
          && request.resource.data.createdBy == request.auth.uid;

        allow update: if isActiveMember(spaceId)
          && (
            resource.data.visibility == "space"
            || resource.data.createdBy == request.auth.uid
          );

        allow delete: if false;
      }

      match /events/{eventId} {
        allow read: if isActiveMember(spaceId);
        allow create: if isActiveMember(spaceId)
          && request.resource.data.createdBy == request.auth.uid;
        allow update: if isActiveMember(spaceId);
        allow delete: if false;
      }

      match /categories/{categoryId} {
        allow read: if isActiveMember(spaceId);
        allow create: if isActiveMember(spaceId)
          && request.resource.data.createdBy == request.auth.uid;
        allow update: if isActiveMember(spaceId);
        allow delete: if false;
      }

      match /pointEvents/{eventId} {
        allow read: if isActiveMember(spaceId);
        allow create: if isActiveMember(spaceId)
          && request.resource.data.createdBy == request.auth.uid;
        allow update, delete: if false;
      }

      match /pointsPeriods/{periodId} {
        allow read: if isActiveMember(spaceId);
        allow create, update: if isAdminOrOwner(spaceId);
        allow delete: if false;
      }
    }
  }
}
```

## Validation tightening to add after first pass

The first rules are intentionally a starting point. Before production, tighten:

- Required fields.
- Valid enum values.
- `createdBy == request.auth.uid`.
- `points` must be a reasonable number.
- `assignedUserIds` must be a list.
- `archived` must be boolean.
- Role/status values must be restricted.
- Users must not be able to grant themselves admin/owner.
- Owner role should not be removable/downgradable by admins.
- Private note `visibleToUserIds` should be validated as a list.
- Updates should protect immutable fields like `createdBy`, `createdAt`, and `ownerId`.

## First implementation target

Do not build UI yet.

Do not build tasks/notes/calendar screens yet.

Only implement the Firebase/Firestore foundation:

- Firestore TypeScript models.
- Collection/path helpers.
- Basic Firestore service helpers.
- Initial `firestore.rules`.
- Firebase config/index exports if missing.
