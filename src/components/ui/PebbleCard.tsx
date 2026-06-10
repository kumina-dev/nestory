import type { PropsWithChildren } from "react";
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";

import { nestoryTheme, type NestoryTone, type PebbleSize } from "../../theme/nestoryTheme";

export type PebbleCardProps = PropsWithChildren<
  Omit<ViewProps, "style"> & {
    size?: PebbleSize;
    tone?: NestoryTone;
    elevated?: boolean;
    padded?: boolean;
    style?: StyleProp<ViewStyle>;
  }
>;

export function PebbleCard({
  size = "md",
  tone = "card",
  elevated = false,
  padded = true,
  style,
  children,
  ...viewProps
}: PebbleCardProps) {
  return (
    <View
      {...viewProps}
      style={[
        styles.base,
        nestoryTheme.radii.pebble[size],
        toneStyles[tone],
        elevated ? nestoryTheme.shadows.lifted : nestoryTheme.shadows.soft,
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const toneStyles = StyleSheet.create<Record<NestoryTone, ViewStyle>>({
  cream: { backgroundColor: nestoryTheme.colors.cream },
  card: { backgroundColor: nestoryTheme.colors.card },
  blush: { backgroundColor: nestoryTheme.colors.blush },
  mint: { backgroundColor: nestoryTheme.colors.mint },
  lavender: { backgroundColor: nestoryTheme.colors.lavender },
  honey: { backgroundColor: nestoryTheme.colors.honey },
});

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: nestoryTheme.colors.line,
  },
  padded: {
    padding: nestoryTheme.spacing.lg,
  },
});
