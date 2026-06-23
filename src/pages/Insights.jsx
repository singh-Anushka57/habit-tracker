import { useMemo } from 'react';
import { useHabits } from '../hooks/useHabits';
import {
  calcCurrentStreak, calcLongestStreak, completionRate, calcMomentum,
  lastNDays, isDueOnDate
} from '../utils/dateUtils';
import './Insights.css';

function MomentumBar({ score }) {
  const color = score >= 75 ? '#34d399' : score >= 50 ? '#f5a623' : score >= 25 ? '#7c5cfc' : '#fb7185';
  return (
    <div className="momentum-container">
      <div className="momentum-track">
        <div className="momentum-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="momentum-score" style={{ color }}>{score}</span>
    </div>
  );
}

export default function Insights() {
  const { habits } = useHabits();

  const stats = useMemo(() => {
    if (habits.length === 0) return null;

    const totalCheckIns = habits.reduce((s, h) =>
      s + Object.values(h.checkIns || {}).filter(Boolean).length, 0);

    const allCurrentStreaks = habits.map(h => calcCurrentStreak(h));
    const allLongest = habits.map(h => calcLongestStreak(h));
    const overallCurrent = Math.max(...allCurrentStreaks, 0);
    const overallLongest = Math.max(...allLongest, 0);

    // Overall 30-day completion rate
    const range = lastNDays(30);
    let totalDue = 0, totalDone = 0;
    habits.forEach(h => {
      range.forEach(d => {
        if (isDueOnDate(h, d)) {
          totalDue++;
          if ((h.checkIns || {})[d]) totalDone++;
        }
      });
    });
    const overallRate = totalDue > 0 ? Math.round((totalDone / totalDue) * 100) : 0;

    // Best habit by 30-day completion
    const habitStats = habits.map(h => ({
      ...h,
      rate30: completionRate(h, 30),
      rate7: completionRate(h, 7),
      current: calcCurrentStreak(h),
      longest: calcLongestStreak(h),
      momentum: calcMomentum(h),
    })).sort((a, b) => b.rate30 - a.rate30);

    return { totalCheckIns, overallCurrent, overallLongest, overallRate, habitStats };
  }, [habits]);

  if (habits.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container insights-page">
          <h1>Insights</h1>
          <div className="empty-state" style={{ marginTop: 40 }}>
            <div className="empty-icon">📊</div>
            <h3>Nothing to show yet</h3>
            <p>Add habits and start checking in. Your insights will appear here.</p>
          </div>
        </div>
      </div>
    );
  }

  const { totalCheckIns, overallCurrent, overallLongest, overallRate, habitStats } = stats;
  const bestHabit = habitStats[0];

  return (
    <div className="page-wrapper">
      <div className="container insights-page">
        <div className="insights-header animate-fade-up">
          <h1>Insights</h1>
          <p className="insights-sub">Your consistency at a glance.</p>
        </div>

        {/* Top stats */}
        <div className="insights-stats animate-fade-up">
          <div className="stat-box">
            <span className="stat-value">{habits.length}</span>
            <span className="stat-label">Total Habits</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{overallRate}%</span>
            <span className="stat-label">30d Completion</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{overallCurrent}🔥</span>
            <span className="stat-label">Current Streak</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{overallLongest}</span>
            <span className="stat-label">Longest Streak</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{totalCheckIns}</span>
            <span className="stat-label">Total Check-ins</span>
          </div>
        </div>

        {/* Best Habit */}
        {bestHabit && bestHabit.rate30 > 0 && (
          <div className="best-habit-card card animate-fade-up" style={{ '--bh-color': bestHabit.color }}>
            <div className="best-habit-trophy">🏆</div>
            <div className="best-habit-info">
              <span className="best-habit-eyebrow">Best Habit — last 30 days</span>
              <h2 className="best-habit-name">{bestHabit.name}</h2>
              <div className="best-habit-meta">
                <span className="badge" style={{ background: `${bestHabit.color}22`, color: bestHabit.color, border: `1px solid ${bestHabit.color}44` }}>
                  {bestHabit.category}
                </span>
                <span className="best-habit-rate">{bestHabit.rate30}% completion rate</span>
              </div>
            </div>
          </div>
        )}

        {/* Per habit cards */}
        <div className="insights-section animate-fade-up">
          <h2>Per Habit</h2>
          <div className="insights-habit-grid">
            {habitStats.map((h, i) => (
              <div key={h.id} className="insight-habit-card card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="ihc-top">
                  <div className="ihc-left">
                    <span className="ihc-dot" style={{ background: h.color }} />
                    <div>
                      <div className="ihc-name">{h.name}</div>
                      <span className="badge" style={{ background: `${h.color}22`, color: h.color, border: `1px solid ${h.color}44`, fontSize: '0.7rem' }}>
                        {h.category}
                      </span>
                    </div>
                  </div>
                  {i === 0 && h.rate30 > 0 && <span className="ihc-trophy">🏆</span>}
                </div>

                <div className="ihc-stats">
                  <div className="ihc-stat">
                    <span className="ihc-stat-val">{h.current}🔥</span>
                    <span className="ihc-stat-label">Current</span>
                  </div>
                  <div className="ihc-stat">
                    <span className="ihc-stat-val">{h.rate7}%</span>
                    <span className="ihc-stat-label">7d rate</span>
                  </div>
                  <div className="ihc-stat">
                    <span className="ihc-stat-val">{h.rate30}%</span>
                    <span className="ihc-stat-label">30d rate</span>
                  </div>
                </div>

                {/* BONUS: Habit Momentum */}
                <div className="ihc-momentum">
                  <span className="ihc-momentum-label">Momentum</span>
                  <MomentumBar score={h.momentum} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
