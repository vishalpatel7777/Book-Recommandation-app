import theme from '../config/theme.config';

/**
 * Injects theme tokens as CSS custom properties on :root.
 * CSS vars defined here are used by all components — never hardcode raw hex values.
 * Called once in main.jsx before first render.
 */
export function injectThemeVariables() {
  const r = document.documentElement;
  const s = (name, val) => r.style.setProperty(name, val);

  // Primary (sage)
  s('--color-primary',        theme.colors.primary);
  s('--color-primary-dark',   theme.colors.primaryDark);
  s('--color-primary-light',  theme.colors.primaryLight);

  // Secondary (amber)
  s('--color-secondary',      theme.colors.secondary);
  s('--color-secondary-dark', theme.colors.secondaryDark);

  // Status
  s('--color-success',  theme.colors.success);
  s('--color-error',    theme.colors.error);
  s('--color-warning',  theme.colors.warning);
  s('--color-info',     theme.colors.info);

  // Backgrounds
  s('--color-bg-page',         theme.colors.background.page);
  s('--color-bg-card',         theme.colors.background.card);
  s('--color-bg-navbar',       theme.colors.background.navbar);
  s('--color-bg-surface',      theme.colors.background.surface);
  s('--color-bg-surface-hover',theme.colors.background.surfaceHover);
  s('--color-bg-parchment',    theme.colors.background.parchment);

  // Text
  s('--color-text-primary',   theme.colors.text.primary);
  s('--color-text-secondary', theme.colors.text.secondary);
  s('--color-text-muted',     theme.colors.text.muted);
  s('--color-text-faint',     theme.colors.text.faint);

  // Borders
  s('--color-border',        theme.colors.border);
  s('--color-border-medium', theme.colors.borderMedium);
  s('--color-border-focus',  theme.colors.borderFocus);

  // Accent
  s('--color-accent-sage',       theme.colors.accent.sage);
  s('--color-accent-sage-dark',  theme.colors.accent.sageDark);
  s('--color-accent-sage-light', theme.colors.accent.sageLight);
  s('--color-accent-amber',      theme.colors.accent.amber);
  s('--color-accent-amber-dark', theme.colors.accent.amberDark);
  s('--color-accent-amber-light',theme.colors.accent.amberLight);
  s('--color-accent-gold',       theme.colors.accent.gold);
  s('--color-accent-red',        theme.colors.accent.red);
  s('--color-accent-red-light',  theme.colors.accent.redLight);

  // Admin
  s('--admin-input-bg',    theme.colors.admin.inputBg);
  s('--admin-table-header',theme.colors.admin.tableHeader);
  s('--admin-teal',        theme.colors.admin.teal);
  s('--admin-teal-dark',   theme.colors.admin.tealDark);
  s('--admin-gold',        theme.colors.admin.gold);
  s('--admin-sidebar',     theme.colors.admin.sidebar);

  // Fonts
  s('--font-heading', theme.fonts.heading);
  s('--font-body',    theme.fonts.body);
  s('--font-mono',    theme.fonts.mono);

  // Border radii (legacy — also defined in spacing.css)
  s('--radius-sm', theme.borderRadius.sm);
  s('--radius-md', theme.borderRadius.md);
  s('--radius-lg', theme.borderRadius.lg);
  s('--radius-xl', theme.borderRadius.xl);
  s('--radius-full', '9999px');

  // Shadows (legacy — also defined in shadows.css)
  s('--shadow-card',   theme.shadows.card);
  s('--shadow-navbar', theme.shadows.navbar);
  s('--shadow-button', theme.shadows.button);
  s('--shadow-soft',   theme.shadows.soft);
  s('--shadow-medium', theme.shadows.medium);
  s('--shadow-hover',  theme.shadows.hover);
  s('--shadow-book',   theme.shadows.book);

  // Transitions (legacy — also defined in animations.css)
  s('--transition-default', theme.transitions.default);
  s('--transition-slow',    theme.transitions.slow);
  s('--transition-fast',    theme.transitions.fast);
}
