import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CharmButton } from "../components/ui/CharmButton";
import { NestPanel } from "../components/ui/NestPanel";
import { PebbleCard } from "../components/ui/PebbleCard";
import { RibbonHeader } from "../components/ui/RibbonHeader";
import { previewEvents, previewNotes, previewSpace, previewTasks } from "../features/spaces/spaceHomePreview";
import { nestoryTheme } from "../theme/nestoryTheme";

export function SpaceHomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Nestory relationship space home"
      >
        <View style={styles.hero}>
          <RibbonHeader
            eyebrow="Current space"
            title={previewSpace.name}
            subtitle={previewSpace.memberSummary}
            tone="blush"
          />

          <Text style={styles.heroTitle}>Shared life, kept soft.</Text>
          <Text style={styles.heroCopy}>
            Tasks, care points, notes, and plans for the people in this space.
          </Text>

          <View style={styles.heroActions}>
            <CharmButton label="Add task" accessibilityLabel="Add a shared task" />
            <CharmButton label="New note" tone="quiet" accessibilityLabel="Create a new note" />
          </View>
        </View>

        <View style={styles.statsRow}>
          <PebbleCard size="sm" tone="honey" style={styles.statCard}>
            <Text style={styles.statValue}>{previewSpace.carePoints}</Text>
            <Text style={styles.statLabel}>care points</Text>
          </PebbleCard>

          <PebbleCard size="sm" tone="mint" style={styles.statCard}>
            <Text style={styles.statValue}>Lv {previewSpace.level}</Text>
            <Text style={styles.statLabel}>persistent level</Text>
          </PebbleCard>
        </View>

        <NestPanel
          title="Today's care"
          subtitle="Small visible things that make the space feel tended."
          tone="cream"
        >
          {previewTasks.map((task) => (
            <PebbleCard key={task.id} size="sm" tone="card" elevated={false}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{task.title}</Text>
                <Text style={styles.points}>+{task.carePoints}</Text>
              </View>
              <Text style={styles.itemMeta}>
                {task.assignedTo} – {task.recurrenceLabel}
              </Text>
            </PebbleCard>
          ))}
        </NestPanel>

        <NestPanel title="Notes" subtitle="Shared by default, private when it needs to be." tone="lavender">
          {previewNotes.map((note) => (
            <View key={note.id} style={styles.noteRow}>
              <View style={styles.noteDot} />
              <View style={styles.noteText}>
                <Text style={styles.itemTitle}>{note.title}</Text>
                <Text style={styles.itemMeta}>
                  {note.category} – {note.visibility}
                </Text>
              </View>
            </View>
          ))}
        </NestPanel>

        <PebbleCard size="lg" tone="mint" elevated>
          <Text style={styles.sectionTitle}>Next calendar bubble</Text>
          {previewEvents.map((event) => (
            <View key={event.id} style={styles.calendarBubble}>
              <Text style={styles.itemTitle}>{event.title}</Text>
              <Text style={styles.itemMeta}>{event.timeLabel}</Text>
            </View>
          ))}
        </PebbleCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: nestoryTheme.colors.cream,
  },
  content: {
    padding: nestoryTheme.spacing.lg,
    paddingBottom: nestoryTheme.spacing.xxl,
    gap: nestoryTheme.spacing.lg,
  },
  hero: {
    gap: nestoryTheme.spacing.md,
    paddingTop: nestoryTheme.spacing.md,
  },
  heroTitle: {
    ...nestoryTheme.typography.display,
    color: nestoryTheme.colors.plum,
  },
  heroCopy: {
    ...nestoryTheme.typography.body,
    color: nestoryTheme.colors.softInk,
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: nestoryTheme.spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    gap: nestoryTheme.spacing.md,
  },
  statCard: {
    flex: 1,
  },
  statValue: {
    ...nestoryTheme.typography.title,
    color: nestoryTheme.colors.plum,
  },
  statLabel: {
    ...nestoryTheme.typography.caption,
    color: nestoryTheme.colors.softInk,
    marginTop: 2,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: nestoryTheme.spacing.md,
  },
  itemTitle: {
    ...nestoryTheme.typography.body,
    color: nestoryTheme.colors.ink,
    flex: 1,
  },
  itemMeta: {
    ...nestoryTheme.typography.caption,
    color: nestoryTheme.colors.softInk,
    marginTop: nestoryTheme.spacing.xs,
  },
  points: {
    ...nestoryTheme.typography.caption,
    color: nestoryTheme.colors.plum,
    fontWeight: "800",
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: nestoryTheme.spacing.md,
  },
  noteDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: nestoryTheme.colors.coral,
  },
  noteText: {
    flex: 1,
  },
  sectionTitle: {
    ...nestoryTheme.typography.section,
    color: nestoryTheme.colors.plum,
    marginBottom: nestoryTheme.spacing.md,
  },
  calendarBubble: {
    ...nestoryTheme.radii.calendarBubble,
    backgroundColor: nestoryTheme.colors.card,
    borderWidth: 1,
    borderColor: nestoryTheme.colors.line,
    padding: nestoryTheme.spacing.lg,
  },
});
