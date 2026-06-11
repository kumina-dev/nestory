# Nestory Coding Agent Operating Plan

Use this document as the standing implementation plan for Nestory.

## Agent Mode

READ-ONLY / MANUAL APPLY.

The coding agent must not directly edit files, apply patches, or run destructive commands. It must inspect the repo first, then provide exact file-by-file patches or complete file contents for manual application.

After each chunk, the agent must:
1. Summarize what changed.
2. List checks to run.
3. Recommend the next chunk.
4. Wait for the user's result before continuing.

## Product

Nestory is an Android-first Expo React Native + TypeScript + Firebase app for relationship spaces.

It helps couples and multi-partner/group relationships coordinate:
- tasks
- care points
- notes
- calendar events
- settings
- later messaging

## MVP Priorities

1. Privacy and correct Firestore permissions
2. Stable domain/data contracts
3. Tasks + care points
4. Notes
5. Calendar
6. Settings
7. Polish/Android UX
8. Push notifications
9. Auth/OAuth/biometric improvements

## Not MVP

- DMs/chat
- public profiles
- payments
- iOS work
- file uploads
- offline support
- multi-space switching UI
- two-way external calendar sync

## Working Rules

- Do not redesign the whole app.
- Do not rewrite large areas unless needed.
- Keep domain, application, and infrastructure boundaries clean.
- Do not mix UI into Firebase/domain/application fixes.
- Every shared item must belong to a spaceId.
- MVP UI may show one active space, but code must structurally support multiple spaces.
- Firestore security rules are the real security boundary.
- Do not rely only on client-side use cases.
- Avoid hard deletes. Prefer archived/status fields.
- Do not add chat/messages yet.

## Known Findings To Fix First

### P1

1. Task authorization is only app-side. Firestore rules currently allow any active member to update any task. Rules must enforce the real permission model as much as practical.
2. Task repository drops important fields: `completionMode`, `assignedToDisplayName`, and `selfComplete` behavior. Save/load must preserve domain meaning.
3. Task completion and care-point writes are non-transactional. Completion + point event/account update must become atomic with a Firestore transaction or clearly isolated service path.

### P2

1. Domain, Firestore models, and rules have contract drift:
   - notes domain uses `shared/private`
   - Firestore/rules use `space/private`
   - calendar domain uses `startsAt/endsAt`
   - Firestore models use `startAt/endAt`
2. Firestore rules are broader than application permissions. App policy says owner/admin or creator can manage content, but rules allow any active member to update tasks/events/categories/shared notes.

### P3

1. `expo-doctor` reports Expo package patch mismatches. Fix only after P1/P2 unless the current task requires it.

## Verified Baseline

- `npx tsc --noEmit` passes.
- `npm ls --depth=0` is clean.
- `npx expo-doctor` fails only for Expo patch mismatches.
- repo was clean before changes.

## Required Output Format

Every response from the coding agent should use:

1. Repo findings
2. Current highest-priority issue
3. Patch plan
4. File-by-file manual patches/full file contents
5. Commands to run
6. Expected result
7. Next chunk after this

## Phase Order

### Phase 0 — Stabilize Firebase/domain contracts

Do this first.

- Fix task authorization gap in Firestore rules.
- Fix task repository field loss.
- Make task completion + care points atomic.
- Align domain/firestore naming for notes and calendar.
- Tighten rules to match application permissions.
- Add/adjust tests if the repo has a test setup.
- Keep TypeScript passing.

Do not move to Phase 1 until Phase 0 P1 fixes are applied and checks pass.

### Phase 1 — Auth/session foundation

- Verify Firebase Auth initialization.
- Add/verify auth state handling.
- Add user document creation/update flow.
- Add login/register/logout foundation if missing.

### Phase 2 — Space foundation

- Create first relationship space.
- Create owner member document.
- Load active user space.
- Enforce owner/admin/member role rules.
- Add leave-space behavior only if foundation is ready.

### Phase 3 — Tasks + care points

- Task CRUD.
- Assignment to one/many/unassigned.
- Recurrence model support.
- Day-specific tasks.
- Self-completion rules.
- Individual care points.
- Monthly reset model.
- Persistent user level.
- Avoid double completion and duplicate point events.

### Phase 4 — Notes

- Shared notes.
- Private notes.
- Optional categories.
- Filtering.
- Hybrid content blocks: text, markdown, checklist.
- Rules must protect private notes.

### Phase 5 — Calendar

- Shared in-app events.
- Consistent calendar date field names across domain, Firestore, and rules.
- Basic event CRUD.
- No two-way external calendar sync yet.

### Phase 6 — Settings

- Space settings.
- Points reset setting.
- Account/security settings.
- Notification settings placeholder if needed.

### Phase 7 — Android polish

- Keyboard-aware forms.
- Loading/empty/error states.
- Organic Nestory UI primitives.
- Accessibility labels.
- No generic plain-card UI for final screens.

### Phase 8 — Notifications

- Firebase/Expo notification setup.
- Task/event reminders.
- Permission handling.
- Android notification channels.

### Phase 9 — Final MVP hardening

- Firestore rules review.
- Basic regression checks.
- expo-doctor cleanup.
- Build verification.
- Privacy review.
- Remove dead code and TODO traps.

## Start Task

Start with Phase 0 only.

First inspect the current repo and propose the smallest patch to fix the P1 issues:

1. task authorization/rules gap
2. lost task fields in `FirebaseTaskRepository`
3. non-transactional task completion/care-point writes

Do not move to Phase 1 until Phase 0 P1 fixes are applied and checks pass.
