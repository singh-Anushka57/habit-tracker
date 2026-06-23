import { useState, useEffect, useRef, useCallback } from 'react';
import { useHabits } from '../hooks/useHabits';
import './PomodoroTimer.css';

const WORK = 25 * 60;
const BREAK = 5 * 60;

export default function PomodoroTimer({ habits }) {
  const { addPomodoroSession, addToast } = useHabits();
  const [mode, setMode] = useState('work'); // 'work' | 'break'
  const [seconds, setSeconds] = useState(WORK);
  const [running, setRunning] = useState(false);
  const [linkedHabit, setLinkedHabit] = useState('');
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const total = mode === 'work' ? WORK : BREAK;
  const progress = ((total - seconds) / total) * 100;
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  const handleComplete = useCallback(() => {
    setRunning(false);
    clearInterval(intervalRef.current);
    if (mode === 'work') {
      setSessions(s => s + 1);
      if (linkedHabit) {
        addPomodoroSession(linkedHabit, 25);
        addToast('🍅 Pomodoro done! 25 min logged.', 'success');
      } else {
        addToast('🍅 Pomodoro complete! Link a habit to track time.', 'info');
      }
      setMode('break');
      setSeconds(BREAK);
    } else {
      setMode('work');
      setSeconds(WORK);
      addToast('Break over! Back to work 💪', 'info');
    }
  }, [mode, linkedHabit, addPomodoroSession, addToast]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { handleComplete(); return 0; }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, handleComplete]);

  function reset() {
    setRunning(false);
    setSeconds(mode === 'work' ? WORK : BREAK);
  }

  function switchMode(m) {
    setRunning(false);
    setMode(m);
    setSeconds(m === 'work' ? WORK : BREAK);
  }

  const circumference = 2 * Math.PI * 54;
  const strokeDash = circumference - (progress / 100) * circumference;

  return (
    <div className="pomodoro card">
      <div className="pomodoro-header">
        <h3>🍅 Pomodoro Timer</h3>
        <div className="pomodoro-mode-tabs">
          <button
            className={`mode-tab${mode === 'work' ? ' active' : ''}`}
            onClick={() => switchMode('work')}
          >
            Work
          </button>
          <button
            className={`mode-tab${mode === 'break' ? ' active' : ''}`}
            onClick={() => switchMode('break')}
          >
            Break
          </button>
        </div>
      </div>

      <div className="pomodoro-clock">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--bg-elevated)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={mode === 'work' ? 'var(--violet)' : 'var(--mint)'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDash}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.5s linear' }}
          />
        </svg>
        <div className="pomodoro-time">{mins}:{secs}</div>
      </div>

      <div className="pomodoro-link">
        <label className="form-label" htmlFor="pomo-habit">Link to Habit</label>
        <select
          id="pomo-habit"
          className="form-select"
          value={linkedHabit}
          onChange={e => setLinkedHabit(e.target.value)}
        >
          <option value="">-- No link --</option>
          {habits.map(h => (
            <option key={h.id} value={h.id}>{h.name}</option>
          ))}
        </select>
      </div>

      <div className="pomodoro-controls">
        <button
          className={`btn ${running ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => setRunning(r => !r)}
        >
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button className="btn btn-ghost" onClick={reset}>↺ Reset</button>
      </div>

      {sessions > 0 && (
        <div className="pomodoro-sessions">
          {Array.from({ length: sessions }).map((_, i) => (
            <span key={i} className="pomo-dot" title="Completed session" />
          ))}
        </div>
      )}
    </div>
  );
}
