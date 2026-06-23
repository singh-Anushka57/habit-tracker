import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../hooks/useHabits';
import { calcCurrentStreak, calcLongestStreak, todayStr } from '../utils/dateUtils';
import { getOrRefreshToken, saveFreezeToken } from '../utils/storage';
import './HabitCard.css';

export default function HabitCard({ habit }) {
  const { toggleCheckIn, deleteHabit, freezeDate, addToast } = useHabits();
  const navigate = useNavigate();
  const today = todayStr();

  const isDone = !!(habit.checkIns || {})[today];
  const currentStreak = calcCurrentStreak(habit);
  const longestStreak = calcLongestStreak(habit);
  const isFrozen = (habit.frozenDates || []).includes(today);

  const [animating, setAnimating] = useState(false);

  function handleToggle() {
    setAnimating(true);
    toggleCheckIn(habit.id, today);
    setTimeout(() => setAnimating(false), 400);
  }

  function handleFreeze() {
    const token = getOrRefreshToken();
    if (token.count <= 0) {
      addToast('No freeze tokens left this week!', 'error');
      return;
    }
    if (isDone) {
      addToast('Already checked in today!', 'info');
      return;
    }
    if (isFrozen) {
      addToast('Already frozen today!', 'info');
      return;
    }
    saveFreezeToken({ ...token, count: token.count - 1 });
    freezeDate(habit.id, today);
    addToast('❄️ Streak frozen for today!', 'success');
  }

  const pomodoroToday = (habit.pomodoroSessions || [])
    .filter(s => s.date === today)
    .reduce((sum, s) => sum + (s.duration || 0), 0);

  return (
    <div
      className={`habit-card card${isDone ? ' done' : ''}${isFrozen && !isDone ? ' frozen' : ''}${animating ? ' animating' : ''}`}
      style={{ '--habit-color': habit.color || '#7c5cfc' }}
    >
      <div className="hc-top">
        <div className="hc-info">
          <span className="hc-color-tag" style={{ background: habit.color }} />
          <div>
            <div className="hc-name">{habit.name}</div>
            <div className="hc-meta">
              <span className="badge hc-category" style={{ background: `${habit.color}22`, color: habit.color, borderColor: `${habit.color}44` }}>
                {habit.category}
              </span>
              <span className="hc-freq">{habit.frequency}</span>
            </div>
          </div>
        </div>

        <button
          className={`hc-check-btn${isDone ? ' checked' : ''}`}
          onClick={handleToggle}
          aria-label={isDone ? 'Uncheck habit' : 'Check habit'}
          title={isDone ? 'Click to uncheck' : 'Mark as done'}
        >
          {isDone ? '✓' : '○'}
        </button>
      </div>

      <div className="hc-streaks">
        <div className="hc-streak-item">
          <span className="hc-streak-icon">{isDone || isFrozen ? '🔥' : '💤'}</span>
          <div>
            <span className="hc-streak-val">{currentStreak}</span>
            <span className="hc-streak-label">Current streak</span>
          </div>
        </div>
        <div className="hc-streak-divider" />
        <div className="hc-streak-item">
          <span className="hc-streak-icon">🏆</span>
          <div>
            <span className="hc-streak-val">{longestStreak}</span>
            <span className="hc-streak-label">Longest streak</span>
          </div>
        </div>
        {pomodoroToday > 0 && (
          <>
            <div className="hc-streak-divider" />
            <div className="hc-streak-item">
              <span className="hc-streak-icon">🍅</span>
              <div>
                <span className="hc-streak-val">{pomodoroToday}m</span>
                <span className="hc-streak-label">Focused today</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="hc-actions">
        {!isDone && !isFrozen && (
          <button className="btn btn-ghost btn-sm hc-freeze-btn" onClick={handleFreeze} title="Use freeze token to protect streak">
            ❄️ Freeze
          </button>
        )}
        {isFrozen && !isDone && (
          <span className="hc-frozen-badge">❄️ Frozen</span>
        )}
        <div className="hc-action-right">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(`/add-habit?edit=${habit.id}`)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              if (window.confirm(`Delete "${habit.name}"? This cannot be undone.`)) deleteHabit(habit.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
