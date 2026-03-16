# Cloud Sync via GitHub Gist

**Date:** 2026-03-16
**Status:** Ready for planning
**Requested by:** David Smith (via Lumen, his AI assistant)

## What We're Building

Replace the HUD's localStorage-only persistence with a **local-first + GitHub Gist sync** model. David can use the HUD on any device and see the same state.

## Why GitHub Gist

- **Zero coordination with David** — Topher controls the Gist and PAT entirely
- **No backend needed** — stays a static GitHub Pages site
- **No OAuth complexity** — fine-grained PAT scoped to Gists, no expiration unless revoked
- **No CORS issues** — GitHub API allows cross-origin requests with auth
- **Free, reliable, GitHub-native** — the HUD already lives on GitHub

### Alternatives considered and rejected

| Option | Why not |
|--------|---------|
| Dropbox API | Requires David's OAuth credentials, token refresh flows, CORS workarounds |
| Cloudflare Workers KV | Another system to maintain, requires Cloudflare account |
| Firebase Realtime DB | ~50KB SDK addition, overkill for a single JSON blob |
| GitHub repo file | Commits on every save clutters history, slower API |

## Key Decisions

1. **Sync model: Sequential access** — One device at a time. No real-time sync, no conflict resolution. Open on phone, see what you did on laptop.

2. **Write strategy: Local-first with debounced remote sync** — localStorage writes instantly on every action (existing behavior preserved). Remote Gist sync debounced to every ~3 seconds. If browser crashes, you lose at most a few seconds.

3. **Auth method: Settings modal in HUD** — David enters Gist ID + PAT once in a settings screen. Credentials stored in his browser's localStorage. No secrets in source code. Token can be rotated without redeploying.

4. **Data shape: Single JSON file** — `hud-state.json` in a private Gist containing all three current localStorage keys merged into one blob:
   - `activityLog` (array of entries)
   - `portfolio` (array of projects)
   - `setupComplete` (boolean)

5. **Offline support: localStorage as cache** — If Gist is unreachable (offline, rate limit, error), HUD works normally from localStorage. Syncs on next successful connection.

## Architecture (High Level)

```
User Action
    ↓
localStorage (instant)
    ↓
Debounce timer (3s)
    ↓
Gist API PUT (background)
    ↓
On next load from new device:
    Gist API GET → hydrate localStorage → render
```

### Storage adapter pattern

Abstract current direct localStorage calls behind a `StorageAdapter` so the sync layer is cleanly separated from game logic.

## Sync Priority Rules

**Gist is the source of truth.** The logic on connect:

| Gist state | Local state | Action |
|------------|-------------|--------|
| Empty | Has data | Push local → Gist (first-time seed) |
| Has data | Empty | Pull Gist → local |
| Has data | Has data | **Gist wins** — overwrite local with Gist |
| Empty | Empty | No-op, start fresh |

This ensures:
- **David's first sync** (real data locally, empty Gist): his data becomes the Gist seed
- **David on new device** (Gist has data, local empty): Gist hydrates local
- **Topher's browser** (test data locally, never connects): test data never touches the Gist
- **Any connected browser** (Gist has David's data, local has anything): Gist always wins

No credentials entered = no sync = localStorage-only mode (current behavior). The sync layer is opt-in.

## Open Questions

1. **Conflict resolution** — Last-write-wins with a `lastModified` timestamp. Good enough for sequential access.
2. **Data size monitoring** — Activity log grows without bound. Should we add pruning/archival before the Gist hits 1MB? (Current growth rate: ~10KB/day heavy use = years before this matters.)

## Next Steps

Run `/workflows:plan` to generate implementation plan.
