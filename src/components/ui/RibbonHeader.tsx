import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";

import { nestoryTheme } from "../../theme/nestoryTheme";

export type RibbonHeaderTone = "lavender" | "blush" | "mint" | "honey";

export type RibbonHeaderProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  tone?: RibbonHeaderTone;
  style?: StyleProp<ViewStyle>;
};

export function RibbonHeader({
  title,
  subtitle,
  eyebrow,
  tone = "lavender",
  style,
}: RibbonHeaderProps) {
  return (
    <View style={[styles.ribbon, nestoryTheme.radii.ribbon, toneStyles[tone], style]}>
      {eyebrow ? (
        <Text numberOfLines={1} style={styles.eyebrow}>
          {eyebrow}
        </Text>
      ) : null}
      <Text accessibilityRole="header" numberOfLines={2} style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text numberOfLines={2} style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const toneStyles = StyleSheet.create<Record<RibbonHeaderTone, ViewStyle>>({
  lavender: { backgroundColor: nestoryTheme.colors.lavender },
  blush: { backgroundColor: nestoryTheme.colors.blush },
  mint: { backgroundColor: nestoryTheme.colors.mint },
  honey: { backgroundColor: nestoryTheme.colors.honey },
});

const styles = StyleSheet.create({
  ribbon: {
    alignSelf: "flex-start",
    paddingHorizontal: nestoryTheme.spacing.lg,
    paddingVertical: nestoryTheme.spacing.md,
    maxWidth: "100%",
  },
  eyebrow: {
    ...nestoryTheme.typography.caption,
    color: nestoryTheme.colors.softInk,
    marginBottom: 2,
  },
  title: {
    ...nestoryTheme.typography.section,
    color: nestoryTheme.colors.plum,
  },
  subtitle: {
    ...nestoryTheme.typography.caption,
    color: nestoryTheme.colors.ink,
    marginTop: 2,
  },
});
