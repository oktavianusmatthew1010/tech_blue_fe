import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import './index.css';
import ScheduleCompleted from './pages/ScheduleComplate';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedule/:id" element={<SchedulePage />} />
          <Route path="/schedule-complete/:id" element={<ScheduleCompleted />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;