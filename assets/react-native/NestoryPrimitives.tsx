import React from "react";
import { Pressable, StyleSheet, Text, View, ViewProps, PressableProps } from "react-native";
import { nestoryTheme } from "./nestoryTheme";

type PebbleCardProps = ViewProps & {
  variant?: "sm" | "md" | "lg";
};

export function PebbleCard({ variant = "md", style, children, ...props }: PebbleCardProps) {
  const radius =
    variant === "sm"
      ? nestoryTheme.radii.pebbleSm
      : variant === "lg"
        ? nestoryTheme.radii.pebbleLg
        : nestoryTheme.radii.pebbleMd;

  return (
    <View style={[styles.pebbleCard, radius, nestoryTheme.shadows.soft, style]} {...props}>
      {children}
    </View>
  );
}

type CharmButtonProps = PressableProps & {
  label: string;
};

export function CharmButton({ label, style, ...props }: CharmButtonProps) {
  return (
    <Pressable style={({ pressed }) => [
      styles.charmButton,
      nestoryTheme.radii.charm,
      nestoryTheme.shadows.soft,
      pressed && styles.pressed,
      typeof style === "function" ? style({ pressed }) : style,
    ]} {...props}>
      <Text style={styles.charmButtonText}>{label}</Text>
    </Pressable>
  );
}

type RibbonHeaderProps = {
  title: string;
  subtitle?: string;
};

export function RibbonHeader({ title, subtitle }: RibbonHeaderProps) {
  return (
    <View style={[styles.ribbon, nestoryTheme.radii.pebbleMd]}>
      <Text style={styles.ribbonTitle}>{title}</Text>
      {subtitle ? <Text style={styles.ribbonSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pebbleCard: {
    backgroundColor: nestoryTheme.colors.card,
    padding: nestoryTheme.spacing.lg,
  },
  charmButton: {
    backgroundColor: nestoryTheme.colors.coral,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  charmButtonText: {
    color: nestoryTheme.colors.card,
    fontSize: 16,
    fontWeight: "800",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.92,
  },
  ribbon: {
    backgroundColor: nestoryTheme.colors.lavender,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: "flex-start",
  },
  ribbonTitle: {
    color: nestoryTheme.colors.plum,
    fontSize: 18,
    fontWeight: "800",
  },
  ribbonSubtitle: {
    color: nestoryTheme.colors.softInk,
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
});
