import type { TextStyle, ViewStyle } from "react-native";

export type PebbleSize = "sm" | "md" | "lg";
export type NestoryTone = "cream" | "card" | "blush" | "mint" | "lavender" | "honey";
export type CharmTone = "coral" | "plum" | "honey" | "quiet";

const colors = {
  cream: "#FFF6EC",
  card: "#FFFDF8",
  blush: "#F7B7B2",
  coral: "#F47F7A",
  lavender: "#B9A7F2",
  plum: "#4B2E57",
  honey: "#F6C86A",
  mint: "#BEE8D4",
  ink: "#2E2633",
  softInk: "#6F6077",
  line: "#F0D9D1",
  danger: "#D65D5D",
  success: "#5A9F7A",
  white: "#FFFFFF",
} as const;

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

const radii: {
  pebble: Record<PebbleSize, ViewStyle>;
  nestPanel: ViewStyle;
  ribbon: ViewStyle;
  charm: ViewStyle;
  calendarBubble: ViewStyle;
} = {
  pebble: {
    sm: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 14,
      borderBottomRightRadius: 24,
      borderBottomLeftRadius: 18,
    },
    md: {
      borderTopLeftRadius: 34,
      borderTopRightRadius: 22,
      borderBottomRightRadius: 38,
      borderBottomLeftRadius: 26,
    },
    lg: {
      borderTopLeftRadius: 46,
      borderTopRightRadius: 30,
      borderBottomRightRadius: 52,
      borderBottomLeftRadius: 34,
    },
  },
  nestPanel: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 44,
    borderBottomLeftRadius: 30,
  },
  ribbon: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 18,
    borderBottomLeftRadius: 10,
  },
  charm: {
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 28,
    borderBottomLeftRadius: 999,
  },
  calendarBubble: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 26,
    borderBottomLeftRadius: 22,
  },
};

const shadows: Record<"soft" | "lifted", ViewStyle> = {
  soft: {
    shadowColor: colors.plum,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  lifted: {
    shadowColor: colors.plum,
    shadowOpacity: 0.16,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
};

const typography: Record<"display" | "title" | "section" | "body" | "caption" | "button", TextStyle> = {
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: 0,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    letterSpacing: 0,
  },
  section: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "500",
    letterSpacing: 0,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    letterSpacing: 0,
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "800",
    letterSpacing: 0,
  },
};

export const nestoryTheme = {
  colors,
  spacing,
  radii,
  shadows,
  typography,
};

export type NestoryColor = keyof typeof colors;
