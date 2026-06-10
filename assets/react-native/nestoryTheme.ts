export const nestoryTheme = {
  colors: {
    cream: "#FFF6EC",
    blush: "#F7B7B2",
    coral: "#F47F7A",
    lavender: "#B9A7F2",
    plum: "#4B2E57",
    honey: "#F6C86A",
    mint: "#BEE8D4",
    ink: "#2E2633",
    softInk: "#6F6077",
    card: "#FFFDF8",
    danger: "#D65D5D",
    success: "#5A9F7A",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },

  radii: {
    pebbleSm: {
      borderTopLeftRadius: 22,
      borderTopRightRadius: 16,
      borderBottomRightRadius: 24,
      borderBottomLeftRadius: 18,
    },
    pebbleMd: {
      borderTopLeftRadius: 34,
      borderTopRightRadius: 22,
      borderBottomRightRadius: 38,
      borderBottomLeftRadius: 26,
    },
    pebbleLg: {
      borderTopLeftRadius: 46,
      borderTopRightRadius: 30,
      borderBottomRightRadius: 52,
      borderBottomLeftRadius: 34,
    },
    charm: {
      borderTopLeftRadius: 999,
      borderTopRightRadius: 999,
      borderBottomRightRadius: 28,
      borderBottomLeftRadius: 999,
    },
  },

  shadows: {
    soft: {
      shadowColor: "#4B2E57",
      shadowOpacity: 0.12,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },
    lifted: {
      shadowColor: "#4B2E57",
      shadowOpacity: 0.18,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 12 },
      elevation: 7,
    },
  },

  typography: {
    display: {
      fontSize: 34,
      lineHeight: 40,
      fontWeight: "800" as const,
      letterSpacing: -0.8,
    },
    title: {
      fontSize: 24,
      lineHeight: 30,
      fontWeight: "800" as const,
      letterSpacing: -0.4,
    },
    section: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: "700" as const,
    },
    body: {
      fontSize: 16,
      lineHeight: 23,
      fontWeight: "500" as const,
    },
    caption: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "500" as const,
    },
  },
} as const;
