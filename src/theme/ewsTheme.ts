/**
 * EWS Theme Configuration
 * Aligned with the Wholesale Origination System design language.
 *
 * This file is the single source of truth for all EWS theming tokens.
 * When the EWS module is embedded inside the Wholesale Origination layout,
 * these values can be overridden by the parent application.
 */

export const ewsTheme = {
  token: {
    colorPrimary: "#c41fa8",
    colorInfo: "#c41fa8",
    colorLink: "#c41fa8",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",
    colorTextBase: "#333333",
    fontSize: 14,
    borderRadius: 6,
    wireframe: false,
    fontFamily: "'Times New Roman', Times, serif",
  },
  components: {
    Button: {
      colorPrimary: "#c41fa8",
      colorPrimaryHover: "#a61d94",
      colorPrimaryActive: "#8e1a80",
      defaultShadow: "0 2px 0 rgba(196, 31, 168, 0.1)",
      primaryShadow: "0 2px 0 rgba(196, 31, 168, 0.1)",
      fontFamily: "'Times New Roman', Times, serif",
    },
    Menu: {
      itemActiveBg: "rgba(196, 31, 168, 0.1)",
      itemHoverBg: "rgba(196, 31, 168, 0.05)",
      fontFamily: "'Times New Roman', Times, serif",
    },
    Tabs: {
      itemActiveColor: "#c41fa8",
      itemSelectedColor: "#c41fa8",
      inkBarColor: "#c41fa8",
      fontFamily: "'Times New Roman', Times, serif",
    },
    Tag: {
      colorPrimaryBorder: "#d4af37",
      colorPrimary: "#d4af37",
      colorPrimaryBg: "#faf4e6",
      fontFamily: "'Times New Roman', Times, serif",
    },
    Badge: {
      colorPrimary: "#d4af37",
      fontFamily: "'Times New Roman', Times, serif",
    },
    Typography: {
      fontFamily: "'Times New Roman', Times, serif",
    },
    Input: {
      fontFamily: "'Times New Roman', Times, serif",
    },
    Select: {
      fontFamily: "'Times New Roman', Times, serif",
    },
    Table: {
      fontFamily: "'Times New Roman', Times, serif",
    },
    Modal: {
      fontFamily: "'Times New Roman', Times, serif",
    },
    Form: {
      fontFamily: "'Times New Roman', Times, serif",
    },
  },
} as const;

/* ── CSS-level design tokens (used in index.css and inline styles) ── */
export const ewsColors = {
  primary: "#c41fa8",
  primaryHover: "#a61d94",
  primaryActive: "#8e1a80",
  primaryLight: "rgba(196, 31, 168, 0.1)",
  primaryLighter: "rgba(196, 31, 168, 0.05)",
  headerGradientFrom: "#c41fa8",
  headerGradientTo: "#9c1585",
  sidebarBg: "#ffffff",
  sidebarBorder: "#f0e6ee",
  sidebarActiveBg: "#c41fa8",
  sidebarActiveText: "#ffffff",
  sidebarText: "#333333",
  sidebarSubtext: "#888888",
  contentBg: "#f5f5f5",
  cardBg: "#ffffff",
  cardBorder: "#f0e6ee",
  textPrimary: "#333333",
  textSecondary: "#666666",
  gold: "#d4af37",
} as const;

export const ewsFonts = {
  family: "'Times New Roman', Times, serif",
} as const;
