import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', exact: true },
  { to: '/dashboard', label: 'My Habits' },
  { to: '/consistency', label: 'Grid' },
  { to: '/insights', label: 'Insights' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => { setOpen(false); }, [location]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="nav-inner container">
        <NavLink to="/" className="nav-logo">
          <span className="nav-logo-flame animate-flame">🔥</span>
          <span className="nav-logo-text">StreakForge</span>
        </NavLink>

        <ul className={`nav-links${open ? ' open' : ''}`}>
          {NAV_LINKS.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.exact}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/add-habit" className="btn btn-primary btn-sm">
              + New Habit
            </NavLink>
          </li>
        </ul>

        <button
          className={`hamburger${open ? ' open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>
      </div>

      {open && <div className="nav-backdrop" onClick={() => setOpen(false)} />}
    </nav>
  );
}
