import { useNavigate } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="page-wrapper not-found-page">
      <div className="container not-found-container">
        <div className="not-found-glitch animate-fade-up">
          <span className="nf-code" data-text="404">404</span>
        </div>
        <h1 className="animate-fade-up">Lost your streak?</h1>
        <p className="animate-fade-up">This page doesn't exist — but your habits do. Let's get you back.</p>
        <div className="nf-actions animate-fade-up">
          <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>My Habits</button>
        </div>
      </div>
    </div>
  );
}
