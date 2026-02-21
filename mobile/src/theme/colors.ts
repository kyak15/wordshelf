/**
 * WordShelf Color Palette
 * Light and Dark mode color definitions
 */

export const colors = {
  light: {
    /** Soft paper - Main app background */
    background: "#FAF8F4",
    /** Off-white - Cards, modals, elevated surfaces */
    surface: "#FFFFFF",
    /** Deep ink - Headlines, body text */
    primaryText: "#2E2A24",
    /** Muted slate - Captions, labels, secondary info */
    secondaryText: "#6B665C",
    /** Soft gold - Buttons, links, highlights */
    accent: "#D6B35E",
    /** Muted green - Success states, confirmations */
    success: "#5F8C73",
    /** Light parchment - Borders, separators */
    divider: "#E6E1D8",
  },
  dark: {
    /** Night library - Main app background */
    background: "#12110F",
    /** Charcoal - Cards, modals, elevated surfaces */
    surface: "#1C1A17",
    /** Warm ivory - Headlines, body text */
    primaryText: "#F2EFE9",
    /** Muted ash - Captions, labels, secondary info */
    secondaryText: "#B8B3A8",
    /** Soft gold - Buttons, links, highlights */
    accent: "#D6B35E",
    /** Muted green - Success states, confirmations */
    success: "#5F8C73",
    /** Deep gray - Borders, separators */
    divider: "#2A2722",
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ThemeColors = typeof colors.light | typeof colors.dark;
