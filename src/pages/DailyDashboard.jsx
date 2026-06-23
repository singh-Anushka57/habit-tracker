import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../hooks/useHabits';
import { todayStr, isDueOnDate, formatDateDisplay } from '../utils/dateUtils';
import { getOrRefreshToken } from '../utils/storage';
import HabitCard from '../components/HabitCard';
import PomodoroTimer from '../components/PomodoroTimer';
import './DailyDashboard.css';

export default function DailyDashboard() {
  const { habits } = useHabits();
  const navigate = useNavigate();
  const today = todayStr();
  const [showPomodoro, setShowPomodoro] = useState(false);

  const dueToday = habits.filter(h => isDueOnDate(h, today));
  const doneToday = dueToday.filter(h => (h.checkIns || {})[today]);
  const completionPct = dueToday.length > 0
    ? Math.round((doneToday.length / dueToday.length) * 100)
    : 0;

  const token = getOrRefreshToken();

  const allDone = dueToday.length > 0 && doneToday.length === dueToday.length;

  return (
    <div className="page-wrapper">
      <div className="container dashboard-page">
        <div className="dashboard-header animate-fade-up">
          <div>
            <h1>My Habits</h1>
            <p className="dashboard-date">{formatDateDisplay(today)}</p>
          </div>
          <div className="dashboard-header-actions">
            <button
              className={`btn btn-ghost btn-sm${showPomodoro ? ' active-toggle' : ''}`}
              onClick={() => setShowPomodoro(s => !s)}
            >
              🍅 {showPomodoro ? 'Hide Timer' : 'Pomodoro'}
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/add-habit')}>
              + New Habit
            </button>
          </div>
        </div>

        {/* Daily progress bar */}
        <div className="dashboard-progress-section card animate-fade-up">
          <div className="progress-meta">
            <span className="progress-label">
              {allDone ? '🎉 All done today!' : `${doneToday.length} / ${dueToday.length} habits completed`}
            </span>
            <span className="progress-pct">{completionPct}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          <div className="progress-sub">
            {completionPct === 100 && dueToday.length > 0
              ? 'Perfect day! Your streaks are intact 🔥'
              : dueToday.length === 0
              ? 'No habits due today. Add some!'
              : `${dueToday.length - doneToday.length} remaining`}
          </div>
        </div>

        {/* Freeze token status */}
        <div className="token-bar animate-fade-up">
          <span className="token-label">
            ❄️ Streak Freeze: {token.count > 0 ? `${token.count} token available this week` : 'No tokens left this week'}
          </span>
          <div className="token-dots">
            {[...Array(1)].map((_, i) => (
              <span key={i} className={`token-dot${i < token.count ? ' filled' : ''}`} />
            ))}
          </div>
        </div>

        <div className="dashboard-body">
          {/* Habit cards */}
          <div className="habits-col">
            {dueToday.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No habits due today</h3>
                <p>Create your first habit to get started on your streak journey.</p>
                <button className="btn btn-primary" onClick={() => navigate('/add-habit')}>
                  + Add First Habit
                </button>
              </div>
            ) : (
              <div className="habits-grid">
                {dueToday.map((h, i) => (
                  <div key={h.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
                    <HabitCard habit={h} />
                  </div>
                ))}
              </div>
            )}

            {/* Habits not due today */}
            {habits.filter(h => !isDueOnDate(h, today)).length > 0 && (
              <div className="not-due-section">
                <h3 className="not-due-title">Not due today</h3>
                <div className="not-due-list">
                  {habits.filter(h => !isDueOnDate(h, today)).map(h => (
                    <span key={h.id} className="not-due-chip" style={{ borderColor: `${h.color}44` }}>
                      <span className="not-due-dot" style={{ background: h.color }} />
                      {h.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pomodoro sidebar */}
          {showPomodoro && (
            <div className="pomodoro-col animate-slide-in">
              <PomodoroTimer habits={habits} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
