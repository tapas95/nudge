import { Palette, Spacing, Radii, Typography, Shadows } from './tokens';

export const lightTheme = {
  dark: false,
  colors: {
    // Brand Accents
    primary: Palette.primary,
    primaryMuted: Palette.primaryMuted,
    primaryDark: Palette.primaryDark,
    accent: Palette.accentCoral,
    accentMuted: Palette.accentCoralMuted,

    // Surfaces & Layers
    background: Palette.canvasLight,
    surface: Palette.surfaceLight1,
    surfaceVariant: Palette.surfaceLight2,
    surfaceMuted: Palette.surfaceLight3,
    headerBackground: Palette.surfaceLight1,
    headerText: Palette.textLightPrimary,
    chatBackground: Palette.canvasLight,
    border: Palette.borderLight,
    borderSubtle: Palette.borderLightSubtle,

    // Typography
    text: Palette.textLightPrimary,
    textSecondary: Palette.textLightSecondary,
    textMuted: Palette.textLightMuted,

    // Chat Bubbles (Outgoing - Electric Indigo)
    bubbleOutgoing: Palette.bubbleSentLight,
    bubbleOutgoingText: Palette.bubbleSentTextLight,
    bubbleOutgoingTime: 'rgba(255, 255, 255, 0.75)',

    // Chat Bubbles (Incoming - Crisp White Tile)
    bubbleIncoming: Palette.bubbleReceivedLight,
    bubbleIncomingText: Palette.bubbleReceivedTextLight,
    bubbleIncomingTime: Palette.textLightMuted,

    // Status & Badges
    readReceipt: Palette.readReceipt,
    deliveredReceipt: Palette.deliveredReceipt,
    onlineBadge: Palette.accentCoral,
    badge: Palette.accentCoral,
    badgeText: '#FFFFFF',
    inputBackground: Palette.surfaceLight2,
  },
  typography: Typography,
  spacing: Spacing,
  radii: Radii,
  typography: Typography,
  shadows: Shadows,
};

export const darkTheme = {
  dark: true,
  colors: {
    // Brand Accents
    primary: Palette.primary,
    primaryMuted: Palette.primaryMuted,
    primaryDark: Palette.primaryDark,
    accent: Palette.accentCoral,
    accentMuted: Palette.accentCoralMuted,

    // Surfaces & Layers (Midnight Void Depth)
    background: Palette.canvasDark,
    surface: Palette.surfaceDark1,
    surfaceVariant: Palette.surfaceDark2,
    surfaceMuted: Palette.surfaceDark3,
    headerBackground: Palette.surfaceDark1,
    headerText: Palette.textDarkPrimary,
    chatBackground: Palette.canvasDark,
    border: Palette.borderDark,
    borderSubtle: Palette.borderDarkSubtle,

    // Typography
    text: Palette.textDarkPrimary,
    textSecondary: Palette.textDarkSecondary,
    textMuted: Palette.textDarkMuted,

    // Chat Bubbles (Outgoing - Royal Violet)
    bubbleOutgoing: Palette.bubbleSentDark,
    bubbleOutgoingText: Palette.bubbleSentTextDark,
    bubbleOutgoingTime: 'rgba(255, 255, 255, 0.65)',

    // Chat Bubbles (Incoming - Frosted Midnight Slate)
    bubbleIncoming: Palette.bubbleReceivedDark,
    bubbleIncomingText: Palette.bubbleReceivedTextDark,
    bubbleIncomingTime: Palette.textDarkMuted,

    // Status & Badges
    readReceipt: Palette.readReceipt,
    deliveredReceipt: Palette.deliveredReceipt,
    onlineBadge: Palette.accentCoral,
    badge: Palette.accentCoral,
    badgeText: '#FFFFFF',
    inputBackground: Palette.surfaceDark3,
  },
  typography: Typography,
  spacing: Spacing,
  radii: Radii,
  typography: Typography,
  shadows: Shadows,
};