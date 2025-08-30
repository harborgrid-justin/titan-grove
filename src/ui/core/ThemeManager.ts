/**
 * ThemeManager - Manages UI themes and styling
 */

import { EventEmitter } from 'events';
import type { Logger } from 'winston';
import { UITheme } from '../types';

export class ThemeManager extends EventEmitter {
  private logger: Logger;
  private themes: Map<string, UITheme> = new Map();
  private activeThemes: Map<string, string> = new Map(); // userId -> themeId

  constructor(logger: Logger) {
    super();
    this.logger = logger;
  }

  /**
   * Register a new theme
   */
  async registerTheme(theme: UITheme): Promise<void> {
    this.validateTheme(theme);
    
    this.themes.set(theme.id, theme);
    
    this.logger.info(`Theme registered: ${theme.name} (${theme.id})`);
    this.emit('themeRegistered', theme);
  }

  /**
   * Get theme by ID
   */
  async getTheme(themeId: string): Promise<UITheme | null> {
    return this.themes.get(themeId) || null;
  }

  /**
   * Get all themes
   */
  async getAllThemes(): Promise<UITheme[]> {
    return Array.from(this.themes.values());
  }

  /**
   * Apply theme to user
   */
  async applyThemeToUser(userId: string, themeId: string): Promise<void> {
    if (!this.themes.has(themeId)) {
      throw new Error(`Theme ${themeId} not found`);
    }

    this.activeThemes.set(userId, themeId);
    this.logger.info(`Applied theme ${themeId} to user ${userId}`);
  }

  /**
   * Get user's active theme
   */
  async getUserTheme(userId: string): Promise<UITheme | null> {
    const themeId = this.activeThemes.get(userId);
    return themeId ? this.themes.get(themeId) || null : null;
  }

  /**
   * Generate CSS for theme
   */
  async generateThemeCSS(themeId: string): Promise<string> {
    const theme = this.themes.get(themeId);
    if (!theme) {
      throw new Error(`Theme ${themeId} not found`);
    }

    return this.buildCSSFromTheme(theme);
  }

  /**
   * Create custom theme from base theme
   */
  async createCustomTheme(
    baseThemeId: string, 
    customizations: Partial<UITheme>, 
    newThemeId: string
  ): Promise<UITheme> {
    const baseTheme = this.themes.get(baseThemeId);
    if (!baseTheme) {
      throw new Error(`Base theme ${baseThemeId} not found`);
    }

    const customTheme: UITheme = {
      ...baseTheme,
      ...customizations,
      id: newThemeId,
      // Deep merge colors
      colors: {
        ...baseTheme.colors,
        ...customizations.colors,
        text: {
          ...baseTheme.colors.text,
          ...customizations.colors?.text
        },
        status: {
          ...baseTheme.colors.status,
          ...customizations.colors?.status
        }
      },
      // Deep merge typography
      typography: {
        ...baseTheme.typography,
        ...customizations.typography,
        fontFamily: {
          ...baseTheme.typography.fontFamily,
          ...customizations.typography?.fontFamily
        },
        fontSizes: {
          ...baseTheme.typography.fontSizes,
          ...customizations.typography?.fontSizes
        },
        fontWeights: {
          ...baseTheme.typography.fontWeights,
          ...customizations.typography?.fontWeights
        },
        lineHeights: {
          ...baseTheme.typography.lineHeights,
          ...customizations.typography?.lineHeights
        }
      }
    };

    await this.registerTheme(customTheme);
    return customTheme;
  }

  /**
   * Validate theme structure
   */
  private validateTheme(theme: UITheme): void {
    if (!theme.id) {
      throw new Error('Theme ID is required');
    }
    if (!theme.name) {
      throw new Error('Theme name is required');
    }
    if (!theme.colors) {
      throw new Error('Theme colors are required');
    }
    if (!theme.typography) {
      throw new Error('Theme typography is required');
    }
    if (!theme.spacing) {
      throw new Error('Theme spacing is required');
    }

    // Check for duplicate ID
    if (this.themes.has(theme.id)) {
      throw new Error(`Theme with ID ${theme.id} already exists`);
    }
  }

  /**
   * Build CSS string from theme object
   */
  private buildCSSFromTheme(theme: UITheme): string {
    const { colors, typography, spacing, responsive } = theme;
    
    let css = ':root {\n';
    
    // Colors
    css += `  --primary: ${colors.primary};\n`;
    css += `  --secondary: ${colors.secondary};\n`;
    css += `  --accent: ${colors.accent};\n`;
    css += `  --background: ${colors.background};\n`;
    css += `  --surface: ${colors.surface};\n`;
    css += `  --text-primary: ${colors.text.primary};\n`;
    css += `  --text-secondary: ${colors.text.secondary};\n`;
    css += `  --text-disabled: ${colors.text.disabled};\n`;
    css += `  --success: ${colors.status.success};\n`;
    css += `  --warning: ${colors.status.warning};\n`;
    css += `  --error: ${colors.status.error};\n`;
    css += `  --info: ${colors.status.info};\n`;
    
    // Typography
    css += `  --font-primary: ${typography.fontFamily.primary};\n`;
    css += `  --font-secondary: ${typography.fontFamily.secondary};\n`;
    css += `  --font-mono: ${typography.fontFamily.monospace};\n`;
    css += `  --text-xs: ${typography.fontSizes.xs};\n`;
    css += `  --text-sm: ${typography.fontSizes.sm};\n`;
    css += `  --text-md: ${typography.fontSizes.md};\n`;
    css += `  --text-lg: ${typography.fontSizes.lg};\n`;
    css += `  --text-xl: ${typography.fontSizes.xl};\n`;
    css += `  --text-xxl: ${typography.fontSizes.xxl};\n`;
    
    // Spacing
    css += `  --spacing-unit: ${spacing.unit}px;\n`;
    spacing.scale.forEach((value, index) => {
      css += `  --spacing-${index}: ${value}px;\n`;
    });
    
    css += '}\n\n';
    
    // Responsive breakpoints
    css += `@media (min-width: ${responsive.breakpoints.tablet}) {\n`;
    css += `  :root {\n`;
    css += `    --container-max-width: ${responsive.spacing.tablet.layouts.containerMaxWidth};\n`;
    css += `  }\n`;
    css += '}\n\n';
    
    css += `@media (min-width: ${responsive.breakpoints.desktop}) {\n`;
    css += `  :root {\n`;
    css += `    --container-max-width: ${responsive.spacing.desktop.layouts.containerMaxWidth};\n`;
    css += `  }\n`;
    css += '}\n\n';
    
    // Base styles
    css += `
body {
  font-family: var(--font-primary);
  background-color: var(--background);
  color: var(--text-primary);
  margin: 0;
  padding: 0;
}

.titan-container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.titan-card {
  background: var(--surface);
  border-radius: var(--spacing-2);
  padding: var(--spacing-4);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.titan-button {
  background: var(--primary);
  color: white;
  border: none;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--spacing-1);
  font-family: var(--font-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.titan-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.titan-text-xs { font-size: var(--text-xs); }
.titan-text-sm { font-size: var(--text-sm); }
.titan-text-md { font-size: var(--text-md); }
.titan-text-lg { font-size: var(--text-lg); }
.titan-text-xl { font-size: var(--text-xl); }
.titan-text-xxl { font-size: var(--text-xxl); }
`;
    
    return css;
  }
}