# Sovereign Architect HUD

A personal operating system disguised as a game. Browser-based dashboard for tracking personal sovereignty (energy), managing activity through an 8-phase Identity Loop, and monitoring psychological shadow patterns. Dark fantasy RPG aesthetic (Diablo-inspired). Built with React 19 + Vite 7 + Tailwind CSS.

**Live site:** https://thtopher.github.io/sovereign-architect-hud/

## Core Systems

### Sovereignty Tracking
- Real-time sovereignty meter (0–100%) displayed in a sticky header bar
- Manual adjustment via slider with debounced logging
- Automatic tracking of gains and losses from skill use
- Status levels based on current sovereignty: **PEAK** (80+), **EFFECTIVE** (60–80), **WARNING** (40–60), **CRITICAL** (20–40), **COLLAPSE** (<20)

### Identity Loop (8 Phases)

| Phase | Cost | Purpose |
|-------|------|---------|
| Intake | Low | Strategic learning, absorbing information |
| Reconnaissance | Low | Watching, noticing patterns, gathering intel |
| Analysis | Medium | Making sense of it, strategic thinking |
| Design | Medium | Solo creation work, building, writing |
| Execution | High | Shipping, decisions, external output |
| Holding | Highest | Being present for others, meetings, leadership |
| Release | Restoration | Letting go, surrendering outcomes |
| Recovery | Restoration | Rest, solitude, integration |

Each phase has detailed cards with signals, transition guidance, and notes. The HUD tracks your current phase and calculates days since last Release to derive loop health status (Healthy → Strained → Depleted → Critical).

### Active Skills

Five skills with Low/Medium/High intensity levels, each with sovereignty cost, cooldown timer, and logged effects:

| Skill | Effect | Cost | Cooldown |
|-------|--------|------|----------|
| **Sovereign Yield** | Restore sovereignty (+15/25/40%) | 0 | 2 min |
| **Walling** | Set boundaries, clear burden (+3/6/10%) | 5 | 20 sec |
| **Gordian Cut** | Cut to the real problem (+5/10/15%) | 5 | 30 sec |
| **Decisive Intervention** | Force movement when stalled (−10/20/30% sov, +impact) | 10 | 60 sec |
| **Galvanic Surge** | Rally others (−20/35/50% sov, high impact) | 15 | 120 sec |

### Shadow Mechanics

Four failure modes with intensity tracking (None → Low → Medium → High) and specific antidotes:

- **Over-Control State** — The Protector gripping tight
- **Isolation Spiral** — Withdrawal from connection
- **Intensity Addiction** — Seeking chaos over calm
- **False Responsibility** — Carrying what isn't yours

Each shadow has trigger conditions, an intensity guide, and a named antidote. Changes are logged to the activity history.

### Daily Check-In Prompts

Time-aware rotating questions across four periods of the day:

- **Morning** — Sovereignty assessment, threat anticipation, intention setting, shadow check
- **Afternoon** — Resource shift tracking, boundary check, pattern detection, recalibration
- **Evening** — Completion acknowledgment, incompletion assessment, release planning, surrender readiness
- **Night** — Release assessment, tomorrow forecast, pattern recognition, final release

Questions rotate daily using a deterministic index based on day-of-year and category. Responses are logged and used to generate a dynamic protocol summary.

### Portfolio Management

Drag-and-drop project portfolio with tiered organization and auto-ranking:

- **Spotlight** — Top 8 active projects displayed as draggable cards with priority badges and freshness indicators
- **Roster** — Remaining active projects in compact rows, promotable to Spotlight
- **Archive** — Completed or paused projects grouped by month (latest 50 retained)

Projects support: name, status (active/pencils down/on hold/archived), category, priority (low/medium/high/urgent), pinning, target dates, tags, tasks (with completion tracking), notes, and links.

**Auto-ranking** scores projects by freshness (last activity within 7/14+ days), pinned status, deadline proximity, and overdue penalty. Manual drag reordering overrides auto-rank within Spotlight. Export to Markdown generates a structured summary of all tiers.

### Activity Log

- Every action logged with timestamp, type, intensity, and optional notes
- Narrative generation from action-specific templates (e.g., "Activated Gordian Cut (HIGH) — cut through complexity")
- Arc-based pattern analysis detecting recovery, crisis, decline, and stability arcs
- Pattern detection in notes: sleep avoidance, over-activation, self-criticism, urgency, distress, sovereignty crashes, accomplishment, loop completion
- Inline editing, deletion, and manual note entry
- Full log export as a narrative text file

### Cloud Sync

Multi-device sync via private GitHub Gist:

- Connect with a GitHub personal access token (Gist scope)
- Automatically creates a private Gist or join an existing one by Gist ID
- Syncs three data stores: activity log, portfolio, and game state
- Local-first writes with debounced push (5-second debounce)
- Automatic hydration from remote on new device connection
- Force push option to overwrite remote state
- Status indicator in the header (synced/syncing/dirty/error/offline)

### Contextual Onboarding

First-time users see inline contextual nudges (not modals) that guide through each system:
1. Set starting sovereignty level
2. Select current Identity Loop phase
3. Check for active shadow mechanics

Nudges auto-dismiss as the user interacts with each section. Once all three are complete, setup is marked done.

## Architecture

### App Structure

`App.jsx` provides a tab router between two top-level views: **HUD** (main dashboard) and **Portfolio**. `HUD.jsx` is the root orchestrator — it combines all hooks, manages modals, and wires callbacks between components.

### Components (23 files)

| Component | Purpose |
|-----------|---------|
| `HUD.jsx` | Root orchestrator — all state, logging, modals, time context |
| `StickyResourceBar.jsx` | Fixed header with sovereignty slider and sync indicator |
| `ResourceMeter.jsx` | Standalone sovereignty gauge |
| `LoopStatus.jsx` | Current phase display with phase selector modal and days-since-release |
| `HorizontalSkills.jsx` | Mobile-friendly horizontal skill bar with intensity selection and cooldowns |
| `ActiveSkills.jsx` | Vertical skill layout (desktop alternate) |
| `ShadowMonitor.jsx` | Shadow intensity selectors with real-time detection |
| `DailyPrompts.jsx` | Time-aware rotating check-in with protocol generation |
| `ActivityLog.jsx` | Compact log panel with stats, export, edit, delete |
| `NotePrompt.jsx` | Post-action modal for optional notes with undo |
| `TimeContext.jsx` | Time-of-day contextual guidance |
| `PortfolioPage.jsx` | Portfolio view with spotlight/roster/archive sections and drag-and-drop |
| `ProjectCard.jsx` | Draggable spotlight card with priority cycling and freshness tier |
| `RosterRow.jsx` | Compact project row for roster view |
| `ProjectDetail.jsx` | Expanded project view with tasks, notes, links, archival |
| `CreateProjectModal.jsx` | New project creation modal |
| `InlineName.jsx` | Click-to-edit project name |
| `FirstTimeNudges.jsx` | Contextual onboarding nudges |
| `OnboardingFlow.jsx` | Original modal-based onboarding (superseded by nudges) |
| `SyncSettings.jsx` | Cloud sync configuration modal |
| `SyncIndicator.jsx` | Header sync status icon |
| `CompactStats.jsx` | Compact stats display |
| `StatsPanel.jsx` | Stats aggregation |

### Hooks

| Hook | Purpose |
|------|---------|
| `useGameState` | Persists sovereignty level, loop phase, and shadow intensities to localStorage |
| `useActivityLog` | Activity entries with narrative generation, pattern detection, and arc analysis |
| `usePortfolio` | Project CRUD, auto-ranking, drag reorder, spotlight/roster/archive partitioning |
| `useSync` | Cloud sync status, connect/disconnect, force push, remote data hydration |

### Storage Layer

| Module | Purpose |
|--------|---------|
| `storageAdapter.js` | Thin localStorage wrapper with JSON serialization and observer pattern |
| `syncEngine.js` | Local-first writes with debounced push to GitHub Gist (5s debounce) |
| `gistSync.js` | GitHub Gist API client — create, fetch, update private Gists with error handling |

All state lives in localStorage under these keys:
- `sovereign-architect-activity-log` — Activity entries
- `sovereign-architect-portfolio` — Projects
- `sovereign-architect-game-state` — Sovereignty, phase, shadows
- `sovereign-architect-sync-settings` — Cloud sync credentials
- `sovereign-hud-setup-complete` — First-time flag

No backend. No database. Client-only with optional Gist sync.

### Data Files

| File | Contents |
|------|----------|
| `gameData.js` | 8 Identity Loop phase definitions, 5 skill definitions with costs/cooldowns/effects, 4 shadow mechanic definitions with antidotes |
| `checkinQuestions.js` | ~80 rotating questions across 16 categories (4 time periods × 4 question types) with deterministic daily rotation |

## Design System

Dark fantasy RPG theme with custom Tailwind configuration:

- **Colors:** `game-dark`, `game-darker`, `game-panel`, `game-border`, `game-gold`, `game-red`, `game-green`, `game-blue`, `game-purple`
- **Text:** High contrast (`game-text`), muted, dim, and subtle variants
- **Fonts:** Cinzel (serif headings), Courier New (monospace body)
- **Components:** `.game-panel` (gradient + gold border), `.game-button` (gold gradient), `.fantasy-divider`, `.fantasy-header`, `.fantasy-stat-bar`, `.corner-accent`
- **Animations:** `pulse-slow` (3s), `glow` (2s gold shadow), `fade-in` (0.3s)
- **Responsive:** Mobile-first with grid layouts adapting from 3-col → 2-col → 1-col

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173/sovereign-architect-hud/

## Commands

```bash
npm run dev       # Dev server at localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
npm run deploy    # Build + deploy to GitHub Pages via gh-pages
```

## Deployment

Deployed to GitHub Pages via GitHub Actions. Push to `main` triggers auto-deploy. Uses Node 20 for builds. Base path is `/sovereign-architect-hud/`.

## Tech Stack

- React 19 + Vite 7
- Tailwind CSS 3
- Lucide React (icons)
- @dnd-kit (drag-and-drop)
- Three.js + React Three Fiber (included, not yet active)
- localStorage for persistence, GitHub Gist for cloud sync
- No TypeScript — plain JSX

## Design Philosophy

> "You are specialized, not broken."

The HUD makes invisible patterns visible:
- Energy expenditure has real costs — track them
- "Holding" for others is the highest drain but rarely named
- The loop cannot complete without Release
- Awareness without action is just spectatorship
