import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHabits } from '../hooks/useHabits';
import { CATEGORIES, FREQUENCIES, DAY_LABELS } from '../data/constants';
import './AddHabitForm.css';

function validate(fields) {
  const errs = {};
  if (!fields.name.trim()) errs.name = 'Habit name is required.';
  else if (fields.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
  if (!fields.category) errs.category = 'Please pick a category.';
  if (!fields.frequency) errs.frequency = 'Please pick a frequency.';
  if (fields.frequency === 'custom' && (!fields.customDays || fields.customDays.length === 0))
    errs.customDays = 'Pick at least one day.';
  return errs;
}

export default function AddHabitForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addHabit, updateHabit, habits } = useHabits();

  // Edit mode support
  const editId = new URLSearchParams(location.search).get('edit');
  const editHabit = editId ? habits.find(h => h.id === editId) : null;

  const [fields, setFields] = useState({
    name: editHabit?.name || '',
    category: editHabit?.category || '',
    frequency: editHabit?.frequency || '',
    customDays: editHabit?.customDays || [],
    color: editHabit?.color || CATEGORIES[0].color,
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const errors = validate(fields);
  const isValid = Object.keys(errors).length === 0;

  function setField(key, val) {
    setFields(f => ({ ...f, [key]: val }));
  }

  function touch(key) {
    setTouched(t => ({ ...t, [key]: true }));
  }

  function toggleDay(idx) {
    setFields(f => {
      const days = f.customDays.includes(idx)
        ? f.customDays.filter(d => d !== idx)
        : [...f.customDays, idx];
      return { ...f, customDays: days };
    });
    touch('customDays');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ name: true, category: true, frequency: true, customDays: true });
    if (!isValid) return;

    setSubmitting(true);
    const catColor = CATEGORIES.find(c => c.value === fields.category)?.color || fields.color;

    if (editHabit) {
      updateHabit(editId, { ...fields, color: catColor });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } else {
      addHabit({ ...fields, color: catColor });
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    }
  }

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="container add-habit-container">
          <div className="success-splash animate-pop">
            <div className="success-icon">🎉</div>
            <h2>{editHabit ? 'Habit Updated!' : 'Habit Created!'}</h2>
            <p>Heading to your dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container add-habit-container">
        <div className="add-habit-header animate-fade-up">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>← Back</button>
          <div>
            <h1>{editHabit ? 'Edit Habit' : 'New Habit'}</h1>
            <p className="add-habit-sub">Define your routine before the streak begins.</p>
          </div>
        </div>

        <form className="add-habit-form card animate-fade-up" onSubmit={handleSubmit} noValidate>
          {/* Habit Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="habit-name">Habit Name</label>
            <input
              id="habit-name"
              type="text"
              className={`form-input${touched.name && errors.name ? ' error' : ''}`}
              placeholder="e.g. Morning run, Read 20 pages…"
              value={fields.name}
              onChange={e => setField('name', e.target.value)}
              onBlur={() => touch('name')}
              maxLength={60}
            />
            {touched.name && errors.name && (
              <span className="field-error animate-slide-in">⚠ {errors.name}</span>
            )}
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category</label>
            <div className="category-grid">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  className={`category-btn${fields.category === cat.value ? ' selected' : ''}`}
                  style={{ '--cat-color': cat.color }}
                  onClick={() => { setField('category', cat.value); setField('color', cat.color); touch('category'); }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {touched.category && errors.category && (
              <span className="field-error animate-slide-in">⚠ {errors.category}</span>
            )}
          </div>

          {/* Frequency */}
          <div className="form-group">
            <label className="form-label" htmlFor="habit-freq">Frequency</label>
            <select
              id="habit-freq"
              className={`form-select${touched.frequency && errors.frequency ? ' error' : ''}`}
              value={fields.frequency}
              onChange={e => { setField('frequency', e.target.value); touch('frequency'); }}
              onBlur={() => touch('frequency')}
            >
              <option value="">-- Choose frequency --</option>
              {FREQUENCIES.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            {touched.frequency && errors.frequency && (
              <span className="field-error animate-slide-in">⚠ {errors.frequency}</span>
            )}
          </div>

          {/* Custom days picker */}
          {fields.frequency === 'custom' && (
            <div className="form-group animate-slide-in">
              <label className="form-label">Which Days?</label>
              <div className="day-picker">
                {DAY_LABELS.map((day, idx) => (
                  <button
                    key={day}
                    type="button"
                    className={`day-btn${fields.customDays.includes(idx) ? ' selected' : ''}`}
                    onClick={() => toggleDay(idx)}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {touched.customDays && errors.customDays && (
                <span className="field-error animate-slide-in">⚠ {errors.customDays}</span>
              )}
            </div>
          )}

          {/* Color preview */}
          {fields.category && (
            <div className="color-preview animate-slide-in">
              <span className="color-dot" style={{ background: fields.color }} />
              <span className="form-label" style={{ margin: 0 }}>Color tag: {fields.category}</span>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isValid || submitting}
              title={!isValid ? 'Fill in all fields first' : ''}
            >
              {submitting ? 'Saving…' : editHabit ? 'Save Changes' : 'Add Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
