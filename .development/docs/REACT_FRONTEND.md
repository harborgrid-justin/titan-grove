# Titan Grove React Frontend

This document provides information about the React enterprise application frontend implementation.

## Overview

The Titan Grove React frontend is a modern, enterprise-grade single page application (SPA) that provides a comprehensive user interface for all business modules. It replaces the previous static HTML/CSS/JS implementation with a dynamic React application.

## Architecture

### Technology Stack
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **React Router** for client-side routing
- **CSS Custom Properties** for theming
- **Responsive Design** for mobile and desktop

### Project Structure
```
src/ui/react/
├── index.html              # Main HTML template
├── src/
│   ├── main.tsx            # Application entry point
│   ├── App.tsx             # Main application component
│   ├── components/         # Reusable components
│   │   ├── Header.tsx      # Navigation header
│   │   ├── Sidebar.tsx     # Left sidebar
│   │   ├── KPIWidget.tsx   # KPI display widget
│   │   └── DataTable.tsx   # Interactive data table
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Executive dashboard
│   │   ├── Manufacturing.tsx # Manufacturing operations
│   │   ├── Financials.tsx  # Financial management
│   │   └── ...             # Other module pages
│   └── styles/
│       └── index.css       # Global styles
└── vite.config.ts          # Vite configuration
```

## Key Features

### Executive Dashboard
- 6 real-time KPI widgets with trending indicators
- Interactive work orders table with search and pagination
- Production analytics widgets
- Global operations monitoring
- System health indicators

### Enterprise Modules
1. **Manufacturing Operations** - Production metrics, OEE, Industry 4.0 integration
2. **Financial Management** - P&L, cash flow, EBITDA tracking
3. **HR Management** - Workforce analytics (expandable)
4. **Supply Chain** - Logistics and procurement (expandable) 
5. **CRM** - Customer relationship management (expandable)
6. **Business Intelligence** - Analytics and reporting (expandable)
7. **Project Management** - Portfolio tracking (expandable)
8. **Asset Management** - Lifecycle management (expandable)
9. **Compliance & Risk** - Regulatory compliance (expandable)

### Interactive Features
- Real-time KPI updates every 5 seconds
- Search functionality across data tables
- Pagination with configurable page sizes
- Responsive navigation with active state management
- User menu with notifications
- Global search capability

## Development

### Getting Started
```bash
# Install dependencies (if not already done)
npm install

# Start React development server
npm run dev:ui

# The application will be available at http://localhost:3001/
```

### Build Commands
```bash
# Build for production
npm run build:ui

# Preview production build
npm run preview:ui
```

### Development Server Configuration
- **Port**: 3001 (to avoid conflicts with backend on 3000)
- **Proxy**: API calls to `/api/*` and `/graphql` are proxied to backend
- **Hot Reload**: Enabled for rapid development

## Backend Integration

The React frontend is designed to work with the existing Titan Grove backend:

### API Integration Points
- `/api/*` - REST API endpoints
- `/graphql` - GraphQL endpoint
- Real-time updates can be implemented using WebSockets or Server-Sent Events

### Data Flow
1. Components use React hooks for state management
2. API calls are made using fetch or axios (can be added)
3. Data is passed down through component props
4. Real-time updates simulate live data changes

## Extending the Application

### Adding New Components
1. Create component files in `src/components/`
2. Follow TypeScript interfaces for props
3. Use existing CSS classes for consistent styling

### Adding New Pages/Modules
1. Create page component in `src/pages/`
2. Add route to `App.tsx`
3. Add navigation link to `Header.tsx`
4. Follow existing patterns for layout and styling

### Customizing Styles
- Modify CSS custom properties in `src/styles/index.css`
- Use existing CSS classes for consistency
- Follow responsive design patterns

## Production Deployment

### Building for Production
```bash
npm run build:ui
```

This creates optimized static files in `dist/ui/` that can be:
- Served by the backend Express server
- Deployed to a CDN
- Served by a reverse proxy (nginx, Apache)

### Environment Configuration
- Development: Vite dev server with backend proxy
- Production: Static files served with API backend
- Docker: Can be containerized with multi-stage builds

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations
- Code splitting at route level
- Lazy loading for heavy components
- Optimized bundle size with Vite
- CSS minification and optimization
- TypeScript for better development experience

## Security
- No sensitive data in frontend code
- API authentication handled by backend
- CORS configuration for cross-origin requests
- Content Security Policy can be implemented

## Testing
The application structure supports:
- Unit testing with Jest and React Testing Library
- Integration testing for component interactions
- E2E testing with Playwright (already available)

## Monitoring and Analytics
- Console logging for development
- Error boundaries can be added for production
- Analytics integration points available
- Performance monitoring setup ready