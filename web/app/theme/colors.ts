/**
 * WordShelf / WordVault color palette (matches mobile)
 * Light and dark mode definitions
 */

export const colors = {
  light: {
    /** Soft paper – main app background */
    background: "#FAF8F4",
    /** Off-white – cards, modals, elevated surfaces */
    surface: "#FFFFFF",
    /** Deep ink – headlines, body text */
    primaryText: "#2E2A24",
    /** Muted slate – captions, labels, secondary info */
    secondaryText: "#6B665C",
    /** Soft gold – buttons, links, highlights */
    accent: "#D6B35E",
    /** Muted green – success states, confirmations */
    success: "#5F8C73",
    /** Light parchment – borders, separators */
    divider: "#E6E1D8",
  },
  dark: {
    /** Night library – main app background */
    background: "#12110F",
    /** Charcoal – cards, modals, elevated surfaces */
    surface: "#1C1A17",
    /** Warm ivory – headlines, body text */
    primaryText: "#F2EFE9",
    /** Muted ash – captions, labels, secondary info */
    secondaryText: "#B8B3A8",
    /** Soft gold – buttons, links, highlights */
    accent: "#D6B35E",
    /** Muted green – success states, confirmations */
    success: "#5F8C73",
    /** Deep gray – borders, separators */
    divider: "#2A2722",
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ThemeColors = (typeof colors)["light"] | (typeof colors)["dark"];
