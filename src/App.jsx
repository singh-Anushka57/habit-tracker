import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HabitProvider } from './hooks/useHabits';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import Home from './pages/Home';
import DailyDashboard from './pages/DailyDashboard';
import AddHabitForm from './pages/AddHabitForm';
import ConsistencyGrid from './pages/ConsistencyGrid';
import Insights from './pages/Insights';
import About from './pages/About';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <HabitProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<DailyDashboard />} />
          <Route path="/add-habit" element={<AddHabitForm />} />
          <Route path="/my-habits" element={<DailyDashboard />} />
          <Route path="/consistency" element={<ConsistencyGrid />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </HabitProvider>
  );
}
