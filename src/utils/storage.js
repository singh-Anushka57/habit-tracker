const HABITS_KEY = 'streakforge_habits';
const TOKEN_KEY = 'streakforge_freeze_token';

export function loadHabits() {
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHabits(habits) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function loadFreezeToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw) : getDefaultToken();
  } catch {
    return getDefaultToken();
  }
}

export function saveFreezeToken(token) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

function getDefaultToken() {
  return { count: 1, weekStart: getCurrentWeekStart() };
}

function getCurrentWeekStart() {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diff = now.getDate() - day;
  const start = new Date(now.setDate(diff));
  return start.toISOString().split('T')[0];
}

// Refresh token if new week
export function getOrRefreshToken() {
  const token = loadFreezeToken();
  const currentWeek = getCurrentWeekStart();
  if (token.weekStart !== currentWeek) {
    const fresh = { count: 1, weekStart: currentWeek };
    saveFreezeToken(fresh);
    return fresh;
  }
  return token;
}

// Global stat: total check-ins across all habits
export function getTotalCheckIns() {
  const habits = loadHabits();
  return habits.reduce((total, h) => {
    return total + Object.values(h.checkIns || {}).filter(Boolean).length;
  }, 0);
}
