import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Schedule } from '../types/types';
import { fetchScheduleDetails, startVisit, endVisit, updateTask } from '../services/api';
import VisitButtons from '../components/VisitButtons';
import TaskItem from '../components/TaskItem';
import { formatScheduleDate, formatScheduleTime } from '../utils/dateHelpers';
// import { FaCalendarAlt, FaClock, FaEnvelope, FaPhone } from 'react-icons/fa';
import './SchedulePage.css';
const SchedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setLoading(true);
        const data = await fetchScheduleDetails(id!);
        setSchedule(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };
    loadSchedule();
  }, [id]);

  const handleStartVisit = async (lat: number, lng: number) => {
    try {
      const updatedSchedule = await startVisit(id!, lat, lng);
      setSchedule(updatedSchedule);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEndVisit = async (lat: number, lng: number) => {
    try {
      const updatedSchedule = await endVisit(id!, lat, lng);
      setSchedule(updatedSchedule);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleTaskUpdate = async (taskId: string, completed: boolean, reason?: string) => {
    try {
      const updatedSchedule = await updateTask(taskId, completed, reason);
      setSchedule(updatedSchedule);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!schedule) return <div>Schedule not found</div>;

  return (
    <div className="container">
      <button 
        onClick={() => navigate(-1)}
        className="back-button"
      >
        &larr; Back
      </button>

      <h2 className="heading">Schedule Details</h2>

      <div className="profile-card ">
        <p className="profile-card p:first-child">{schedule.tasks[0]?.description || 'Service Name A'}</p>
        <img src={schedule.imageUrl} className="avatar" alt={schedule.clientName} />
        <p className="client-name">{schedule.clientName}</p>
        <div className="datetime-badge">
          <span className="flex items-center gap-1"> {formatScheduleDate(schedule.startTime)}</span>
          <span>|</span>
          <span className="flex items-center gap-1"> {formatScheduleTime(schedule.startTime)} - {formatScheduleTime(schedule.endTime)}</span>
        </div>
      </div>

      <div className="contact-section">
        <p className="section-title">Client Contact:</p>
        <p className="contact-line svg"> {schedule.emailAddress}</p>
        <p className="contact-line svg"> {schedule.phone}</p>
      </div>

      <div className="address-section">
        <p className="section-title">Address:</p>
        <p className="contact-line svg">{schedule.location.address}</p>
      </div>

      <div className="tasks-section">
        <p className="section-title">Tasks:</p>
        <div className="tasks-section">
          {schedule.tasks.map(task => (
            <div key={task.id} className="task-card">
              <p className="task-card-title">{task.taskName}</p>
              <p className="task-card-description">{task.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="notes-section">
        <p className="section-title">Service Notes</p>
        <p className="notes-section">
          {schedule.serviceNote}
        </p>
      </div>

      <button
        onClick={() => handleStartVisit(0, 0)}
        className="action-button"
      >
        Clock-In Now
      </button>
    </div>
  );
};

export default SchedulePage;
