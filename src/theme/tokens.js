export const Palette = {
  // Brand Core: Hyper-Indigo (The "Nudge" Signature)
  primary: '#6366F1',            // Electric Indigo
  primaryLight: '#818CF8',       // Light hover / active tint
  primaryDark: '#4F46E5',        // Pressed / deep state
  primaryMuted: 'rgba(99, 102, 241, 0.12)', // Subtle background pill tint
  primaryGlow: 'rgba(99, 102, 241, 0.35)',

  // Secondary Accent: Sunset Coral (For "Nudges", Pings & Live Badges)
  accentCoral: '#FF5C77',
  accentCoralLight: '#FFA0B2',
  accentCoralMuted: 'rgba(255, 92, 119, 0.15)',
  accentCoralGlow: 'rgba(255, 92, 119, 0.4)',

  // Chat Bubbles (Outgoing - The Sender)
  bubbleSentLight: '#6366F1',     // Vibrant electric indigo
  bubbleSentTextLight: '#FFFFFF',
  bubbleSentDark: '#4F46E5',      // Deep luminous royal violet
  bubbleSentTextDark: '#FFFFFF',

  // Chat Bubbles (Incoming - The Receiver)
  bubbleReceivedLight: '#FFFFFF',
  bubbleReceivedTextLight: '#0F172A',
  bubbleReceivedDark: '#191B24',  // Elevated midnight slate card
  bubbleReceivedTextDark: '#F8FAFC',

  // Dark Canvas (True Midnight Void - 0% Muddy Green)
  canvasDark: '#0B0C10',         // Deepest background
  surfaceDark1: '#12141C',       // App header & tab bars
  surfaceDark2: '#191B24',       // Cards & incoming message bubbles
  surfaceDark3: '#222532',       // Input containers & active list items
  borderDark: 'rgba(255, 255, 255, 0.08)',
  borderDarkSubtle: 'rgba(255, 255, 255, 0.04)',

  // Light Canvas (Alabaster & Pure Crisp Surfaces)
  canvasLight: '#F8FAFC',        // Soft modern background
  surfaceLight1: '#FFFFFF',      // White cards & top bar
  surfaceLight2: '#F1F5F9',      // Input bars & secondary chips
  surfaceLight3: '#E2E8F0',      // Dividers & inactive tabs
  borderLight: 'rgba(15, 23, 42, 0.08)',
  borderLightSubtle: 'rgba(15, 23, 42, 0.04)',

  // Text Hierarchy (Slate Spectrum)
  textLightPrimary: '#0F172A',
  textLightSecondary: '#475569',
  textLightMuted: '#94A3B8',

  textDarkPrimary: '#F8FAFC',
  textDarkSecondary: '#94A3B8',
  textDarkMuted: '#64748B',

  // Status & Receipts
  readReceipt: '#38BDF8',        // Neon Sky Blue double check
  deliveredReceipt: '#64748B',
  onlineBadge: '#FF5C77',        // Coral pulse indicator for Nudge
  danger: '#EF4444',
  dangerMuted: 'rgba(239, 68, 68, 0.15)',
  success: '#10B981',
  successMuted: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245, 158, 11, 0.15)',
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,

  // Layout-specific measurements
  headerHeight: 60,
  bottomInputHeight: 56,
  chatGutter: 12,
  bubbleHorizontalPadding: 14,
  bubbleVerticalPadding: 10,
  bubbleGap: 6,
  avatarSm: 36,
  avatarMd: 48,
  avatarLg: 64,
  avatarXl: 96,
};

export const Radii = {
  none: 0,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  full: 9999,

  // Asymmetric Squircle Chat Bubbles
  bubbleBase: 18,
  bubbleAnchor: 4,               // The tight corner indicating the sender
  inputPill: 28,
};

export const Typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  fontSize: {
    micro: 10,                   // Unread count badges, delivery status
    caption: 12,                 // Timestamps, typing indicators
    subtext: 13,                 // "Active now", contact bio
    bodySmall: 14,               // Secondary preview text in chat list
    body: 15.5,                  // Primary readable chat bubble text
    headline: 17,                // Contact name, section headers
    title: 20,                   // Screen headers
    largeTitle: 28,              // Auth / Onboarding headers
  },
  lineHeight: {
    caption: 16,
    bodySmall: 20,
    body: 22,
    headline: 24,
    title: 28,
    largeTitle: 34,
  },
};

export const Shadows = {
  elevation1: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  elevation2: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  glowPrimary: {
    shadowColor: Palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  glowCoral: {
    shadowColor: Palette.accentCoral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
};