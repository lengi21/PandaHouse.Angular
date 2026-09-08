# Panda House delivery agenda

## Working approach

Build the Angular application against typed mock repositories first. UI components depend on feature state, which depends on repository contracts. Supabase implementations will replace mock repository providers only after the customer and admin workflows are complete.

## 1. Architecture and routing foundation

Status: complete.

- Standalone Angular application with strict type checking.
- Lazy customer and admin route boundaries.
- Runtime language loading with ngx-translate.

## 2. Shared models and customer mock data

Status: in progress.

- Define reusable restaurant, category, dish, translation, media, and money models.
- Create repository contracts and mock implementations.
- Add customer feature state that consumes repositories instead of fixture data in components.

## 3. Customer shell and visual foundation

- Build the mobile-first fixed header and bottom navigation.
- Add centralized Olive light and dark design tokens and the palette switching foundation.
- Add reusable image, price, quantity-control, category-card, dish-card, and category-selector components only where they are used.

## 4. Customer categories and menu

- Implement category cards with responsive lazy-loaded imagery.
- Implement continuous category sections, category selection, smooth scrolling, and active-section tracking.
- Add header search that filters menu state without coupling search logic to presentation components.

## 5. Customer cart and restaurant information

- Add a signal-based cart store, quantity controls, item removal, and totals.
- Build the cart and restaurant information screens against mock data.
- Complete keyboard, screen-reader, touch, loading, empty, and error states.

## 6. Customer quality pass

- Verify responsive behavior across phone, tablet, and desktop widths.
- Improve loading behavior, image dimensions, lazy loading, and route performance.
- Replace temporary mock imagery with approved restaurant assets when available.

## 7. Admin mock application

- Build responsive admin layout, sign-in UI, dashboard, and navigation using mock authentication state.
- Build category, dish, restaurant, and theme management flows against the same repository contracts.
- Model visibility, availability, publishing, sorting, translations, and image changes explicitly.

## 8. Supabase foundation

- Define PostgreSQL schema, translation tables, relationships, storage paths, and Row Level Security.
- Configure Supabase Auth for administrators only.
- Implement Supabase repository classes and switch Angular providers from mock to Supabase implementations.

## 9. Backend integration and security

- Connect customer reads and protected admin CRUD.
- Add Edge Functions only for operations that require server-side enforcement or business logic.
- Validate authorization boundaries and public data exposure through RLS.

## 10. Production readiness

- Configure Cloudflare Pages, environment variables, caching, and image delivery.
- Run production builds and perform accessibility and responsive checks.
- Prepare the QR entry URL and restaurant launch checklist.
