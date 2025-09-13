# Carbon Design System Integration Guide

## Overview

Titan Grove has been successfully integrated with IBM's Carbon Design System, providing a modern, accessible, and consistent user interface across all enterprise modules.

## Implementation Details

### React Frontend Integration

The React frontend (`src/ui/react/`) has been fully integrated with Carbon Design System:

#### Packages Installed
- `@carbon/react` - Core React components
- `@carbon/styles` - CSS styles and design tokens
- `@carbon/icons-react` - Icon library
- `@carbon/themes` - Theme configuration
- `@carbon/layout` - Layout utilities
- `@carbon/type` - Typography utilities

#### Key Components Updated

1. **Header Component** (`src/ui/react/src/components/Header.tsx`)
   - Replaced custom header with Carbon `HeaderContainer`
   - Uses Carbon `HeaderNavigation` and `HeaderMenuItem`
   - Implements Carbon `HeaderGlobalAction` for search, notifications, and user menu

2. **KPI Widget Component** (`src/ui/react/src/components/KPIWidget.tsx`)
   - Converted to use Carbon `Tile` component
   - Uses Carbon design tokens for colors and typography
   - Implements Carbon `DefinitionTooltip` for accessibility

3. **Data Table Component** (`src/ui/react/src/components/DataTable.tsx`)
   - Full implementation using Carbon `DataTable` component
   - Includes search, pagination, and action buttons
   - Uses Carbon `Tag` components for status indicators

4. **Theme Integration** (`src/ui/react/src/App.tsx`)
   - Wrapped application in Carbon `Theme` provider
   - Set to use 'white' theme for enterprise appearance

#### CSS Integration (`src/ui/react/src/styles/index.css`)
- Imports Carbon styles: `@import '@carbon/styles/css/styles.css'`
- Maps Carbon design tokens to custom CSS variables
- Provides Carbon-inspired component styles

### Static HTML Integration

For static HTML pages (`src/ui/static/`), Carbon integration is provided through:

#### Carbon Override Stylesheet (`src/ui/static/styles/carbon-overrides.css`)
- Comprehensive mapping of Carbon design tokens to CSS variables
- Carbon-inspired component styles for tables, buttons, cards
- Responsive design following Carbon layout principles
- Uses IBM Plex Sans and IBM Plex Mono fonts

#### Carbon Button Components (`src/ui/static/styles/carbon-buttons.css`)
- Complete button system following Carbon specifications
- Multiple variants: primary, secondary, tertiary, ghost, danger
- Different sizes: small, default, large, extra-large
- Loading states and accessibility features

#### Updated HTML Files
- Modified `src/ui/static/dashboard.html` to include Carbon stylesheets
- Updated font imports to use IBM Plex Sans/Mono
- Added Carbon override stylesheet references

## Design Token Mapping

### Colors
- **Primary**: `#0f62fe` (IBM Blue 60)
- **Secondary**: `#393939` (IBM Gray 80)
- **Success**: `#24a148` (IBM Green 50)
- **Warning**: `#f1c21b` (IBM Yellow 30)
- **Error**: `#da1e28` (IBM Red 60)
- **Info**: `#0f62fe` (IBM Blue 60)

### Typography
- **Primary Font**: IBM Plex Sans
- **Monospace Font**: IBM Plex Mono
- **Type Scale**: Carbon productive heading and body scales

### Spacing
- Uses Carbon's 8px grid system
- Consistent spacing tokens throughout the application

### Layout
- **Header Height**: 48px (Carbon standard)
- **Sidebar Width**: 256px (Carbon side nav standard)
- **Max Content Width**: 1584px (Carbon max width)

## Usage Examples

### React Components

```tsx
// Using Carbon Button
import { Button } from '@carbon/react';
<Button kind="primary" size="lg">Primary Action</Button>

// Using Carbon Tile for KPI
import { Tile } from '@carbon/react';
<Tile className="kpi-widget">
  <div>Revenue</div>
  <div>$24.5M</div>
</Tile>

// Using Carbon DataTable
import { DataTable } from '@carbon/react';
<DataTable rows={data} headers={headers}>
  {/* Table implementation */}
</DataTable>
```

### Static HTML

```html
<!-- Include Carbon stylesheets -->
<link rel="stylesheet" href="styles/carbon-overrides.css">
<link rel="stylesheet" href="styles/carbon-buttons.css">

<!-- Use Carbon-style buttons -->
<button class="carbon-btn">Primary Button</button>
<button class="carbon-btn carbon-btn--secondary">Secondary Button</button>
<button class="carbon-btn carbon-btn--tertiary">Tertiary Button</button>

<!-- Use Carbon-style cards -->
<div class="titan-card">
  <h3>Card Title</h3>
  <p>Card content following Carbon design patterns</p>
</div>

<!-- Use Carbon-style tables -->
<table class="titan-table">
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

## Benefits

1. **Consistent Design**: Unified visual language across all Titan Grove modules
2. **Accessibility**: Carbon components follow WCAG 2.1 AA standards
3. **Professional Appearance**: Enterprise-grade design suitable for Fortune 100 companies
4. **Developer Experience**: Well-documented components and design tokens
5. **Responsive Design**: Mobile-first approach with consistent breakpoints
6. **Maintainability**: Centralized design system reduces design debt

## Browser Compatibility

Carbon Design System supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11 (limited support)

## Future Enhancements

1. **Dark Theme Support**: Implement Carbon's dark theme variants
2. **Motion Integration**: Add Carbon motion tokens for animations
3. **Advanced Components**: Integrate more Carbon components as needed
4. **Custom Theme**: Create Titan Grove-specific Carbon theme
5. **Design Tokens API**: Implement dynamic theme switching

## Testing

The implementation has been tested with:
- React development server (`npm run dev:ui`)
- Production build (`npm run build:ui`)
- Visual consistency across all major browsers
- Accessibility testing with screen readers

## Conclusion

The Carbon Design System integration provides Titan Grove with a modern, accessible, and maintainable design foundation that scales across the entire enterprise application suite. The implementation maintains existing functionality while significantly improving the visual design and user experience.