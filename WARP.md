# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

- Single-page React 19 application built with Vite and React Router DOM.
- Tailwind CSS (with custom brand palettes `cyan1`, `ocean1`, `green1`) is used for styling via `tailwind.config.js` and `postcss.config.js`.
- Frontend for "Hogar Elegante" (dashboard/admin) that communicates with a REST backend at `VITE_API_URL` (see `.env`).

## Key Commands

### Install dependencies

- `npm install`

### Local development

- `npm run dev` – start the Vite development server.
- `npm run dev -- --host 0.0.0.0 --port 5173` – optionally expose the dev server on the local network.

### Production build & preview

- `npm run build` – build static assets into `dist/`.
- `npm run preview` – serve the built app locally using Vite's preview server (approximates production/Vercel behavior).

### Linting & tests

- There are currently **no lint** or **test** scripts defined in `package.json`, and no test framework dependencies.
- To run tests or a single test, a test runner (e.g. Vitest or Jest) must be added to the project first; there is no canonical "single test" command yet.

## Runtime configuration & environment

- Environment variables are defined in `.env`:
  - `VITE_API_URL` – base URL for most backend calls (e.g. auth, dashboard stats).
  - `VITE_API_URL_LOCAL` – local backend base URL referenced in some commented code.
- Many services/hooks fall back to `http://localhost:4000` if `VITE_API_URL` is missing; ensure `.env` is present in development.
- SPA routing is configured through:
  - `vite.config.js` – `base: "/"` and React plugin configuration.
  - `vercel.json` – rewrites all paths to `index.html` and redirects `/` to `/login`. This interacts with React Router's own redirect (`/` → `/home` in `App.jsx`).

## High-level architecture

### Entry points & bootstrapping

- `index.html` – root HTML shell that mounts React into `#root` and loads `src/main.jsx` as the entry script.
- `src/main.jsx` – React entry point; creates the root with `ReactDOM.createRoot` and renders `<App />` inside `React.StrictMode`.
- `src/App.jsx` – top-level app component:
  - Configures `BrowserRouter` and main `Routes`.
  - Handles authentication bootstrap using `authService.verificarSesion()` and manages `isAuthenticated`, `user`, and `isLoading` state.
  - Wraps protected routes with a `ProtectedRoute` component that redirects unauthenticated users to `/login`.
  - Implements global back-button handling for the whole app (via `window.history` + `popstate` and a custom toast element).

### Routing & navigation

- Routing is defined in `src/App.jsx` using `react-router-dom`:
  - `/login` and `/register` – public auth screens (render `Login` / `Register` components).
  - `/home` – main dashboard landing page (`pages/Home.jsx`).
  - `/clientes`, `/productos`, `/pedidos`, `/pagos` – core entity pages behind auth guard.
  - `/` – redirects to `/home` at the React Router level.
- `src/components/Sidebar.jsx`:
  - Provides the main navigation shell for both mobile and desktop (responsive layouts).
  - Renders links for `Inicio`, `Clientes`, `Productos`, `Pedidos`, `Pagos`.
  - Reads `user` data (including `rol`) for display.
  - Handles logout by calling `authService.logout()` and navigating to `/login`.
- Navigation and back handling:
  - `App.jsx` sets up a global `popstate` listener to implement a "press back twice to exit/go back" UX and show a toast (`#back-toast`) using Tailwind-powered animations (see `tailwind.config.js` keyframes `slideUp` and `fadeOut`).
  - There is also a reusable hook `hooks/usePreventBackNavigation.js` that encapsulates a similar pattern at a per-route level; some screens (e.g. modal-heavy ones) push history entries with `state.modal` to intercept back presses instead of performing navigation.

### Pages

- `src/pages/Home.jsx`
  - Dashboard page that aggregates multiple statistics from the backend (`GET {VITE_API_URL}/api/home`).
  - Maintains a `stats` object with totals, orders by status, recent activity, top products, products with low/zero stock, and recent orders.
  - Contains formatting helpers for currency, time-ago labels, and status badge colors.
  - Uses `<Sidebar />` for layout and extensive Tailwind classes for UI.
- `src/pages/Productos.jsx`
  - Central inventory management screen for "productos únicos":
    - Depends on domain hooks: `useProductos`, `useCajas`, `useCategorias`, and `useToast`.
    - Coordinates modal components: `ProductModal`, `DeleteConfirmModal`, `BoxModal`, `BoxDetailModal`, `CategoryModal`.
    - Integrates `CameraCapture` for taking product photos.
    - Manages filtering state (search term, estado, categoría, caja) and computes `filteredProductos` based on combined criteria.
    - Uses a tabbed layout (`activeTab`) to switch between products and cajas views.
  - Integrates with back-button behavior:
    - Pushes history entries with `state.modal: true` when modals open.
    - Listens to `popstate` to close modals cleanly instead of navigating away, coordinating with the global back handler in `App.jsx`.
- `src/pages/Clientes.jsx`, `src/pages/Pedidos.jsx`, `src/pages/Pagos.jsx`
  - Entity-specific pages that follow the same layout pattern as `Home` and `Productos`.
  - Rendered inside the main flex layout with `<Sidebar />` and interact with the backend via axios/services for their respective entities.

### Components

The `src/components` tree is organized by domain plus shared UI components:

- `components/common/*`
  - Shared UI such as `Toast`, driven by the `useToast` hook. Consumers render `<Toast>` when the `toast` object from `useToast` is non-null.
- `components/productos/*`
  - Product-focused components, including:
    - `ProductStats` – aggregated stats for the currently filtered product set.
    - `ProductFilters` – filter controls for search/estado/categoría/caja.
    - `ProductCard` – visual card representation per product.
    - `ProductModal` – create/edit form, including image handling, integrated with `CameraCapture` and the `useProductos` hook.
    - `DeleteConfirmModal` – generic confirmation modal for deleting products.
- `components/cajas/*`
  - Components related to cajas (boxes) that group productos únicos:
    - `BoxCard` – summary card per caja.
    - `BoxModal` – create/update caja form.
    - `BoxDetailModal` – detail view showing caja information and its associated products.
- `components/categorias/*`
  - Category management components such as `CategoryModal` used from `Productos.jsx`.
- Top-level components
  - `Sidebar.jsx` – primary navigation shell shared by authenticated pages.
  - `Login.jsx` / `Register.jsx` – authentication forms; both depend on `authService` and `useToast` plus `Toast`.
  - `CameraCapture.jsx` – image capture component used when creating/editing products.

### Hooks

Custom hooks encapsulate domain-specific API usage and some UX logic:

- `src/hooks/useProductos.js`
  - Central CRUD and stats retrieval for products using axios:
    - `GET {API_URL}/api/productos` to load products.
    - `GET {API_URL}/api/productos/stats/resumen` for summary stats.
    - `POST/PUT/DELETE` for create/update/delete endpoints.
  - Exposes `{ productos, stats, isLoading, fetchProductos, createProducto, updateProducto, deleteProducto }`.
  - File uploads are handled using `multipart/form-data`; `Productos.jsx` prepares a `FormData` instance and passes it into `createProducto` / `updateProducto`.
- `src/hooks/useCajas.js`
  - Axios-based API wrapper for cajas:
    - Listing, creating, updating, deleting, and retrieving caja details (`/api/cajas`, `/api/cajas/:id`).
  - Returns `{ cajas, fetchCajas, createCaja, updateCaja, deleteCaja, getCajaDetail }`.
- `src/hooks/useCategorias.js`
  - Axios wrapper for categories (`/api/categorias`) with list and create helpers.
- `src/hooks/useToast.js`
  - UI state hook that returns the current `toast` object and `showToast`/`hideToast` functions.
  - Consumers (e.g. `Login`, `Register`, `Productos`) are responsible for rendering the `Toast` component with the provided props.
- `src/hooks/usePreventBackNavigation.js`
  - Encapsulates a reusable pattern to intercept hardware/browser back navigation and require a double back-press.
  - Uses `window.history.pushState`, a `popstate` listener, and a DOM toast (`#back-toast`) to notify the user, and then calls `navigate(-1)` on the second press.

### Services & data layer

- `src/services/authService.js`
  - Defines a shared axios instance `api` with:
    - `baseURL` from `VITE_API_URL` or `https://backhogele.onrender.com` as a fallback.
    - Request interceptor that attaches `Authorization: Bearer <token>` from `localStorage` to all outgoing requests when available.
    - Response interceptor that, on HTTP 401 for non-login endpoints, clears auth-related entries in `localStorage` and redirects to `/login`.
  - Public methods:
    - `login(email, contrasena)` – `POST /api/usuarios/login`, storing `token` and `usuario` on success.
    - `registro(nombre, email, contrasena, rol)` – `POST /api/usuarios/registro`, also persisting `token` and `usuario`.
    - `verificarSesion()` – `GET /api/usuarios/verificar`; refreshes stored user data and logs out on failure.
    - `logout()` – clears auth-related entries from `localStorage`.
    - `getCurrentUser()`, `isAuthenticated()`, `getToken()` – local helpers around `localStorage`.
  - This service is used by `App.jsx`, `Login.jsx`, `Register.jsx`, and `Sidebar.jsx`. When modifying auth flows, keep these consumers in sync.
- Additional axios usage:
  - Domain hooks (`useProductos`, `useCajas`, `useCategorias`) define their own `API_URL` constants that prefer `VITE_API_URL` and fall back to `http://localhost:4000`.
  - `Home.jsx` calls `axios.get(`${import.meta.env.VITE_API_URL}/api/home`)` directly rather than through a shared service.

### Styling & design system

- Tailwind CSS:
  - Configured in `tailwind.config.js` and `postcss.config.js`, scanning `index.html` and all `src/**/*.{js,ts,jsx,tsx}` for class usage.
  - Adds custom color palettes (`cyan1`, `ocean1`, `green1`) used extensively in gradients, buttons, and backgrounds.
  - Defines custom keyframes/animations (`slideUp`, `fadeOut`) used by back-button toasts and some loading states.
- Global styles:
  - `src/index.css` wires Tailwind layers and any global CSS required by the app.

### Deployment & hosting

- Vite builds production assets into `dist/` via `npm run build`.
- `vercel.json`:
  - Rewrites all routes (`/(.*)`) to `/index.html` to support client-side routing on deep links.
  - Redirects `/` to `/login` permanently. React Router also redirects `/` to `/home`, so be aware of this dual behavior when altering the initial route or login flow.
- `package.json` specifies `engines.node: ">=18"`; use a compatible Node version in local and CI environments.

## Notes for future Warp agents

- No test suite is configured at this time; do not assume Jest, Vitest, or other runners exist when suggesting test commands. Any testing workflows will require adding appropriate dev dependencies and scripts first.
- Back-button behavior is implemented in multiple layers:
  - Globally in `App.jsx` via `window.history` and `popstate` for the entire app.
  - Locally in `usePreventBackNavigation.js` and in modal-handling logic in `Productos.jsx`.
  - When modifying navigation or adding new modal flows, ensure history listeners and DOM toasts (`#back-toast`) are kept in sync and cleaned up to avoid duplicate handlers or stale UI.
