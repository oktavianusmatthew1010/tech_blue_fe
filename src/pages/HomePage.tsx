import React, { useEffect, useState } from 'react';
import { Schedule } from '../types/types';
import { fetchAllSchedules, fetchTodaySchedules } from '../services/api';
import ScheduleCard from '../components/ScheduleCard';
import StatsCard from '../components/StatsCard';
import { useNavigate } from 'react-router-dom';
import { formatTime } from '../utils/helpers';
import './HomePage.css';
import { addSchedule } from '../utils/storage';
import AddScheduleModal from '../components/AddScheduleModal';

const HomePage: React.FC = () => {
  const [allSchedules, setAllSchedules] = useState<Schedule[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [all, today] = await Promise.all([
          fetchAllSchedules(),
          fetchTodaySchedules(),
        ]);
        setAllSchedules(all);
        setTodaySchedules(today);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddSchedule = (newSchedule: Schedule) => {
    try {
      const updatedSchedules = addSchedule(newSchedule);
      setAllSchedules(updatedSchedules);

      // Check if the new schedule is for today
      const today = new Date().toISOString().split('T')[0];
      if (newSchedule.dateService.includes(today)) {
        setTodaySchedules([...todaySchedules, newSchedule]);
      }

      setShowAddModal(false);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const stats = {
    total: allSchedules.length,
    missed: allSchedules.filter(s => s.status === 'missed').length,
    upcoming: todaySchedules.filter(s => s.status === 'upcoming').length,
    completed: todaySchedules.filter(s => s.status === 'completed').length,
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="home-page">
      <h4 className="font-bold mb-6 ">Caregiver Dashboard</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="grid grid-cols-3 gap-2 mb-6 ">
          <StatsCard count={stats.missed} label="Missed Scheduled" color="text-red-500" />
          <div className="welcome-header">
            <StatsCard count={stats.upcoming} label="Upcoming Today's Schedule" color="text-orange-500" />
            <StatsCard count={stats.completed} label="Today's Completed Schedule" color="text-green-500" />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Today's Schedules</h2>
      {allSchedules.length === 0 ? (
        <p>No schedules for today</p>
      ) : (
        <div className="space-y-4">
          {allSchedules.map(schedule => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onClick={() => navigate(`/schedule/${schedule.id}`)}
            />
          ))}
        </div>
      )}
      {showAddModal && (
        <AddScheduleModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddSchedule}
        />
      )}
    </div>
  );
};

export default HomePage;