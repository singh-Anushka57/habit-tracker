import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHabits } from '../hooks/useHabits';
import { getTotalCheckIns } from '../utils/storage';
import { calcCurrentStreak } from '../utils/dateUtils';
import './Home.css';

function HeroSVG() {
  return (
    <svg viewBox="0 0 420 340" xmlns="http://www.w3.org/2000/svg" className="hero-svg animate-float" aria-hidden="true">
      {/* Background glow circles */}
      <circle cx="210" cy="170" r="140" fill="rgba(124,92,252,0.06)" />
      <circle cx="210" cy="170" r="100" fill="rgba(124,92,252,0.05)" />

      {/* Calendar grid */}
      <rect x="60" y="60" width="300" height="220" rx="20" fill="#17171f" stroke="#2c2c3e" strokeWidth="1.5"/>
      <rect x="60" y="60" width="300" height="50" rx="20" fill="#1f1f2a"/>
      <rect x="60" y="90" width="300" height="20" fill="#1f1f2a"/>

      {/* Calendar header */}
      <text x="210" y="92" textAnchor="middle" fill="#9896b8" fontSize="13" fontFamily="Space Grotesk" fontWeight="600">JUNE 2026</text>

      {/* Grid cells - week 1 */}
      {[0,1,2,3,4,5,6].map((i) => (
        <rect key={`w1-${i}`} x={76 + i * 40} y="120" width="28" height="24" rx="6"
          fill={i < 5 ? "rgba(124,92,252,0.7)" : "#232332"} />
      ))}
      {[0,1,2,3,4,5,6].map((i) => (
        <rect key={`w2-${i}`} x={76 + i * 40} y="154" width="28" height="24" rx="6"
          fill={i < 4 ? "rgba(124,92,252,0.5)" : i === 4 ? "rgba(245,166,35,0.8)" : "#232332"} />
      ))}
      {[0,1,2,3,4,5,6].map((i) => (
        <rect key={`w3-${i}`} x={76 + i * 40} y="188" width="28" height="24" rx="6"
          fill={i < 3 ? "rgba(124,92,252,0.35)" : "#232332"} />
      ))}
      {[0,1,2,3,4,5,6].map((i) => (
        <rect key={`w4-${i}`} x={76 + i * 40} y="222" width="28" height="24" rx="6"
          fill={i < 1 ? "rgba(52,211,153,0.9)" : "#232332"} />
      ))}

      {/* Streak badge */}
      <rect x="130" y="270" width="160" height="36" rx="18" fill="#7c5cfc"/>
      <text x="210" y="293" textAnchor="middle" fill="white" fontSize="14" fontFamily="Space Grotesk" fontWeight="700">🔥 14 Day Streak!</text>
    </svg>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { habits } = useHabits();
  const [totalCheckins, setTotalCheckins] = useState(0);

  useEffect(() => {
    setTotalCheckins(getTotalCheckIns());
  }, [habits]);

  const bestStreak = habits.reduce((max, h) => {
    const s = calcCurrentStreak(h);
    return s > max ? s : max;
  }, 0);

  const overallRate = habits.length > 0
    ? Math.round(habits.reduce((sum, h) => {
        const rate = Object.values(h.checkIns || {}).filter(Boolean).length;
        return sum + rate;
      }, 0) / habits.length)
    : 0;

  return (
    <div className="home-page page-wrapper">
      {/* Hero Section */}
      <section className="hero container">
        <div className="hero-left animate-fade-up">
          <span className="hero-eyebrow">Track. Streak. Forge.</span>
          <h1 className="hero-headline">
            Build habits that <span className="hero-accent">actually stick</span>
          </h1>
          <p className="hero-sub">
            Daily check-ins, streak tracking, and a heatmap that shows you exactly
            where you're winning — and where to push harder.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-val">{bestStreak}<span className="flame-icon">🔥</span></span>
              <span className="hero-stat-label">Best Streak</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-val">{habits.length}</span>
              <span className="hero-stat-label">Active Habits</span>
            </div>
          </div>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              Begin Tracking →
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/add-habit')}>
              + New Habit
            </button>
          </div>

          {/* Live global stat with CSS animation */}
          <div className="global-stat">
            <span className="global-stat-pulse" />
            <span className="global-stat-number" key={totalCheckins}>{totalCheckins}</span>
            <span className="global-stat-text">total check-ins logged</span>
          </div>
        </div>

        <div className="hero-right animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <HeroSVG />
        </div>
      </section>

      {/* Features strip */}
      <section className="features container">
        {[
          { icon: '📅', title: 'Daily Check-ins', desc: 'Mark habits done with a tap. Streaks update instantly.' },
          { icon: '🗓️', title: 'Consistency Grid', desc: 'A GitHub-style heatmap of your last 30 days.' },
          { icon: '📊', title: 'Deep Insights', desc: 'Completion rates, momentum scores, and best habit highlights.' },
          { icon: '🧊', title: 'Streak Freeze', desc: 'One free pass per week. Protect your streak on tough days.' },
        ].map((f, i) => (
          <div key={f.title} className="feature-card card animate-fade-up" style={{ animationDelay: `${0.1 * i}s` }}>
            <span className="feature-icon">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
