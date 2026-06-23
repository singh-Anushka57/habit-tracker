import { useHabits } from '../hooks/useHabits';

const ICONS = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

export default function ToastContainer() {
  const { toasts } = useHabits();
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{ICONS[t.type] || '💬'}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
