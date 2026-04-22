# Двойник — Platform UI Kit

Interactive recreation of the Двойник operator console: the main view an engineer sees when they open a digital-twin project.

## Components

- `Shell.jsx` — top bar + sidebar layout
- `Sidebar.jsx` — primary nav with sections + active state
- `Topbar.jsx` — search, user, notifications
- `AssetRegistry.jsx` — dense telemetry table
- `ViewerCanvas.jsx` — 3D/BIM viewer placeholder with overlay controls
- `InspectorPanel.jsx` — right-side properties panel
- `KpiStrip.jsx` — top KPI cards above the viewer
- `Primitives.jsx` — Button, Badge, Input, StatusDot, IconBtn

## Run

Open `index.html`. Uses React 18 + Babel standalone + Lucide icons.

> Visual-only recreation — no real data backend. Interactions (tab switches, row selection, mock sync) are wired up for clickthrough fidelity.
