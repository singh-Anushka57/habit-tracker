import { useState, useMemo } from 'react';
import { useHabits } from '../hooks/useHabits';
import {
  lastNDays, todayStr, isDueOnDate, parseDate, getDayName,
  formatShortDate, calcCurrentStreak
} from '../utils/dateUtils';
import { CATEGORIES, getMotivationalMsg } from '../data/constants';
import './ConsistencyGrid.css';

const DAY_ABBRS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getIntensity(done, total) {
  if (total === 0) return 0;
  const r = done / total;
  if (r === 0) return 0;
  if (r <= 0.25) return 1;
  if (r <= 0.5) return 2;
  if (r <= 0.75) return 3;
  return 4;
}

export default function ConsistencyGrid() {
  const { habits } = useHabits();
  const [days, setDays] = useState(30);
  const [filterCat, setFilterCat] = useState('All');

  const filteredHabits = useMemo(() => {
    return filterCat === 'All' ? habits : habits.filter(h => h.category === filterCat);
  }, [habits, filterCat]);

  const dateList = useMemo(() => lastNDays(days), [days]);

  // For each date: how many filtered habits were done / due
  const cellData = useMemo(() => {
    return dateList.map(date => {
      const due = filteredHabits.filter(h => isDueOnDate(h, date));
      const done = due.filter(h => (h.checkIns || {})[date]);
      return { date, done: done.length, total: due.length, intensity: getIntensity(done.length, due.length) };
    });
  }, [dateList, filteredHabits]);

  const bestStreak = habits.reduce((max, h) => {
    const s = calcCurrentStreak(h);
    return s > max ? s : max;
  }, 0);

  const motivational = getMotivationalMsg(bestStreak);

  // Arrange into weeks (columns) for the grid
  // Pad start so first cell aligns to correct weekday
  const firstDate = dateList[0];
  const startDow = parseDate(firstDate).getDay(); // 0=Sun
  const padded = [...Array(startDow).fill(null), ...cellData];

  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="page-wrapper">
      <div className="container cg-page">
        <div className="cg-header animate-fade-up">
          <div>
            <h1>Consistency Grid</h1>
            <p className="cg-sub">{motivational}</p>
          </div>
          <div className="cg-controls">
            <div className="cg-range-tabs">
              {[7, 14, 30].map(n => (
                <button key={n} className={`mode-tab${days === n ? ' active' : ''}`} onClick={() => setDays(n)}>
                  {n}d
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="cg-filters animate-fade-up">
          <button
            className={`chip${filterCat === 'All' ? ' active' : ''}`}
            onClick={() => setFilterCat('All')}
          >
            All
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              className={`chip${filterCat === cat.value ? ' active' : ''}`}
              style={filterCat === cat.value ? { '--chip-color': cat.color, borderColor: cat.color, background: `${cat.color}22`, color: cat.color } : {}}
              onClick={() => setFilterCat(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {habits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗓️</div>
            <h3>No habits yet</h3>
            <p>Add some habits and check in daily — your grid will fill up here.</p>
          </div>
        ) : (
          <div className="cg-body card animate-fade-up">
            {/* Weekday labels */}
            <div className="cg-dow-labels">
              {DAY_ABBRS.map((d, i) => (
                <span key={i} className="cg-dow">{d}</span>
              ))}
            </div>

            {/* Grid */}
            <div className="cg-grid" style={{ '--cols': Math.ceil(padded.length / 7) }}>
              {padded.map((cell, i) => {
                if (!cell) return <div key={`pad-${i}`} className="cg-cell empty-pad" />;
                const isToday = cell.date === todayStr();
                return (
                  <div
                    key={cell.date}
                    className={`cg-cell intensity-${cell.intensity}${isToday ? ' today' : ''}`}
                    style={filterCat !== 'All' ? { '--accent-color': CATEGORIES.find(c => c.value === filterCat)?.color || 'var(--violet)' } : {}}
                    onMouseEnter={e => setTooltip({ cell, x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="cg-legend">
              <span className="cg-legend-label">Less</span>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className={`cg-legend-cell intensity-${i}`} />
              ))}
              <span className="cg-legend-label">More</span>
            </div>
          </div>
        )}

        {/* Tooltip */}
        {tooltip && (
          <div
            className="cg-tooltip"
            style={{ left: tooltip.x + 12, top: tooltip.y - 48 }}
          >
            <strong>{formatShortDate(tooltip.cell.date)}</strong>
            <span>{getDayName(tooltip.cell.date)}</span>
            <span>
              {tooltip.cell.total === 0
                ? 'No habits due'
                : `${tooltip.cell.done}/${tooltip.cell.total} habits done`}
            </span>
          </div>
        )}

        {/* Per-habit mini bars */}
        {filteredHabits.length > 0 && (
          <div className="cg-per-habit animate-fade-up">
            <h2>Per Habit</h2>
            <div className="cg-habit-list">
              {filteredHabits.map(h => {
                const dueDates = dateList.filter(d => isDueOnDate(h, d));
                const doneDates = dueDates.filter(d => (h.checkIns || {})[d]);
                const rate = dueDates.length > 0 ? Math.round((doneDates.length / dueDates.length) * 100) : 0;
                return (
                  <div key={h.id} className="cg-habit-row">
                    <span className="cg-habit-dot" style={{ background: h.color }} />
                    <span className="cg-habit-name">{h.name}</span>
                    <div className="cg-habit-mini-grid">
                      {dateList.slice(-14).map(d => {
                        const due = isDueOnDate(h, d);
                        const done = !!(h.checkIns || {})[d];
                        return (
                          <div
                            key={d}
                            className={`cg-mini-cell${!due ? ' not-due' : done ? ' done' : ' missed'}`}
                            style={done ? { background: h.color } : {}}
                          />
                        );
                      })}
                    </div>
                    <span className="cg-habit-rate">{rate}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
