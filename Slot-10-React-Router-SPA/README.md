# Orchid Router SPA — SBA301 Slot 10 Laboratory

**Course:** SBA301 – Integrate Single Page Application with Spring Boot  
**Topic:** Chapter 09 – React Router and Single Page Application (SPA)  
**Student Name:** Võ Anh Hào  
**Student ID:** CE191463  
**Application Display Name:** Orchid Router SPA  
**Workspace:** `C:\SBA301\labs\slot10`  

---

## 1. Project Overview

**Orchid Router SPA** is a modern Single Page Application (SPA) built with React 19, Vite 8, and React Router DOM v7. The application showcases an interactive botanical orchid catalog while serving as a comprehensive hands-on laboratory for mastering client-side routing, URL state synchronization, dynamic path parameters, nested layouts with `<Outlet />`, and browser history manipulation.

---

## 2. Learning Objectives

By working with this project, students learn to:
1. Understand the architectural differences between Single Page Applications (SPA) and Multi-Page Applications (MPA).
2. Configure basic, nested, redirect, and wildcard 404 routes declaratively.
3. Differentiate between `<Link>` (standard semantic client navigation) and `<NavLink>` (active state styling).
4. Utilize dynamic route path parameters (`/orchids/:id`) with the `useParams()` hook.
5. Synchronize UI filters with URL query strings (`?category=...`) using `useSearchParams()`.
6. Implement imperative/programmatic navigation using `useNavigate()` with standard push vs `replace: true`.
7. Inspect the browser location object (`pathname`, `search`, `hash`, `state`) using `useLocation()`.
8. Construct hierarchical nested layouts utilizing `<Outlet />` without re-rendering parent chrome.
9. Distinguish between a resource lookup failure (Resource Not Found on a valid route) and an unmapped URL (Wildcard 404 Page Not Found).
10. Understand deep linking, browser history stack behavior, and production server rewrite requirements.

---

## 3. Technologies and Installed Packages

This project strictly utilizes the current dependencies present in `package.json`:
- **React**: `^19.2.8` (Core UI library)
- **React DOM**: `^19.2.8` (DOM renderer for React)
- **React Router DOM**: `^7.18.4` (Declarative client-side routing)
- **React-Bootstrap**: `^2.10.10` (Bootstrap UI components for React)
- **Bootstrap**: `^5.3.8` (CSS framework and utilities)
- **Vite**: `^8.3.0` (Development server and production bundler)
- **ESLint**: `^10.10.0` (Static code analysis)

---

## 4. System Requirements

- **Node.js**: v18.0.0 or higher (v20+ LTS recommended)
- **npm**: v9.0.0 or higher
- **Web Browser**: Modern Chromium (Chrome, Edge) or Firefox with Developer Tools enabled

---

## 5. Installation

Clone or open the workspace folder and install dependencies:

```powershell
# Navigate to project directory
cd C:\SBA301\labs\slot10

# Install dependencies defined in package.json
npm install
```

---

## 6. Run Development Server

To launch the local Vite development server with Hot Module Replacement (HMR):

```powershell
npm run dev
```

Once started, open your browser to the URL displayed in the terminal:
`http://localhost:5173/`

---

## 7. Build and Lint Commands

Verify static code quality and bundle compilation:

```powershell
# Run ESLint validation (Verified: 0 errors)
npm run lint

# Compile production bundle into dist/ (Verified: 0 errors)
npm run build

# Preview production build locally
npm run preview
```

---

## 8. Route Map & Architectural Components

Below is the complete table of routes declared in `src/routes/AppRoutes.jsx`:

| URL Path | Component | Layout | Parameters / Query | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `HomePage` | `MainLayout` | None | Landing hero banner, featured orchids, and routing overview |
| `/orchids` | `OrchidsPage` | `MainLayout` | `?category=...` | Orchid collection with interactive category filter |
| `/orchids/:id` | `OrchidDetailPage` | `MainLayout` | `:id` (path param) | Dynamic detailed specifications or resource-not-found view |
| `/about` | `AboutPage` | `MainLayout` | `?submitted=true` | Architectural overview and contact redirect feedback |
| `/contact` | `ContactPage` | `MainLayout` | None | Simulated inquiry form with `useNavigate` push/replace demo |
| `/exercises` | `ExercisesPage` | `MainLayout` | None | Interactive workbook containing exercises 01 to 10 |
| `/location-demo` | `LocationDemoPage` | `MainLayout` | `?species=...#hash` | Live inspector of `useLocation()` hook properties |
| `/dashboard` | `DashboardHomePage`| `DashboardLayout`| None (index) | Aggregated statistics (species, categories, favorites count) |
| `/dashboard/favorites` | `FavoritesPage` | `DashboardLayout`| None | Bookmarked favorites stored in localStorage |
| `/dashboard/profile` | `ProfilePage` | `DashboardLayout`| None | Student demonstration profile (Võ Anh Hào - CE191463) |
| `/home` | `Navigate` | `MainLayout` | None | Legacy redirect to `/` via `<Navigate to="/" replace />` |
| `*` | `NotFoundPage` | `MainLayout` | Wildcard | 404 handler for any unmapped paths |

### Key Architectural Elements & Hooks Explained:
- **`MainLayout` (App Shell):** Renders the global navigation bar (`AppNavbar`), container, and footer. It wraps all application views so chrome persists during navigation.
- **`DashboardLayout` (Nested Layout):** Manages the dashboard 2-column view with a persistent left sidebar menu and an `<Outlet />` on the right.
- **`<Outlet />`:** The designated mounting slot in a parent layout where matching child route components are dynamically injected into the Virtual DOM.
- **`<Navigate to="/" replace />`:** Declaratively redirects legacy routes (e.g., `/home` → `/`) while overwriting the current history entry so the browser Back button does not trigger a redirect loop.
- **`useParams()`:** Extracts path parameters from the URL (such as `:id` in `/orchids/:id`) as a key-value object.
- **`useSearchParams()`:** Synchronizes query string parameters (such as `?category=Vanda`) with React state, enabling shareable and bookmarkable URLs.
- **`useNavigate()`:** Provides an imperative navigation function to transition between routes programmatically (e.g., upon form submission or event completion).
- **`useLocation()`:** Inspects the current URL location object (`pathname`, `search`, `hash`, `state`, `key`).

For the Mermaid architecture diagram, see [docs/route-map.md](file:///c:/SBA301/labs/slot10/docs/route-map.md).

---

## 9. Critical Distinction: Resource Not Found vs Wildcard 404

Understanding the boundary between routing and business data is essential:

1. **Resource Not Found (`/orchids/999999`):**  
   The route pattern `/orchids/:id` **successfully matches** because `"999999"` is a valid string parameter. React Router mounts `OrchidDetailPage`. Inside the component, `getOrchidById("999999")` returns `null`. The component gracefully displays a "Resource Not Found: Orchid 999999" alert with a return link. This is a **data lookup failure**, not a routing failure.

2. **Wildcard Route 404 (`*`):**  
   An unmapped URL like `/unknown-page-xyz` **does not match any route** in the routing tree. React Router falls through to `<Route path="*" element={<NotFoundPage />} />`. This is an **unmapped routing path failure**.

---

## 10. The 10 Laboratory Exercises (`/exercises`)

The application integrates an interactive laboratory hub accessible at `/exercises`:
1. **Exercise 01 (SPA vs MPA Trace)**: Compares client routing against document requests; includes DevTools Network instructions.
2. **Exercise 02 (Basic Routes)**: Interactive verification of route definitions in `BrowserRouter` and `Routes`.
3. **Exercise 03 (NavLink Active State)**: Explains `isActive` callback and the mandatory `end` prop for root `/`.
4. **Exercise 04 (Dynamic Routes)**: Hands-on testing of valid vs invalid `:id` path parameters.
5. **Exercise 05 (Query Parameters)**: Explores bookmarkable URLs and query string synchronization.
6. **Exercise 06 (useNavigate & Redirects)**: Demonstrates push vs replace history operations.
7. **Exercise 07 (Location & useLocation)**: Live inspection of pathname, search, hash, and in-memory state.
8. **Exercise 08 (Nested Routes & Outlet)**: Analyzes master-detail layouts and Outlet mounting mechanics.
9. **Exercise 09 (Browser History Stack)**: Step-by-step tracing of browser Back/Forward pointer movements.
10. **Exercise 10 (Deep Linking & Direct URLs)**: Explains Vite development fallback and production server rewrite needs.

---

## 11. Test Matrix & Verification Status

The formal test suite is defined in [docs/test-matrix.md](file:///c:/SBA301/labs/slot10/docs/test-matrix.md):
- **Static Verification:** `npm run lint` and `npm run build` both PASSED cleanly with 0 errors.
- **Manual Functional Checks:** Core functional routes (Home, Orchids, Filter, Detail, Resource Not Found, About, Contact, Dashboard, Redirect, 404) have been confirmed operational on the browser by student Võ Anh Hào.
- **Pending Evidence Verification:** Formal verification tests requiring DevTools Network logging (`T09`, `T10`), history trace worksheet completion (`T07`), and incognito deep link screenshot capture (`T08`) are marked `Pending verification` until screenshots are saved to the `evidence/` folder.

---

## 12. Evidence Checklist

Refer to [docs/evidence-checklist.md](file:///c:/SBA301/labs/slot10/docs/evidence-checklist.md) for the complete list of 19 evidence items across Setup, Routing, Browser Verification, and Learning Documentation. All items are initially initialized to `Not captured` pending student browser screenshot collection.

---

## 13. Project Structure

```text
slot10/
├── docs/
│   ├── break-it-log.md        # 4 intentional routing diagnostic guides and fixes
│   ├── evidence-checklist.md   # 19-item screenshot checklist for student evaluation
│   ├── reflection.md          # 8 architectural reflection prompt questions
│   ├── route-map.md           # Route table, Mermaid diagram, and concept explanations
│   ├── test-matrix.md         # T01–T10 manual and static testing matrix
│   └── trace-worksheet.md     # 10 representative navigation trace steps and questions
├── evidence/                  # Storage folder for student browser test screenshots
├── public/                    # Static public assets
├── src/
│   ├── assets/                # App images and logos
│   ├── components/            # Reusable UI components (AppNavbar, Breadcrumbs, CategoryFilter, OrchidCard)
│   ├── context/
│   │   └── FavoritesContext.jsx # LocalStorage-backed reactive favorites state
│   ├── data/
│   │   └── orchids.js         # Curated 10 orchid species across 4 categories (Static mock data)
│   ├── exercises/             # 10 hands-on exercise modules
│   ├── layouts/
│   │   ├── DashboardLayout.jsx # Nested dashboard chrome with sidebar & Outlet
│   │   └── MainLayout.jsx      # Top navbar, main container with Outlet, footer
│   ├── pages/
│   │   ├── AboutPage.jsx       # About SPA documentation and redirect notice
│   │   ├── ContactPage.jsx     # Contact form with useNavigate push/replace
│   │   ├── ExercisesPage.jsx   # Interactive portal for the 10 lab exercises
│   │   ├── HomePage.jsx        # Landing hero and featured orchid collection
│   │   ├── LocationDemoPage.jsx# Live interactive useLocation inspector
│   │   ├── NotFoundPage.jsx    # Wildcard 404 Page Not Found view
│   │   ├── OrchidDetailPage.jsx# Dynamic :id view & resource not found handler
│   │   ├── OrchidsPage.jsx     # Full catalog with search params filtering
│   │   └── dashboard/
│   │       ├── DashboardHomePage.jsx # Aggregated system metrics
│   │       ├── FavoritesPage.jsx     # Saved favorites listing and empty state
│   │       └── ProfilePage.jsx       # Student demo credentials (Võ Anh Hào)
│   ├── routes/
│   │   └── AppRoutes.jsx      # Declarative Route definitions
│   ├── styles/
│   │   └── app.css            # Custom botanical design system and theme styles
│   ├── App.jsx                # Router and Provider root (single BrowserRouter)
│   └── main.jsx               # React entry point with Bootstrap imports
├── eslint.config.js           # ESLint flat configuration
├── index.html                 # Main HTML template
├── package.json               # Dependencies and npm scripts
├── vite.config.js             # Vite build configuration
└── README.md                  # Master documentation
```

---

## 14. Deep-Link and Production Deployment Note

In local development, the **Vite development server** automatically routes all unmatched HTTP requests to `/index.html`, allowing React Router to inspect the path in the browser address bar.

When deploying a production bundle (`dist/`) to a real-world web server (such as Nginx, Apache, Tomcat, or AWS S3/CloudFront), the server must be configured with an **SPA fallback / URL rewrite rule**. Without this rule, directly loading or refreshing `/orchids/phalaenopsis-amabilis` will cause the server to return a native HTTP 404 error because no physical file exists at that path on disk.

Example Nginx configuration:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## 15. Limitations and Assumptions

1. **Standalone Frontend Scope:** This application is strictly a frontend client-side SPA. No Spring Boot backend, REST API, or SQL database is connected in Slot 10.
2. **Static Mock Dataset:** All orchid records are loaded from static mock data in `src/data/orchids.js`. No backend database is required.
3. **Independent Project:** This project does not contain or integrate source code from Lab 02; it is fully self-contained.
4. **Simulated Contact Submission:** The Contact form validates user inputs and demonstrates `useNavigate` redirects without transmitting actual emails or server requests.
5. **Mock Student Identity:** The Profile page in the Dashboard displays mock credentials for student Võ Anh Hào (CE191463) to demonstrate nested routing without requiring authentication tokens or security sessions.

---

## 16. Student Next Steps Before Submission

To finalize and submit your lab assignment:
1. Run `npm run dev` to start your local dev server.
2. Perform test cases T07–T10 in [docs/test-matrix.md](file:///c:/SBA301/labs/slot10/docs/test-matrix.md) and record DevTools observations.
3. Complete the observation columns in [docs/trace-worksheet.md](file:///c:/SBA301/labs/slot10/docs/trace-worksheet.md).
4. Run at least one Break-It exercise from [docs/break-it-log.md](file:///c:/SBA301/labs/slot10/docs/break-it-log.md) (e.g. Bug 01 missing Outlet or Bug 03 anchor tag reload) and record your notes.
5. Answer the 8 reflection questions in [docs/reflection.md](file:///c:/SBA301/labs/slot10/docs/reflection.md) based on your understanding.
6. Capture the required screenshots and save them into the `evidence/` folder as listed in [docs/evidence-checklist.md](file:///c:/SBA301/labs/slot10/docs/evidence-checklist.md).
7. Run `npm run lint` and `npm run build` one final time to ensure code cleanliness before submission.
