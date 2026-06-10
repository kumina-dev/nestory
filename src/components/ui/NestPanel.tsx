import type { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";

import { nestoryTheme, type NestoryTone } from "../../theme/nestoryTheme";

export type NestPanelProps = PropsWithChildren<
  Omit<ViewProps, "style"> & {
    title?: string;
    subtitle?: string;
    tone?: Exclude<NestoryTone, "card">;
    footer?: ReactNode;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
  }
>;

export function NestPanel({
  title,
  subtitle,
  tone = "cream",
  footer,
  style,
  contentStyle,
  children,
  ...viewProps
}: NestPanelProps) {
  return (
    <View
      {...viewProps}
      style={[styles.panel, nestoryTheme.radii.nestPanel, toneStyles[tone], nestoryTheme.shadows.soft, style]}
    >
      {title || subtitle ? (
        <View style={styles.header}>
          {title ? (
            <Text accessibilityRole="header" numberOfLines={2} style={styles.title}>
              {title}
            </Text>
          ) : null}
          {subtitle ? (
            <Text numberOfLines={3} style={styles.subtitle}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View style={[styles.content, contentStyle]}>{children}</View>

      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </View>
  );
}

const toneStyles = StyleSheet.create<Record<Exclude<NestoryTone, "card">, ViewStyle>>({
  cream: { backgroundColor: nestoryTheme.colors.cream },
  blush: { backgroundColor: nestoryTheme.colors.blush },
  mint: { backgroundColor: nestoryTheme.colors.mint },
  lavender: { backgroundColor: nestoryTheme.colors.lavender },
  honey: { backgroundColor: nestoryTheme.colors.honey },
});

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    borderColor: nestoryTheme.colors.line,
    padding: nestoryTheme.spacing.lg,
  },
  header: {
    marginBottom: nestoryTheme.spacing.md,
  },
  title: {
    ...nestoryTheme.typography.title,
    color: nestoryTheme.colors.plum,
  },
  subtitle: {
    ...nestoryTheme.typography.body,
    color: nestoryTheme.colors.softInk,
    marginTop: nestoryTheme.spacing.xs,
  },
  content: {
    gap: nestoryTheme.spacing.md,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: nestoryTheme.colors.line,
    marginTop: nestoryTheme.spacing.lg,
    paddingTop: nestoryTheme.spacing.md,
  },
});
