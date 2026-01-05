# Sovereign Architect HUD

An interactive, browser-based HUD (Heads-Up Display) for the Sovereign Architect character build system. Built with React + Tailwind CSS.

## Features

### 🕐 Time-Aware Contextual Display
- Automatically detects time of day (morning/afternoon/evening/night)
- Shows contextually relevant prompts and protocols
- Different check-in questions based on time

### 📊 Visual Stats & Meters
- **Core Attributes Panel** - S+, S, A+, A, C tier stats with visual bars
- **Sovereignty Resource Meter** - Real-time tracking with color-coded status
- **Identity Loop Status** - 7-phase cycle tracker
- **Shadow Mechanics Monitor** - Tracks active failure modes

### ✅ Interactive Protocols
- **Morning Protocol** - Resource check, loop status, priority setting
- **Afternoon Protocol** - Mid-day recalibration, false responsibility check
- **Evening Protocol** - Completion inventory, recovery planning
- **Night Protocol** - Release phase check

### 🎮 Game-Like UI Elements
- Dark fantasy theme inspired by Diablo/RPG interfaces
- Animated stat bars and status indicators
- Real-time updates and transitions
- Responsive design (works on desktop & mobile)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Usage

1. Open the app in your browser (default: http://localhost:5173)
2. The HUD will automatically detect the time of day
3. Follow the contextual prompts for your current time period
4. Monitor your resource levels and shadow mechanics
5. Track your position in the identity loop

## Components

- **HUD.jsx** - Main orchestrator component
- **TimeContext.jsx** - Time-aware greeting and context
- **ResourceMeter.jsx** - Sovereignty resource tracking
- **StatsPanel.jsx** - Core attributes display
- **LoopStatus.jsx** - Identity loop phase tracker
- **ShadowMonitor.jsx** - Failure mode detection
- **DailyPrompts.jsx** - Time-specific check-in questions

## Design Philosophy

> "You are specialized, not broken."

The HUD is designed to:
- Provide quick visual feedback on system status
- Encourage regular check-ins throughout the day
- Make psychological monitoring feel like gameplay
- Support the Sovereign Architect operating system

## Future Enhancements

- [ ] Data persistence (localStorage)
- [ ] Historical tracking and charts
- [ ] Export daily logs
- [ ] Custom notifications/reminders
- [ ] Active Skills activation interface
- [ ] Growth Path progression tracker
- [ ] Environmental buff/nerf indicator

## Tech Stack

- React 18+
- Tailwind CSS
- Vite

---

**Version 1.0** | Built for the Sovereign Architect system
