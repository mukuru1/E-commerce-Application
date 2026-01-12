# E-Commerce Application — README

**Deployment Link: https://solvite-e-commerce-application.netlify.app: /**
**Project Overview**
- **Purpose:** A small React + Vite e-commerce front-end demonstrating product fetching, per-user cart/wishlist persistence, and a simple local + backend authentication flow.
- **Stack:** React, React Router, Context API (`useContext`), Axios, Tailwind CSS, `react-hot-toast`.

**How This App Was Approached**
- **Single responsibility contexts:** Authentication and product state are separated into `AuthContext` and `ProductContext` so UI components can subscribe only to what they need.
- **Progressive enhancement for auth:** The app supports local (in-browser) accounts and a backend login fallback. This makes it testable without a server while still supporting server auth.
- **Per-user persistence:** Cart and wishlist are persisted in `localStorage` and keyed per-user so different accounts keep separate carts.

**Fetch and display of all product categories**
- **File:** [src/context/ProductContext.jsx](src/context/ProductContext.jsx)
- **What it does:** `fetchCategories()` calls the products categories API via the shared Axios instance and stores the result in `categories` state. The UI reads `categories` from `ProductContext`.
- **Why here:** Centralizing product fetching in `ProductContext` keeps API logic out of UI components and allows any component to access products/categories via `useProduct()`.

**Authentication (login, register, auto-login)**
- **Files:** [src/context/AuthContext.jsx](src/context/AuthContext.jsx), [src/pages/Login.jsx](src/pages/Login.jsx), [src/components/Navbar.jsx](src/components/Navbar.jsx)
- **Implementation details:**
  - `AuthContext.jsx` exposes `login(username, password)`, `register(username, password)`, `logout()` and `isAuthenticated` via `useAuth()`.
  - Local registrations are stored in `localStorage` under the `users` key. `register()` saves the new user and issues a local token (`local-<timestamp>`), stores a minimal `user` object and navigates to `/dashboard`.
  - `login()` first checks `localStorage.users` for a matching username/password. If found, it logs-in locally (sets token and `user`), otherwise it falls back to the backend API `POST /auth/login` using the Axios instance.
  - `Login.jsx` provides a combined login/register form and delegates to `register()` to auto-login newly created users.
  - `Navbar.jsx` shows login/logout links and exposes the username when authenticated.

**Authorization Rules (enforcing access control)**
- **Files:** [src/routes/ProtectedRoute.jsx](src/routes/ProtectedRoute.jsx), [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx), [src/components/Navbar.jsx](src/components/Navbar.jsx)
- **Rules implemented:**
  - `ProtectedRoute` checks `useAuth()` for `isAuthenticated` and redirects unauthenticated visitors to `/login` using `<Navigate />` from React Router. This protects routes wrapped with `ProtectedRoute` (for example, `/dashboard` in `src/App.jsx`).
  - The `Dashboard` page additionally gates UI actions (create/update/delete) using `isAuthenticated` from `useAuth()` so even if the route were accessible, mutation buttons are disabled or hidden for unauthenticated users.
  - The `Navbar` Dashboard link routes to `/dashboard` when authenticated, otherwise to `/login` so attempting to reach the dashboard prompts login.

**Correct use of Axios and API endpoints**
- **File:** [src/api/axios.js](src/api/axios.js)
- **Shared instance:** The project creates a single Axios instance with `baseURL` set to `https://dummyjson.com` and exports it for all API calls.
- **Interceptors:** A request interceptor automatically reads `localStorage.token` and, if present, sets `Authorization: Bearer <token>` on each outgoing request. This centralizes token handling so individual API calls don't need to manage headers.
  - Why interceptors are used: They keep authentication concerns out of UI and logic layers and ensure every request made with this instance includes the token when available. It also simplifies testing and local-login (where we set a local token value).
- **Files that use `axios.js`:**
  - [src/context/ProductContext.jsx](src/context/ProductContext.jsx) — `fetchProducts()` and `fetchCategories()` use the shared axios instance.
  - [src/context/AuthContext.jsx](src/context/AuthContext.jsx) — `login()` falls back to `axios.post('/auth/login', ...)` when no local match is found.

**Proper implementation of useContext**
- **Files:** [src/context/AuthContext.jsx](src/context/AuthContext.jsx), [src/context/ProductContext.jsx](src/context/ProductContext.jsx), component usage in [src/components/Navbar.jsx](src/components/Navbar.jsx), [src/pages/Login.jsx](src/pages/Login.jsx), and [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx).
- **Pattern used:** Each context file defines a context via `createContext()`, an exported provider component (`AuthProvider`, `ProductProvider`) and a convenience hook (`useAuth()`, `useProduct()`) that wraps `useContext()`.
  - Providers are composed in `src/App.jsx` so the entire app tree can access both contexts.
  - UI components call the hooks to read state and actions (for example, `const { login, logout, isAuthenticated } = useAuth()` and `const { cart, addToCart } = useProduct()`).

**Per-user cart & wishlist persistence**
- **File:** [src/context/ProductContext.jsx](src/context/ProductContext.jsx)
  - Cart and wishlist are persisted in `localStorage` under keys scoped to the username (e.g., `cart:alice`, `wishlist:alice`).
  - When a user logs in, a `user-login` custom event is dispatched carrying the user object; `ProductContext` listens and loads the corresponding user-scoped storage. On logout the app loads the guest keys instead.
  - This approach keeps each user's cart/wishlist isolated and supports a guest cart (`cart:guest`) before login.


**Why this structure helps (design rationale)**
- **Separation of concerns:** API & token wiring lives in `src/api/axios.js`, auth state in `AuthContext`, product state in `ProductContext`, and UI components only call hooks. This keeps components simple and testable.
- **Resilience and offline friendliness:** Local registration + per-user localStorage provides a usable experience without a running backend while still supporting backend authentication.
- **Single source of truth:** Using the Context API centralizes state and actions allowing easy access and fewer prop drills.


**Testing the auth & per-user cart flow**
- Register a new user on the Login page. The app will auto-login the new user and navigate to `/dashboard`.
- Add items to cart/wishlist while logged in; they will be saved under `cart:<username>` and `wishlist:<username>` in `localStorage`.
- Log out — the in-memory cart will switch to the guest cart; log back in as the same user to restore that user's cart.

**Security considerations & caveats**
- Storing passwords in plain text in `localStorage` (as done for the local-only accounts) is insecure. This implementation is intentionally simple for demo/local use only. For production:
  - Never store plain passwords client-side.
  - Use secure server-side user management with properly hashed passwords, HTTPS, secure cookies or well-implemented token storage, and short-lived tokens with refresh support.
- The `local-<timestamp>` token is a convenience for local-only auth and should not be used in production.
- Consider encrypting or server-side persisting per-user carts if privacy/consistency is required.

