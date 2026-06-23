# 🔥 StreakForge — Habit Tracker & Streak Dashboard

**KTJ Web Dev & AI Workshop 2026 · Assignment 3**

A React + Vite habit tracker with daily check-ins, streak calculations, a CSS grid heatmap, and a full insights dashboard.

---

---

## 🚀 Running Locally

```bash
npm install
npm run dev
```

## 🌐 Building for Production

```bash
npm run build
```

The built files go into `dist/`. Deploy to GitHub Pages, Netlify, or Vercel.

## 📦 GitHub Pages Deployment

1. Push the repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **GitHub Actions**
4. Add the workflow below at `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
        id: deployment
```

---

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Navbar.jsx/css       — Fixed top nav with hamburger
│   ├── HabitCard.jsx/css    — Daily check-in card with streaks
│   ├── PomodoroTimer.jsx/css — 25/5 Pomodoro with habit linking
│   └── ToastContainer.jsx   — Notification toasts
├── pages/
│   ├── Home.jsx/css         — Landing with hero SVG + live stat
│   ├── DailyDashboard.jsx/css — Today's habits + progress bar
│   ├── AddHabitForm.jsx/css — Create/edit habits with validation
│   ├── ConsistencyGrid.jsx/css — Calendar heatmap (pure CSS Grid)
│   ├── Insights.jsx/css     — Stats, best habit, momentum scores
│   ├── About.jsx/css        — App info + dev diary
│   └── NotFound.jsx/css     — Custom 404
├── hooks/
│   └── useHabits.jsx        — React Context + all habit actions
├── utils/
│   ├── dateUtils.js         — All date math from scratch
│   └── storage.js           — localStorage helpers
└── data/
    └── constants.js         — Categories, frequencies, motivational msgs
```

## 🧠 Key Technical Decisions

**Date Handling:** All dates are stored as `YYYY-MM-DD` strings. Parsing uses `new Date(y, m-1, d)` (local time) not `new Date(str)` (UTC) to avoid timezone-induced off-by-one bugs.

**Streak Algorithm:** Walks backwards from today, checking if each day is "due" for the habit's frequency, counting consecutive completed days, and respecting Freeze tokens.

**CSS Grid Heatmap:** Uses `grid-template-rows: repeat(7, 1fr)` + `grid-auto-flow: column` so dates flow into columns (weeks) with rows as days-of-week. Zero external libraries.

**Momentum Score:** Exponentially-weighted completion rate over 30 days — recent days count more than older ones using `weight = 0.92^i`.

## 📦 Tech Stack

- **React 18** — Functional components, hooks, Context API
- **Vite** — Build tool
- **React Router v6** — Client-side routing, including custom 404
- **localStorage** — Full data persistence, no backend
- **Pure CSS** — Custom design system, animations, responsive layout

---

*Built for KTJ Web Dev & AI Workshop 2026*
