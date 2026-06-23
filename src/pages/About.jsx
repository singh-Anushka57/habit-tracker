import './About.css';

export default function About() {
  return (
    <div className="page-wrapper">
      <div className="container about-page">
        <div className="about-hero animate-fade-up">
          <h1>About <span className="about-accent">StreakForge</span></h1>
          <p className="about-tagline">A habit tracker built with React, streaks, and a suspicious amount of caffeine.</p>
        </div>

        <div className="about-grid animate-fade-up">
          {/* About the app */}
          <div className="about-card card">
            <h2>🎯 What is this?</h2>
            <p>
              StreakForge is a daily habit tracker that helps you build consistency through
              streaks, visual heatmaps, and real-time insights. Create habits across categories
              like Health, Productivity, or Fitness — then check in every day to keep your
              flame alive.
            </p>
            <p>
              Miss a day? Use your weekly <strong>Streak Freeze</strong> token and live to streak
              another day. Every week, you get one free pass. Use it wisely — or don't, no judgment.
            </p>
          </div>

          {/* Tech stack */}
          <div className="about-card card">
            <h2>⚙️ Tech Stack</h2>
            <div className="tech-list">
              {[
                { icon: '⚛️', name: 'React 18', desc: 'UI with functional components + hooks' },
                { icon: '⚡', name: 'Vite', desc: 'Blazing fast bundler & dev server' },
                { icon: '🛤️', name: 'React Router v6', desc: 'SPA routing with nested routes + 404' },
                { icon: '💾', name: 'localStorage', desc: 'All data persisted in the browser — no backend needed' },
                { icon: '🎨', name: 'Pure CSS', desc: 'Custom design system, no UI library, no Tailwind' },
                { icon: '📅', name: 'Date API', desc: 'All date math from scratch — no moment.js' },
              ].map(t => (
                <div key={t.name} className="tech-item">
                  <span className="tech-icon">{t.icon}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What I learned */}
          <div className="about-card card">
            <h2>📚 What I Learned</h2>
            <ul className="learnings-list">
              <li>
                <strong>Date bugs are real.</strong> JavaScript's <code>new Date("2026-06-23")</code> is UTC midnight,
                which can shift by a day depending on your timezone. The fix: always parse dates as
                local with <code>new Date(y, m-1, d)</code>.
              </li>
              <li>
                <strong>Streak math is tricky.</strong> Walking backwards from today, skipping non-due days,
                and checking freeze tokens — this needed careful iteration and edge-case testing.
              </li>
              <li>
                <strong>CSS Grid is powerful.</strong> The heatmap uses <code>grid-auto-flow: column</code>
                with <code>grid-template-rows: repeat(7, 1fr)</code> — no chart library needed.
              </li>
              <li>
                <strong>Context vs prop drilling.</strong> React Context made sharing habit state
                clean without threading props through four layers of components.
              </li>
              <li>
                <strong>Inline validation UX.</strong> Only showing errors after a field is "touched"
                (not on first render) is way more user-friendly — and took more thought than expected.
              </li>
            </ul>
          </div>

          {/* Memes / fun section */}
          <div className="about-card card about-memes">
            <h2>😭 Dev Diary (Real)</h2>
            <div className="meme-list">
              <div className="meme-item">
                <span className="meme-emoji">🐛</span>
                <p>Spent 45 minutes debugging why streaks were off by 1. It was the UTC date thing.</p>
              </div>
              <div className="meme-item">
                <span className="meme-emoji">🤦</span>
                <p>Thought CSS grid heatmap would be easy. CSS grid heatmap was not easy.</p>
              </div>
              <div className="meme-item">
                <span className="meme-emoji">🍅</span>
                <p>Ironically, I used a Pomodoro timer while building the Pomodoro timer.</p>
              </div>
              <div className="meme-item">
                <span className="meme-emoji">📅</span>
                <p>JavaScript Date is: consistently inconsistent, timezone-dependent chaos. I respect it.</p>
              </div>
              <div className="meme-item">
                <span className="meme-emoji">🔥</span>
                <p>I have a 0-day streak on this app because I built it, not used it. The cobbler's children have no shoes.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-footer animate-fade-up">
          <p>Built for <strong>KTJ Web Dev & AI Workshop 2026</strong> · Assignment 3</p>
          <p className="about-footer-sub">React + Vite · All streak calculations from scratch · No chart libraries · Pure CSS heatmap</p>
        </div>
      </div>
    </div>
  );
}
