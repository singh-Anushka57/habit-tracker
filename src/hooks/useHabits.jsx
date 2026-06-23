import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { loadHabits, saveHabits } from '../utils/storage';
import { todayStr } from '../utils/dateUtils';

const HabitContext = createContext(null);

export function HabitProvider({ children }) {
  const [habits, setHabits] = useState(() => loadHabits());
  const [toasts, setToasts] = useState([]);

  // Persist on every change
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const addHabit = useCallback((habitData) => {
    const newHabit = {
      id: crypto.randomUUID(),
      createdAt: todayStr(),
      checkIns: {},
      frozenDates: [],
      pomodoroSessions: [],
      ...habitData,
    };
    setHabits(prev => [...prev, newHabit]);
    addToast(`"${habitData.name}" added!`, 'success');
    return newHabit.id;
  }, [addToast]);

  const updateHabit = useCallback((id, updates) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    addToast('Habit updated.', 'info');
  }, [addToast]);

  const deleteHabit = useCallback((id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    addToast('Habit removed.', 'error');
  }, [addToast]);

  const toggleCheckIn = useCallback((id, date = todayStr()) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const current = !!(h.checkIns || {})[date];
      return {
        ...h,
        checkIns: { ...h.checkIns, [date]: !current }
      };
    }));
  }, []);

  const freezeDate = useCallback((id, date) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h;
      const frozen = h.frozenDates || [];
      if (frozen.includes(date)) return h;
      return { ...h, frozenDates: [...frozen, date] };
    }));
  }, []);

  const addPomodoroSession = useCallback((habitId, duration) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== habitId) return h;
      const sessions = h.pomodoroSessions || [];
      return {
        ...h,
        pomodoroSessions: [...sessions, { date: todayStr(), duration, completedAt: new Date().toISOString() }]
      };
    }));
  }, []);

  return (
    <HabitContext.Provider value={{
      habits,
      toasts,
      addToast,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleCheckIn,
      freezeDate,
      addPomodoroSession,
    }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitContext);
  if (!ctx) throw new Error('useHabits must be inside HabitProvider');
  return ctx;
}
