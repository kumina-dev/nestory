import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, type PressableProps, type TextStyle, type ViewStyle } from "react-native";

import { nestoryTheme, type CharmTone } from "../../theme/nestoryTheme";

export type CharmButtonSize = "sm" | "md";

export type CharmButtonProps = Omit<PressableProps, "children" | "style"> & {
  label: string;
  tone?: CharmTone;
  size?: CharmButtonSize;
  children?: ReactNode;
  style?: PressableProps["style"];
};

export function CharmButton({
  label,
  tone = "coral",
  size = "md",
  disabled = false,
  accessibilityLabel,
  children,
  style,
  ...pressableProps
}: CharmButtonProps) {
  return (
    <Pressable
      {...pressableProps}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      disabled={disabled}
      style={(state) => [
        styles.base,
        nestoryTheme.radii.charm,
        nestoryTheme.shadows.soft,
        sizeStyles[size],
        toneStyles[tone],
        state.pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        typeof style === "function" ? style(state) : style,
      ]}
    >
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.86}
        style={[styles.label, labelToneStyles[tone], disabled && styles.disabledLabel]}
      >
        {label}
      </Text>
      {children}
    </Pressable>
  );
}

const sizeStyles = StyleSheet.create<Record<CharmButtonSize, ViewStyle>>({
  sm: {
    minHeight: 40,
    paddingHorizontal: nestoryTheme.spacing.lg,
    paddingVertical: 9,
  },
  md: {
    minHeight: 50,
    paddingHorizontal: nestoryTheme.spacing.xl,
    paddingVertical: 13,
  },
});

const toneStyles = StyleSheet.create<Record<CharmTone, ViewStyle>>({
  coral: { backgroundColor: nestoryTheme.colors.coral },
  plum: { backgroundColor: nestoryTheme.colors.plum },
  honey: { backgroundColor: nestoryTheme.colors.honey },
  quiet: {
    backgroundColor: nestoryTheme.colors.card,
    borderWidth: 1,
    borderColor: nestoryTheme.colors.line,
  },
});

const labelToneStyles = StyleSheet.create<Record<CharmTone, TextStyle>>({
  coral: { color: nestoryTheme.colors.white },
  plum: { color: nestoryTheme.colors.white },
  honey: { color: nestoryTheme.colors.plum },
  quiet: { color: nestoryTheme.colors.plum },
});

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: nestoryTheme.spacing.sm,
  },
  label: {
    ...nestoryTheme.typography.button,
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  disabledLabel: {
    color: nestoryTheme.colors.softInk,
  },
});
