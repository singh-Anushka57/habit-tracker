// All dates stored/compared as YYYY-MM-DD strings

export function todayStr() {
  const d = new Date();
  return toDateStr(d);
}

export function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDate(str) {
  // Parse YYYY-MM-DD without timezone shift
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(str, n) {
  const d = parseDate(str);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

export function diffDays(strA, strB) {
  // strA - strB in days
  const a = parseDate(strA);
  const b = parseDate(strB);
  return Math.round((a - b) / (1000 * 60 * 60 * 24));
}

export function formatDateDisplay(str) {
  const d = parseDate(str);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatShortDate(str) {
  const d = parseDate(str);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function getDayName(str) {
  return parseDate(str).toLocaleDateString('en-US', { weekday: 'short' });
}

// Returns array of date strings from `start` to `end` inclusive
export function dateRange(start, end) {
  const result = [];
  let cur = start;
  while (cur <= end) {
    result.push(cur);
    cur = addDays(cur, 1);
  }
  return result;
}

// Last N days ending today (inclusive)
export function lastNDays(n) {
  const end = todayStr();
  const start = addDays(end, -(n - 1));
  return dateRange(start, end);
}

// Check if habit is due on a given date
export function isDueOnDate(habit, dateStr) {
  if (habit.frequency === 'daily') return true;
  if (habit.frequency === 'weekly') {
    // due on the weekday it was created
    const createdDay = parseDate(habit.createdAt).getDay();
    const checkDay = parseDate(dateStr).getDay();
    return createdDay === checkDay;
  }
  if (habit.frequency === 'custom' && habit.customDays) {
    const dayIdx = parseDate(dateStr).getDay(); // 0=Sun
    return habit.customDays.includes(dayIdx);
  }
  return true;
}

// Calculate current active streak for a habit
export function calcCurrentStreak(habit) {
  const checkIns = habit.checkIns || {};
  let streak = 0;
  let date = todayStr();

  // If not checked in today, start checking from yesterday
  if (!checkIns[date]) {
    date = addDays(date, -1);
  }

  while (true) {
    if (isDueOnDate(habit, date)) {
      if (checkIns[date]) {
        streak++;
        date = addDays(date, -1);
      } else {
        // Check for freeze token
        if (habit.frozenDates && habit.frozenDates.includes(date)) {
          streak++;
          date = addDays(date, -1);
        } else {
          break;
        }
      }
    } else {
      // Not due on this day, skip back
      date = addDays(date, -1);
      // Guard against infinite loop for very old habits
      if (diffDays(todayStr(), date) > 365) break;
    }
    if (diffDays(todayStr(), date) > 365) break;
  }
  return streak;
}

// Calculate longest ever streak
export function calcLongestStreak(habit) {
  const checkIns = habit.checkIns || {};
  const dates = Object.keys(checkIns).filter(d => checkIns[d]).sort();
  if (dates.length === 0) return 0;

  let longest = 0;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const diff = diffDays(dates[i], dates[i - 1]);
    if (diff === 1) {
      current++;
    } else {
      longest = Math.max(longest, current);
      current = 1;
    }
  }
  return Math.max(longest, current);
}

// Completion rate over last N days (only due days count)
export function completionRate(habit, days = 7) {
  const range = lastNDays(days);
  const dueDays = range.filter(d => isDueOnDate(habit, d));
  if (dueDays.length === 0) return 0;
  const done = dueDays.filter(d => (habit.checkIns || {})[d]).length;
  return Math.round((done / dueDays.length) * 100);
}

// Momentum score 0-100: recency-weighted completion
export function calcMomentum(habit) {
  const today = todayStr();
  const checkIns = habit.checkIns || {};
  let score = 0;
  let totalWeight = 0;

  for (let i = 0; i < 30; i++) {
    const date = addDays(today, -i);
    if (!isDueOnDate(habit, date)) continue;
    const weight = Math.pow(0.92, i); // exponential decay
    totalWeight += weight;
    if (checkIns[date]) score += weight;
  }
  return totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;
}
