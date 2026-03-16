---
title: "feat: Add cloud sync via GitHub Gist"
type: feat
date: 2026-03-16
brainstorm: docs/brainstorms/2026-03-16-cloud-sync-brainstorm.md
---

# feat: Add Cloud Sync via GitHub Gist

## Overview

Replace localStorage-only persistence with a local-first + GitHub Gist sync model. David can use the HUD on any device and see the same state. Sync is opt-in via a settings modal — no credentials entered means pure localStorage mode (current behavior unchanged).

## Problem Statement

All HUD data is trapped in one browser on one machine. David wants to access and update his dashboard from multiple devices (laptop, phone, etc.). The app is a static GitHub Pages site with no backend, so we need a client-side sync solution with zero server infrastructure.

## Proposed Solution

Use a private GitHub Gist as a remote JSON store. The app reads/writes via the GitHub REST API using a fine-grained PAT that the user enters once. localStorage remains the primary store (instant writes), with debounced background sync to the Gist.

## Technical Approach

### Architecture

```
User Action
    |
    v
React State (instant)
    |
    v
localStorage (instant, via StorageAdapter)
    |
    v
SyncEngine (debounced, 5s)
    |
    v
GitHub Gist API (background PUT)
    |
On next load (any device):
    Gist API GET --> hydrate localStorage --> hydrate React state
```

### New Files

| File | Purpose |
|------|---------|
| `src/storage/storageAdapter.js` | Abstraction over localStorage read/write |
| `src/storage/gistSync.js` | GitHub Gist API client (GET/PUT/POST) |
| `src/storage/syncEngine.js` | Orchestrates local-first writes + debounced remote sync |
| `src/hooks/useSync.js` | React hook exposing sync state, status, and controls |
| `src/hooks/useSettings.js` | Persists sync credentials + preferences to localStorage |
| `src/components/SyncSettings.jsx` | Settings modal for entering PAT and managing sync |
| `src/components/SyncIndicator.jsx` | Small status icon in the sticky header |

### Modified Files

| File | Change |
|------|--------|
| `src/hooks/useActivityLog.js` | Replace direct localStorage calls with StorageAdapter |
| `src/hooks/usePortfolio.js` | Replace direct localStorage calls with StorageAdapter |
| `src/components/HUD.jsx` | Add sync initialization, pass sync controls, persist game state (sovereignty, phase, shadows) |
| `src/components/StickyResourceBar.jsx` | Add SyncIndicator to header |
| `src/components/App.jsx` | Wrap with sync provider or pass sync state down |

### Implementation Phases

#### Phase 1: Storage Adapter Layer

Abstract localStorage behind a clean interface so hooks don't call localStorage directly.

**`src/storage/storageAdapter.js`**

```js
// Thin wrapper -- same API as localStorage but injectable
const storageAdapter = {
  getItem(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try { return JSON.parse(raw); }
    catch { return null; }
  },
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    localStorage.removeItem(key);
  }
};
export default storageAdapter;
```

**Modifications to existing hooks:**

- `useActivityLog.js` lines 762, 777: Replace `localStorage.getItem(STORAGE_KEY)` and `localStorage.setItem(STORAGE_KEY, ...)` with `storageAdapter.getItem/setItem`
- `usePortfolio.js` lines 12, 20: Same replacement in `loadProjects()` and `saveProjects()`

**Success criteria:**
- [ ] All localStorage calls go through storageAdapter
- [ ] Zero behavior change — app works identically
- [ ] No direct localStorage usage in hooks (except settings/credentials)

#### Phase 2: Gist API Client

**`src/storage/gistSync.js`**

```js
const GIST_API = 'https://api.github.com/gists';

export async function fetchGist(gistId, token) {
  const res = await fetch(`${GIST_API}/${gistId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
    },
  });
  if (!res.ok) throw new GistError(res.status, await res.text());
  const gist = await res.json();
  return {
    activityLog: parseFile(gist, 'activity-log.json'),
    portfolio: parseFile(gist, 'portfolio.json'),
    gameState: parseFile(gist, 'game-state.json'),
  };
}

export async function updateGist(gistId, token, data) {
  const res = await fetch(`${GIST_API}/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github+json',
    },
    body: JSON.stringify({
      files: {
        'activity-log.json': { content: JSON.stringify(data.activityLog) },
        'portfolio.json': { content: JSON.stringify(data.portfolio) },
        'game-state.json': { content: JSON.stringify(data.gameState) },
      },
    }),
  });
  if (!res.ok) throw new GistError(res.status, await res.text());
  return res.json();
}

export async function createGist(token) {
  const res = await fetch(GIST_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github+json',
    },
    body: JSON.stringify({
      description: 'Sovereign Architect HUD — synced state',
      public: false,
      files: {
        'activity-log.json': { content: '[]' },
        'portfolio.json': { content: '[]' },
        'game-state.json': { content: '{}' },
      },
    }),
  });
  if (!res.ok) throw new GistError(res.status, await res.text());
  const gist = await res.json();
  return gist.id;
}
```

**Error class:**

```js
class GistError extends Error {
  constructor(status, body) {
    const messages = {
      401: 'Access token is invalid or expired. Update your token in settings.',
      403: 'Token lacks required permissions. Ensure it has Gist scope.',
      404: 'Gist not found. It may have been deleted.',
      422: 'Data rejected by GitHub. The payload may be too large.',
      429: 'Rate limited. Sync will retry shortly.',
    };
    super(messages[status] || `Sync failed (${status})`);
    this.status = status;
  }
}
```

**Success criteria:**
- [ ] Can create a private Gist with 3 empty files
- [ ] Can fetch and parse all 3 files from a Gist
- [ ] Can update all 3 files in a single PATCH
- [ ] Errors throw GistError with human-readable messages

#### Phase 3: Sync Engine

**`src/storage/syncEngine.js`**

Core logic:
1. **On connect (first time with credentials):**
   - Fetch Gist
   - Apply sync priority rules (Gist wins if it has data)
   - Hydrate localStorage from Gist data
   - Mark `lastSyncAt` timestamp

2. **On app load (returning with credentials):**
   - Pull from Gist
   - Overwrite localStorage with Gist data
   - Hydrate React state

3. **On local change:**
   - Write to localStorage immediately (existing behavior)
   - Set dirty flag
   - Start/reset 5-second debounce timer
   - When timer fires: push full state to Gist

4. **On `beforeunload`:**
   - If dirty, attempt one final sync (best-effort, may be cut short)

5. **On network error:**
   - Keep dirty flag set
   - Retry on next change or when `navigator.onLine` fires `online` event
   - No operation queue — just push current full state when connectivity returns

**Sync priority rules (on connect/load):**

| Gist state | Local state | Action |
|------------|-------------|--------|
| Empty (`[]`/`{}`) | Has data | Push local to Gist |
| Has data | Empty | Pull Gist to local |
| Has data | Has data | Gist wins — overwrite local |
| Empty | Empty | No-op |

**Conflict model:** Last-write-wins at the full-state level. No per-entry merging. The most recent `PATCH` to the Gist is the truth. This is simple and correct for sequential (one-device-at-a-time) access.

**Success criteria:**
- [ ] First connect with empty Gist pushes local data up
- [ ] First connect with populated Gist pulls data down and overwrites local
- [ ] Changes debounce to 5s before syncing
- [ ] Offline usage works from localStorage; syncs when online returns
- [ ] `beforeunload` attempts final sync

#### Phase 4: Game State Persistence

Currently, sovereignty level, loop phase, and shadow intensities reset to defaults on every load. Add persistence for these as a new `game-state.json` file in the Gist (and a new localStorage key).

**New localStorage key:** `sovereign-architect-game-state`

**Shape:**

```js
{
  sovereigntyLevel: 50,          // number, 0-100
  currentPhase: 'intake',        // string, one of 8 phases
  shadows: {                     // object, 4 keys
    over_control: null,          // null | 'low' | 'medium' | 'high'
    isolation_spiral: null,
    intensity_addiction: null,
    false_responsibility: null,
  },
  lastModified: '2026-03-16T...' // ISO 8601
}
```

**Changes to HUD.jsx:**
- Initialize `sovereigntyLevel` from stored game state instead of hardcoded `50`
- Pass initial values to `LoopStatus` and `ShadowMonitor`
- Save game state on every change (reuse the storageAdapter + sync engine)

**Changes to LoopStatus.jsx and ShadowMonitor.jsx:**
- Accept `initialPhase` / `initialShadows` props from HUD
- Report changes up via existing callbacks (no new API needed)

**Success criteria:**
- [ ] Sovereignty level persists across page reloads
- [ ] Loop phase persists across page reloads
- [ ] Shadow states persist across page reloads
- [ ] Game state syncs to Gist along with activity log and portfolio

#### Phase 5: Settings UI

**`src/components/SyncSettings.jsx`**

A modal following the existing NotePrompt pattern (full-screen backdrop, `game-panel` container, dark fantasy aesthetic).

**States:**

1. **Not connected:** Shows PAT input field + "Connect" button. On connect:
   - Validate PAT by calling GitHub API (`GET /user` to verify token)
   - Create a new private Gist automatically
   - Store PAT + Gist ID in localStorage (`sovereign-architect-sync-settings`)
   - Run initial sync (Phase 3 rules)
   - Show success state

2. **Connected:** Shows:
   - Sync status (last sync time, current state)
   - "Sync Now" button (force immediate sync)
   - "Disconnect" button (clears credentials, keeps local data)
   - Gist ID (read-only, for reference)

3. **Error state:** Shows error message with RPG flavor text + retry/reconnect options

**How to open:** Gear icon added to `StickyResourceBar.jsx` (the fixed header). Consistent with where users expect settings.

**Success criteria:**
- [ ] User can enter PAT and connect (Gist auto-created)
- [ ] User can see sync status
- [ ] User can force sync
- [ ] User can disconnect
- [ ] Invalid PAT shows clear error
- [ ] Modal matches dark fantasy aesthetic

#### Phase 6: Sync Status Indicator

**`src/components/SyncIndicator.jsx`**

A small icon in the sticky header bar showing sync state:
- Cloud icon (synced) — subtle, not distracting
- Cloud with arrow (syncing) — brief animation
- Cloud with X (error) — amber/red, tappable to open settings
- No icon (not connected) — gear icon only

Clicking the indicator opens SyncSettings modal.

**Success criteria:**
- [ ] Visual feedback for all sync states
- [ ] Non-intrusive in normal operation
- [ ] Clear error indication when something's wrong
- [ ] Tappable to access settings

## Acceptance Criteria

### Functional Requirements

- [ ] App works identically with no credentials entered (pure localStorage, zero network calls)
- [ ] User can enter a PAT in settings and connect — Gist is auto-created
- [ ] On connect: local data pushes to Gist if Gist is empty; Gist overwrites local if Gist has data
- [ ] All changes sync to Gist within 5 seconds
- [ ] Opening the HUD on a new device (after entering credentials) shows the same data
- [ ] Sovereignty level, loop phase, and shadow states persist across page reloads and devices
- [ ] Sync works offline — uses localStorage, syncs when online returns
- [ ] User can disconnect sync (clears credentials, keeps local data)
- [ ] User can force an immediate sync
- [ ] "Clear Log" confirmation mentions synced copy will also be cleared

### Error Handling

- [ ] Invalid PAT: clear message, no crash
- [ ] Gist deleted: clear message, option to create new one
- [ ] Network timeout: silent retry on next change
- [ ] Rate limited (429): backoff and retry
- [ ] Payload too large: warn user, continue with localStorage

### Non-Functional Requirements

- [ ] No new dependencies (uses native `fetch`)
- [ ] No secrets in source code or build output
- [ ] Settings modal matches existing dark fantasy aesthetic
- [ ] Sync indicator is subtle and non-distracting
- [ ] Debounced writes don't degrade UI performance

## Gist File Structure

One private Gist with three files:

```
sovereign-architect-hud-state (Gist)
├── activity-log.json    # Array of activity entries
├── portfolio.json       # Array of portfolio projects
└── game-state.json      # Current sovereignty, phase, shadows
```

This gives each data type its own 1MB budget and allows independent reads if needed in the future.

## Dependencies & Risks

**No new npm dependencies.** Everything uses native `fetch` and the GitHub REST API.

**Risks:**
1. **1MB Gist file limit** — Activity log will eventually hit this. Monitoring only for now; add pruning when it matters (~months of daily use).
2. **PAT security** — Token in localStorage is readable by any JS on the same origin. Mitigated by: fine-grained PAT with Gist-only scope, private Gist, low-profile app. Settings UI will include a security note.
3. **GitHub API availability** — If GitHub is down, sync fails silently. App works from localStorage cache.
4. **`github.io` shared origin** — All GitHub Pages sites share this origin. Consider recommending a custom domain in the future for better isolation.

## References

- [GitHub Gist REST API](https://docs.github.com/en/rest/gists)
- [Fine-grained PATs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#fine-grained-personal-access-tokens)
- Brainstorm: `docs/brainstorms/2026-03-16-cloud-sync-brainstorm.md`
- Current localStorage usage: `src/hooks/useActivityLog.js:762-777`, `src/hooks/usePortfolio.js:10-21`, `src/components/FirstTimeNudges.jsx:4-19`
