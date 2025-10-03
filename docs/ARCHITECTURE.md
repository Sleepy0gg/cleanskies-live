CleanSkies Live — Project Structure

Overview
- App shell: src/App.jsx, src/main.jsx
- Routing: react-router-dom; pages in src/pages
- UI primitives: src/components
  - components/layout: Navbar, Footer, Sidebar
  - components/home: Home-only widgets (WeatherHeader, WindHumidity)
  - components/common: Reusable UI (SearchBox)
- Domain libs: src/lib
  - auth.jsx: simple auth context (localStorage)
  - themeProvider.jsx: theme context and application on :root
  - uiProvider.jsx: sidebar open/close state
  - storage.js: safe JSON localStorage helpers
  - api.js: mock API calls (replace with real APIs)
- Styling: Tailwind + src/index.css for component utility recipes
- Assets: src/assets (icons/, logo.svg)

Guidelines
- Keep page-specific widgets under components/<area>
- Keep cross-cutting UI in components/common
- Keep state/contexts under lib with clear names and minimal responsibilities
- Add a short file header to any new file explaining its purpose

Suggested Future Features Foldering
- src/features/air: AQI cards, charts, map
- src/features/routes: Planner map, avoidance logic
- src/features/profile: Profile forms and personalization

Testing/Replacement Notes
- Replace lib/api.js with real HTTP in one place; pages import only from lib/api
- Themes: add new entries in ThemeProvider.THEMES and :root.theme-* in index.css


