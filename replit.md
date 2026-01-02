# replit.md

## Overview

This is a full-stack web application built with React on the frontend and Express on the backend. The project follows a monorepo structure with separate client, server, and shared directories. It appears to be set up as a game application based on the routing structure pointing to a Game component.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (supports light/dark mode)
- **Build Tool**: Vite with React plugin

The frontend uses a component-based architecture with pre-built UI components from shadcn/ui. Path aliases are configured (`@/` for client source, `@shared/` for shared code).

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Pattern**: RESTful routes prefixed with `/api`
- **Build**: esbuild bundles server code for production

The server includes middleware for JSON parsing with raw body preservation (useful for webhook signature verification). A storage abstraction layer (`IStorage` interface) allows swapping between in-memory storage and database implementations.

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` - shared between frontend and backend
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Current Implementation**: In-memory storage (`MemStorage` class) with interface ready for database swap
- **Database Config**: Requires `DATABASE_URL` environment variable for PostgreSQL

### Development vs Production
- **Development**: Vite dev server with HMR, served through Express middleware
- **Production**: Static files served from `dist/public`, server bundled to `dist/index.cjs`

## External Dependencies

### Database
- **PostgreSQL**: Required when using database storage (provision and set `DATABASE_URL`)
- **Drizzle Kit**: Used for schema migrations (`npm run db:push`)
- **connect-pg-simple**: Session storage for PostgreSQL

### UI Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Embla Carousel**: Carousel functionality
- **Recharts**: Charting library
- **cmdk**: Command palette component
- **Vaul**: Drawer component

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, and dev banner for Replit environment
- **TypeScript**: Strict mode enabled with bundler module resolution