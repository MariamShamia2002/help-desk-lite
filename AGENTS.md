# Helpdesk Lite – Project Rules

## Stack

- React 19 + TypeScript, built with Vite
- Tailwind CSS v4 (via `@tailwindcss/vite`), shadcn/ui components on Base UI primitives (`@base-ui/react`), `lucide-react` icons
- TanStack React Query for server state
- React Router v7 (import from `react-router`, not `react-router-dom`)
- Zustand for global client state (e.g. auth session, current user)
- react-hook-form + Zod for forms and validation (`@hookform/resolvers/zod`)

## Folder Structure

- `src/api/` – shared HTTP client (`client.ts`), error helpers (`errors.ts`), API types (`types.ts`)
- `src/components/ui/` – shadcn UI primitives (add with `npx shadcn@latest add <component>`; don't hand-edit unless needed)
- `src/components/shared/` – app-wide components (e.g. `NotFoundPage`, `ProtectedRoute`)
- `src/layout/` – app shell (`AppLayout`, `Header`)
- `src/lib/utils.ts` – `cn()` helper for class names
- `src/router.tsx` – route definitions (`createBrowserRouter`)
- `src/features/<feature>/` – feature code (e.g. `tickets`, `auth`, `users`), using only the subfolders it needs:
  - `api/` – API functions (e.g. `ticketsApi.ts`)
  - `components/`, `pages/`, `hooks/`
  - `schemas/` – Zod schemas (e.g. `ticketSchema.ts`)
  - `store/` – Zustand stores (e.g. `authStore.ts`)
  - `types/` – `*.types.ts` files (e.g. `ticket.types.ts`)
  - `lib/` – feature-specific helpers (e.g. status/priority labels)

## Domain

- Core entity is the **ticket**: title, description, status, priority, requester, assignee, timestamps
- Model fixed sets (status, priority, roles) as string literal unions plus a matching Zod enum; keep their display labels in one place (`lib/` or a constant)
- Ticket lists must support loading, error, and empty states, and filtering by status/priority when the feature needs it

## TypeScript

- All new files in TypeScript with strict typing (`strict: true` is set in the root `tsconfig.json`)
- Prefer `interface` for object shapes; put shared types in the feature's `types/` folder
- Infer form types from Zod schemas (`z.infer<typeof schema>`) instead of duplicating them
- Name component props `<ComponentName>Props`
- No `any`; use `unknown` and narrow

## Components

- Functional components with hooks
- Pages, layouts, and route components use `export default`; everything else uses named exports
- Order inside a component: hooks, derived values, handlers, early returns, JSX
- Move reusable logic into custom hooks
- Base UI composition uses the `render` prop, not `asChild`. A `Button` rendering a link: `<Button nativeButton={false} render={<Link to="/" />}>`

## Styling

- Tailwind classes only; `src/index.css` is the single global stylesheet (Tailwind import + shadcn theme tokens)
- Use `cn()` for conditional classes
- Prefer theme tokens (`bg-primary`, `text-muted-foreground`, `border-border`) over arbitrary values
- Build on existing `src/components/ui/` components before creating new ones

## Data Fetching

- All HTTP requests go through `apiClient` in `src/api/client.ts` (base URL from `VITE_API_URL`)
- Wrap API functions in React Query hooks in the feature's `hooks/` folder (e.g. `useTickets`, `useCreateTicket`)
- Use stable, structured query keys (e.g. `['tickets', filters]`, `['tickets', id]`) and invalidate them after mutations
- Handle loading, error, and empty states
- `apiClient` throws `ApiError` (with `status` and `body`); the global `QueryClient` doesn't retry 4xx errors
- Use helpers from `src/api/errors.ts` (`isApiError`, `isUnauthorized`, `getFieldErrors`, `getErrorMessage`) to map errors to user-friendly messages or form field errors

## Forms

- Use react-hook-form with `zodResolver` and a schema from `schemas/`
- Show field errors with `aria-invalid`, `aria-describedby`, and `role="alert"`
- Map server validation errors onto fields with `getFieldErrors` + `setError`

## Routing

- Define routes in `src/router.tsx` as children of `AppLayout`
- Protect authenticated routes with `ProtectedRoute` from `src/components/shared/`
- Unknown paths fall through to `NotFoundPage`

## Imports

Order imports as follows:

1. External libraries
2. Internal absolute imports using `@/`
3. Relative imports

## Naming

- Components: PascalCase (`TicketCard.tsx`)
- Hooks: camelCase with `use` prefix (`useTickets.ts`)
- Utilities / API files: camelCase (`ticketsApi.ts`)
- Types files: `<name>.types.ts`
- Constants: UPPER_SNAKE_CASE

## Accessibility

- Semantic HTML, proper labels and ARIA attributes
- Keyboard navigation must work for all interactive elements (forms, menus, dialogs, ticket lists)
- Don't convey status/priority by color alone; pair it with text or an icon

## Quality

- Code must pass `npm run lint` and `npm run build` (type check) with no errors
- Keep functions small and avoid deep JSX nesting
- Never commit secrets; configuration comes from `VITE_*` env variables (e.g. `VITE_API_URL`); document new ones in `.env.example`

## Commits

- Conventional commits: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Change scope

- Do not modify more than 5 files per request. If a task requires changes to more than 5 files, split it into smaller, logically complete steps and explain the proposed split before proceeding. Prioritize the smallest set of files needed to complete each change.
