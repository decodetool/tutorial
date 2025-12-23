# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trip Share is a modern, mobile-first trip planning web app built as part of Decode's onboarding tutorial. It features interactive maps, itinerary planning, and social features for collaborative trip planning.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite (dev server runs on port 5179)
- **Routing**: TanStack Router (file-based routing with auto-generated route tree)
- **State Management**:
  - Zustand (client state with persistence)
  - TanStack Query (server state/async data)
- **Styling**: TailwindCSS v3 with custom design system
- **UI Components**:
  - Silk Bottom Sheets (`@silk-hq/components`)
  - Custom components in `src/components/`
- **Maps**: MapLibre GL JS
- **Animation**: Framer Motion

## Development Commands

```bash
# Install dependencies
pnpm install

# Start dev server (runs on http://localhost:5179)
pnpm dev

# Type check and build for production
pnpm build

# Lint code
pnpm lint

# Preview production build
pnpm preview
```

## Architecture

### Routing Structure

Uses TanStack Router with file-based routing. Routes are defined in `src/routes/`:

- `__root.tsx` - Root layout with AppShell wrapper
- `index.tsx` - Redirects to /discover
- `discover.tsx` - Browse cities
- `cities.$cityId.tsx` - City detail view
- `trips.index.tsx` - Trip list
- `trips.$tripId.tsx` - Trip detail with itinerary
- `map.tsx` - Interactive map with place filtering
- `activity.tsx` - Social activity feed
- `messages.index.tsx` - Conversation list
- `messages.$conversationId.tsx` - Chat view
- `settings.index.tsx` - Settings menu
- `settings.profile.tsx` - Profile settings
- `components.index.tsx` - Component gallery

**Important**: The route tree is auto-generated at `src/routeTree.gen.ts` by the TanStack Router Vite plugin. Don't edit this file manually.

### State Management

**Zustand Stores** (in `src/stores/`):
- `useTripsStore` - Trip and itinerary data with localStorage persistence
- `useMapStore` - Map state (center, zoom, selected place, category filters)

**TanStack Query**: Used for async data fetching via mock API (`src/lib/mock-api.ts`). Configured in `src/main.tsx` with 5-minute stale time.

### Data Flow

1. Mock data is defined in `src/lib/seed-data.ts` (cities, places, trips, users)
2. `src/lib/mock-api.ts` provides async functions that simulate API calls with 300ms latency
3. Components use TanStack Query hooks to fetch data
4. Zustand stores manage client-side state that needs persistence or global access

### Component Structure

**Layout Components**:
- `AppShell.tsx` - Main layout with bottom navigation and floating settings button
  - Hides UI chrome when viewing single component (`/components?component=X`)
  - Bottom nav highlights active route with animated indicator

**Feature Components**:
- `Map.tsx` - MapLibre GL integration with category filtering
- `PlaceDetailSheet.tsx` - Silk bottom sheet for place details
- `CityDetailSheet.tsx` - Silk bottom sheet for city overview
- `LoadingSkeleton.tsx` - Loading states

**UI Components** (in `src/components/ui/`):
- `BottomSheet.tsx` - Wrapper for Silk bottom sheets
- `Tabs.tsx` - Animated tab navigation

### Design System

Custom dark theme defined in `tailwind.config.js`:

**Colors**:
- Background: `#0C0F14`
- Surface: `#11161C`
- Text Primary: `#E8EDF7`
- Text Secondary: `#9AA5B4`
- Accent Teal: `#2ED3B7`
- Accent Cyan: `#22D3EE`

**Patterns**:
- Glass morphism effects with backdrop blur
- Gradient backgrounds (teal → cyan)
- Rounded corners (2xl = 1rem, 3xl = 1.5rem)
- Custom animations (shimmer, float, pulse-slow)

### Component Gallery

The `/components` route provides a comprehensive design system showcase:

**Layout Structure**:
- **Grid View** (`/components`): Displays all components organized by category with mini previews
- **Isolation View** (`/components?component=ComponentId`): Shows a single component without any UI chrome (no AppShell, no navigation)

**How to view components in isolation**:
1. Navigate to `/components` to see the gallery grid
2. Click any component or manually add `?component=ComponentId` to URL
3. The component will render centered on screen without bottom nav or settings button
4. Perfect for developing/reviewing components in isolation or embedding in webviews

**Component Categories**:
- Timeline & Cards: `TripTimelineCard`, `TripCardVariants`, `CityCard`, `ActivityCard`
- Chat & Messaging: `MessageBubble`, `MessageBubbleVariants`, `ConversationItem`
- Navigation: `TabsComponent`, `SettingsItem`
- UI Elements: `DateBadge`, `AvatarGroup`, `StatusBadges`, `Buttons`

**Implementation Details**:
- Component definitions live in `src/routes/components.index.tsx`
- Each component has mock data and demonstrates usage patterns
- Mini previews shown in grid, full version in isolation view
- The `isSingleComponentView` flag in AppShell detects `?component=` query param and hides chrome

**Use Cases**:
- Design system documentation
- Component development in isolation
- Embedding components in external tools/webviews
- Visual regression testing
- Design review sessions

### Path Alias

`@/` is aliased to `./src/` in `vite.config.ts`. Always use this for imports:
```typescript
import { mockApi } from '@/lib/mock-api'
import { useTripsStore } from '@/stores/useTripsStore'
```

## Key Files

- `src/main.tsx` - App entry point, router + query client setup
- `src/types/index.ts` - TypeScript type definitions
- `src/lib/seed-data.ts` - Mock data
- `src/lib/mock-api.ts` - Simulated backend API
- `src/lib/utils.ts` - Utility functions (including `cn` for class merging)
- `tailwind.config.js` - Design system configuration
- `vite.config.ts` - Build configuration

## Important Notes

- The app uses mock data only (no real backend)
- MapLibre GL requires map tiles - check Map component for configuration
- Bottom sheets use Silk components - refer to their docs for advanced usage
- All routing is client-side via TanStack Router
- localStorage is used for trip/itinerary persistence via Zustand middleware
- The Tutorial.decode file is a Decode-specific design file (ignore for code work)
