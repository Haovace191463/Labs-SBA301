# Orchid Router SPA — Verification Test Matrix (T01–T10)

**Student Name:** Võ Anh Hào  
**Student ID:** CE191463  
**Subject:** SBA301 — Slot 10 (React Router & SPA Architecture)  
**Project:** Orchid Router SPA  
**Static Code Check:** Verified (`npm run lint` PASSED with 0 errors, `npm run build` PASSED with 0 errors)  
**Browser Verification Status:** Main user flows manually verified by student on local browser; DevTools network logging and deep-link screenshot verification are pending student evidence capture.

> **Note on Verification Methodology:**
> - The AI agent has verified static syntax, route declarations, and production build compilation. The agent does **not** simulate or claim automated browser visual execution.
> - Functional user flows marked as `Verified by Student (Manual)` reflect manual browser testing already confirmed by the student during development.
> - Tests requiring browser DevTools (Network tab doc filter), history traversal, or incognito direct URLs are marked `Pending verification` until screenshot evidence is placed into `evidence/`.

---

## 1. Standardized Test Matrix Table

| Test ID | Scenario | Steps | Expected Result | Actual Result | Status | Notes |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- |
| **T01** | Home to Orchids Navigation via Navbar | 1. Open browser to `http://localhost:5173/`.<br>2. Observe "Home" link has active styling.<br>3. Click "Orchids" link in top navigation bar.<br>4. Observe URL and rendered view. | URL changes from `/` to `/orchids`. Link "Orchids" receives `.active-nav` styling, while "Home" becomes inactive. `OrchidsPage` renders grid of orchid species. No full document reload occurs. | Verified by student: Navigation operates instantly via client-side routing; active navbar class switches correctly to Orchids. | **Verified by Student (Manual)** | Client-side navigation via `<NavLink>` using `history.pushState()`; document is not reloaded. |
| **T02** | Category Filtering via Query Parameters (`useSearchParams`) | 1. On `/orchids`, click the "Phalaenopsis" category button.<br>2. Observe address bar and orchid cards.<br>3. Click "All" category button. | URL updates to `/orchids?category=Phalaenopsis`. Only 3 Phalaenopsis orchids are displayed. Active filter button is highlighted. Clicking "All" removes query param (`/orchids`) and restores all 10 orchids. | Verified by student: Query string updates dynamically; filtered cards match category; reset to "All" clears query parameter cleanly. | **Verified by Student (Manual)** | URL query string synchronizes with component state without causing any page reload. URL is bookmarkable and shareable. |
| **T03** | Dynamic Route Matching (`/orchids/:id`) | 1. From `/orchids`, click "View Details →" on "Phalaenopsis Amabilis (Moon Orchid)".<br>2. Observe URL, specifications table, and breadcrumbs. | URL changes to `/orchids/phalaenopsis-amabilis`. `OrchidDetailPage` extracts `:id` via `useParams()`. Displays full specs (origin, watering, light, season), care badge, and related species. | Verified by student: Correct orchid detail view renders with all botanical data and breadcrumb navigation. | **Verified by Student (Manual)** | Dynamic route parameter extracted via `useParams()`. In-memory state remains preserved. |
| **T04** | Invalid Orchid ID — Resource Not Found Handling | 1. Type `http://localhost:5173/orchids/999999` directly in address bar and press Enter.<br>2. Observe error screen and action buttons.<br>3. Click "← Return to Orchid List". | Route `/orchids/:id` matches pattern, but `getOrchidById("999999")` returns `null`. Gracefully displays "Resource Not Found: Orchid 999999" alert without crashing. Return button navigates to `/orchids`. | Verified by student: Error alert renders gracefully without JavaScript crash; navigation button returns smoothly to catalog. | **Verified by Student (Manual)** | **Resource Not Found**: Valid route pattern (`/orchids/:id`) with non-existent data ID. Fundamentally different from Wildcard 404. |
| **T05** | Wildcard Route 404 — Unmapped URL Path | 1. Type unmapped path `http://localhost:5173/this-route-does-not-exist` or `/unknown-abc` in address bar and press Enter.<br>2. Observe rendered page and links. | Wildcard route `<Route path="*" element={<NotFoundPage />} />` catches the URL. Displays 404 "Page Not Found" screen showing the exact attempted path via `useLocation().pathname`. Provides links to Home and Orchids. | Verified by student: 404 Page Not Found view displays correct unmapped path and return links; app remains stable. | **Verified by Student (Manual)** | **Wildcard 404**: URL path does not match any declared route pattern in the routing tree. Handled by `path="*"`. |
| **T06** | Nested Dashboard Routing with `<Outlet />` | 1. Click "Dashboard" in Navbar (`/dashboard`).<br>2. Click "Favorites" in Dashboard sidebar (`/dashboard/favorites`).<br>3. Click "Student Profile" (`/dashboard/profile`). | URL transitions through `/dashboard` → `/dashboard/favorites` → `/dashboard/profile`. `DashboardLayout` chrome (title, breadcrumbs, sidebar) persists without unmounting; only child content inside `<Outlet />` changes. | Verified by student: Sidebar and header stay fixed while child views render seamlessly inside `<Outlet />`. | **Verified by Student (Manual)** | Demonstrates nested route architecture where parent layout remains mounted while child views swap inside `<Outlet />`. |
| **T07** | Browser History Traversal (Back / Forward) | 1. Start at `/`, click "Orchids" (`/orchids`), then click Amabilis detail (`/orchids/phalaenopsis-amabilis`).<br>2. Click browser Back button twice.<br>3. Click browser Forward button twice. | Back button navigates from Amabilis → Orchids → Home. Forward returns to Orchids → Amabilis. Views update synchronously via `popstate` without reloading the document. | Student confirmed basic Back/Forward works; formal history trace log and screenshot pending verification. | **Pending verification** | Requires student to complete detailed step log in `docs/trace-worksheet.md` and capture `evidence/E16_history_back_forward.png`. |
| **T08** | Direct Deep Link in Fresh Browser Session | 1. Copy URL `http://localhost:5173/dashboard/favorites`.<br>2. Open a new private/incognito browser window.<br>3. Paste the URL into the address bar and press Enter. | Vite dev server serves `index.html` fallback. React Router boots, reads pathname, and renders `DashboardLayout` with `FavoritesPage` directly without server 404. | Needs incognito browser execution and screenshot verification. | **Pending verification** | Validates SPA server fallback rewrite. Must capture screenshot for `evidence/E17_deep_link_new_tab.png`. |
| **T09** | Internal Navigation Document Reload Inspection | 1. Open browser DevTools (<kbd>F12</kbd>) and select **Network** tab.<br>2. Enable the **Doc** (Document) filter and check **Preserve log**.<br>3. Click between Home, Orchids, About, and Dashboard using Navbar links. | Zero new HTTP document requests (`Type: document`) appear in the Network log. Only client-side Virtual DOM renders occur. | Requires DevTools Network inspection to be recorded and screenshot captured. | **Pending verification** | Proves that React Router internal navigation avoids full document reloads. Must capture `evidence/E18_network_doc_zero_reloads.png`. |
| **T10** | Comparison: Standard HTML Anchor (`<a>`) vs React Router `<Link>` | 1. In `src/components/AppNavbar.jsx`, temporarily replace a `<NavLink>` with `<a href="/about">`.<br>2. With DevTools Network tab open (Doc filter active), click the anchor tag.<br>3. Observe full document reload.<br>4. Revert code back to `<NavLink>`. | Clicking the traditional `<a>` tag triggers an HTTP GET document request (`Type: document`), reloading the entire HTML page and resetting JS state. Reverting to `<NavLink>` eliminates the document request. | Requires student to perform Break-It Bug 03 experiment and capture DevTools comparison screenshot. | **Pending verification** | Clearly distinguishes SPA client navigation from MPA full-page reload. Must capture `evidence/E19_break_it_anchor_reload.png`. |

---

## 2. Key Architectural Distinctions for Students

1. **SPA Internal Navigation vs Traditional Anchor (`<a>`) Navigation:**
   - React Router `<Link>` and `<NavLink>` intercept click events (`event.preventDefault()`) and call `window.history.pushState()`. The browser updates the URL in the address bar and React re-renders only the changed components. **No document reload occurs.**
   - Standard HTML `<a href="/path">` tells the browser to make a full HTTP GET request to the server, discarding all in-memory JavaScript state, re-downloading HTML, and restarting React from scratch.

2. **Resource Lookup Failure (`/orchids/999999`) vs Wildcard 404 (`*`):**
   - `/orchids/999999` **matches** a valid route pattern: `<Route path="orchids/:id" element={<OrchidDetailPage />} />`. The router successfully routes to `OrchidDetailPage`. The failure happens inside the component because `getOrchidById("999999")` returns `null`. This is a business logic / resource not found condition.
   - `/unknown-abc` **does not match** any declared route in the route table. It is caught by the fallback route: `<Route path="*" element={<NotFoundPage />} />`. This is an unmapped routing path failure.

---

## 3. Student Action Items to Finalize Matrix

To transition all `Pending verification` statuses to `Verified`:
1. Start the app: `npm run dev`.
2. Open DevTools (<kbd>F12</kbd>) -> Network -> Doc filter -> Preserve log.
3. Perform test cases T07, T08, T09, and T10.
4. Save the corresponding screenshots into the `evidence/` directory with names matching the evidence checklist.
5. Update status column to `PASS` after capturing evidence.
