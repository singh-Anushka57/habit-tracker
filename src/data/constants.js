export const CATEGORIES = [
  { value: 'Health', label: '❤️ Health', color: '#fb7185' },
  { value: 'Productivity', label: '⚡ Productivity', color: '#7c5cfc' },
  { value: 'Fitness', label: '💪 Fitness', color: '#34d399' },
  { value: 'Learning', label: '📚 Learning', color: '#38bdf8' },
  { value: 'Mindfulness', label: '🧘 Mindfulness', color: '#f5a623' },
  { value: 'Social', label: '👥 Social', color: '#a78bfa' },
  { value: 'Custom', label: '✨ Custom', color: '#f0abfc' },
];

export const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly (same weekday)' },
  { value: 'custom', label: 'Custom days' },
];

export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getCategoryColor(catName) {
  return CATEGORIES.find(c => c.value === catName)?.color || '#7c5cfc';
}

export const MOTIVATIONAL = {
  0: "Every journey starts with day one. Let's go! 🚀",
  1: "First check-in done! Keep the fire alive 🔥",
  3: "3-day streak! You're building a real habit 💪",
  7: "One week in! You're unstoppable 🌟",
  14: "Two weeks strong! Consistency is your superpower ⚡",
  21: "21 days — they say this is when habits form. You did it! 🏆",
  30: "30-day warrior! Legendary consistency 🥇",
  50: "50 days. Pure discipline. Respect 🫡",
  100: "100 DAYS. You're an absolute legend 👑",
};

export function getMotivationalMsg(streak) {
  const milestones = Object.keys(MOTIVATIONAL).map(Number).sort((a, b) => b - a);
  for (const m of milestones) {
    if (streak >= m) return MOTIVATIONAL[m];
  }
  return MOTIVATIONAL[0];
}
