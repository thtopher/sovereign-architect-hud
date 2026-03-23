# Getting Started with the Sovereign Architect HUD (For Non-Developers)

This guide is written for two audiences at once: **you** (a human who has never written code) and **your AI assistant** (Claude Code, Lumen, or any LLM agent that can read this file). Everything here assumes zero prior knowledge.

---

## What This Project Is

The Sovereign Architect HUD is a web application — a website that runs in your browser. The code that generates it lives on GitHub (think of GitHub as a filing cabinet for code). When you change the code and push it to GitHub, the site automatically rebuilds and goes live.

**Your live site:** https://ds016683.github.io/sovereign-architect-hud/
**Your code on GitHub:** https://github.com/ds016683/sovereign-architect-hud

---

## Key Concepts (Plain English)

| Term | What It Means |
|------|--------------|
| **Repository (repo)** | A folder of code stored on GitHub. Your repo is your copy of the project. |
| **Fork** | Your personal copy of someone else's repo. You forked Topher's version — now you have your own. |
| **Clone** | Downloading the repo from GitHub to your computer so you can work on it locally. |
| **Commit** | Saving a snapshot of your changes with a short description of what you did. |
| **Push** | Uploading your saved changes from your computer back to GitHub. |
| **Pull Request (PR)** | A proposal to merge your changes into someone else's repo. If you want Topher to adopt a change you made, you'd open a PR. |
| **Branch** | A parallel version of the code where you can experiment without affecting the main site. |
| **npm** | A tool that downloads and manages code libraries your project depends on. |
| **Node.js** | The engine that runs JavaScript tooling on your computer. Required to build and preview the site. |
| **Dev server** | A local preview of the site that runs on your computer. You can see changes instantly before pushing them live. |

---

## One-Time Setup (Do This Once)

These steps get your computer ready to work on the project. You only do this once.

### Step 1: Install Node.js

Node.js is the engine that runs the project's build tools.

1. Go to https://nodejs.org
2. Download the **LTS** version (the one that says "Recommended for Most Users")
3. Run the installer — accept all defaults
4. Open your terminal:
   - **Mac:** Open the app called "Terminal" (search for it in Spotlight)
   - **Windows:** Open "PowerShell" from the Start menu
5. Type `node --version` and press Enter. You should see a version number like `v22.x.x`. If you do, it worked.

### Step 2: Install Claude Code

Claude Code is an AI coding assistant that runs in your terminal. You talk to it in plain English and it handles all the code, git commands, and technical details.

1. In your terminal, type:
   ```
   npm install -g @anthropic-ai/claude-code
   ```
2. Once installed, type `claude` to launch it. It will ask you to log in with your Anthropic/Claude account.

### Step 3: Clone Your Fork

This downloads your copy of the project to your computer.

1. In your terminal, type:
   ```
   git clone https://github.com/ds016683/sovereign-architect-hud.git
   ```
2. Then move into the project folder:
   ```
   cd sovereign-architect-hud
   ```
3. Install the project's dependencies:
   ```
   npm install
   ```

### Step 4: Verify It Works

Start the local dev server to see the site on your computer:

```
npm run dev
```

Open your browser and go to: http://localhost:5173/sovereign-architect-hud/

You should see the HUD. Press `Ctrl+C` in the terminal to stop the server when you're done.

---

## How To Make Changes

This is the day-to-day workflow. Once setup is done, this is all you need.

### Option A: Claude Code (Recommended)

This is the easiest path. You talk in English, Claude Code does the coding.

1. Open your terminal
2. Navigate to the project: `cd sovereign-architect-hud`
3. Type `claude` to start Claude Code
4. Tell it what you want in plain English. Examples:
   - *"Change the title at the top to say 'David's Command Center'"*
   - *"Add a new shadow mechanic called 'Perfectionism Trap' with an antidote of 'good enough is good enough'"*
   - *"Make the gold borders thicker"*
   - *"Show me what the portfolio page looks like right now"*
   - *"Run the dev server so I can preview changes"*
5. Claude Code will edit files, run commands, and explain what it's doing
6. When you're happy with the changes, tell Claude Code:
   - *"Commit these changes and push to GitHub"*
7. GitHub Actions will automatically rebuild and deploy your live site within a few minutes

### Option B: GitHub Web Editor (Quick Edits Only)

For small text or content changes, you can edit files directly on GitHub without any local setup:

1. Go to your repo: https://github.com/ds016683/sovereign-architect-hud
2. Navigate to the file you want to change
3. Click the pencil icon (Edit this file)
4. Make your change
5. Click "Commit changes" at the bottom
6. The site will automatically rebuild and deploy

This works for simple edits (changing text, adjusting a color value) but not for structural changes.

---

## How Collaboration Works

You and Topher each have your own copy of the project:

- **Topher's version:** https://thtopher.github.io/sovereign-architect-hud/
- **Your version:** https://ds016683.github.io/sovereign-architect-hud/

### Getting Topher's Updates

When Topher adds features or fixes bugs, you can pull his changes into your fork:

1. Open Claude Code in the project folder
2. Say: *"Sync my fork with the upstream repo at thtopher/sovereign-architect-hud"*
3. Claude Code will handle the git commands to fetch and merge the updates

### Sending Changes to Topher

If you make something you want in Topher's version too:

1. Open Claude Code
2. Say: *"Create a pull request to thtopher/sovereign-architect-hud with my recent changes"*
3. Claude Code will create a PR. Topher reviews it and either merges it or discusses changes.

### Working Independently

You can also just work on your fork without coordinating at all. Your site is yours. Change whatever you want — it won't affect Topher's version.

---

## Deploying Your Site

### First-Time: Enable GitHub Pages

Your fork needs GitHub Pages turned on to have a live site:

1. Go to https://github.com/ds016683/sovereign-architect-hud/settings/pages
2. Under "Source", select **GitHub Actions**
3. Save

After this, every push to `main` will automatically build and deploy your site.

### After Making Changes

Once GitHub Pages is enabled, deployment is automatic. Every time you push changes to the `main` branch (which Claude Code does when you say "commit and push"), the site rebuilds within 2-3 minutes.

Your live site will be at: https://ds016683.github.io/sovereign-architect-hud/

---

## What Lumen Can and Can't Do Here

**Lumen (via OpenClaw)** is great for:
- Planning what you want to build
- Drafting feature descriptions
- Reviewing what changed
- Communicating with Topher about the project

**Claude Code** is the right tool for:
- Editing code files
- Running the dev server
- Committing and pushing to GitHub
- Creating pull requests
- Debugging when something breaks

Think of it this way: Lumen is your strategist, Claude Code is your developer. You can tell Lumen what you want, then open Claude Code and tell it to build it.

---

## Project Structure (For AI Assistants)

If you're an AI agent reading this to help David make changes, here's what you need to know:

- **React 19 + Vite 7 + Tailwind CSS 3** — plain JSX, no TypeScript
- **`src/components/`** — All UI components (23 files). `HUD.jsx` is the main orchestrator.
- **`src/hooks/`** — State management: `useGameState`, `useActivityLog`, `usePortfolio`, `useSync`
- **`src/constants/`** — Game data definitions (`gameData.js`) and check-in questions (`checkinQuestions.js`)
- **`src/storage/`** — localStorage adapter, sync engine, GitHub Gist API client
- **`README.md`** — Full architecture documentation with component tables, hook descriptions, and system details
- **`CLAUDE.md`** — Instructions for Claude Code when working in this repo

Read `README.md` first for a complete picture of the codebase before making changes. All state is client-side (localStorage). No backend, no database.

---

## Troubleshooting

**"command not found: node"** — Node.js isn't installed. Go back to Step 1.

**"command not found: git"** — Git isn't installed. On Mac, open Terminal and type `xcode-select --install`. On Windows, download from https://git-scm.com.

**"command not found: claude"** — Claude Code isn't installed. Run `npm install -g @anthropic-ai/claude-code`.

**"npm install" shows errors** — Try deleting the `node_modules` folder and `package-lock.json`, then run `npm install` again.

**Site isn't updating after push** — Check https://github.com/ds016683/sovereign-architect-hud/actions to see if the build is running or failed. Builds take 2-3 minutes.

**Changes look wrong on the live site** — Run `npm run dev` locally first to preview before pushing. Tell Claude Code to start the dev server.
