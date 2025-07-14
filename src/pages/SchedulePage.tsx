import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Schedule } from '../types/types';
import { fetchScheduleDetails, startVisit, endVisit, updateTask } from '../services/api';
import { formatScheduleDate, formatScheduleTime } from '../utils/dateHelpers';
import './SchedulePage.css';

const SchedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visitStatus, setVisitStatus] = useState<'not-started' | 'in-progress' | 'completed'>('not-started');
  const [canClockOut, setCanClockOut] = useState(false);
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setLoading(true);
        const data = await fetchScheduleDetails(id!);
        setSchedule(data);
        if (data.startVisit && !data.endVisit) {
          setVisitStatus('in-progress');
        } else if (data.endVisit) {
          setVisitStatus('completed');
        }

        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };
    loadSchedule();
  }, [id]);

  useEffect(() => {
    if (schedule && schedule.tasks) {
      const allTasksCompleted = schedule.tasks.every(task => task.completed);
      setCanClockOut(allTasksCompleted);
    }
  }, [schedule]);

  const handleStartVisit = async (lat: number, lng: number) => {
    try {
      const updatedSchedule = await startVisit(id!, lat, lng);
      setSchedule(updatedSchedule);
      setVisitStatus('in-progress');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEndVisit = async (lat: number, lng: number) => {
    try {
      const updatedSchedule = await endVisit(id!, lat, lng);
      setSchedule(updatedSchedule);
      setVisitStatus('completed');
      navigate(`/schedule-complete/${id}`);
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
              {visitStatus === 'in-progress' && (
                <div className="task-actions">
                  <div className="completion-options">
                    <label className={`option-label ${task.completed ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name={`task-${task.id}-completion`}
                        checked={task.completed}
                        onChange={() => handleTaskUpdate(task.id, true, '')}
                      />
                      <span>Yes</span>
                    </label>
                    <label className={`option-label ${!task.completed ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name={`task-${task.id}-completion`}
                        checked={!task.completed}
                        onChange={() => handleTaskUpdate(task.id, false, task.reason || '')}
                      />
                      <span>No</span>
                    </label>
                  </div>

                  {!task.completed && (
                    <div className="task-reason">
                      <label>Reason:</label>
                      <input
                        type="text"
                        value={task.reason || ''}
                        onChange={(e) => handleTaskUpdate(
                          task.id,
                          false,
                          e.target.value
                        )}
                        placeholder="Please specify reason"
                        required
                      />
                    </div>
                  )}
                </div>
              )}
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

      {visitStatus === 'not-started' && (
        <button
          onClick={() => handleStartVisit(0, 0)}
          className="action-button"
        >
          Clock-In Now
        </button>
      )}

      {visitStatus === 'in-progress' && (
        <div className="visit-in-progress">
          <p className="visit-status">Visit in progress</p>
          <div className="coordinates">
            <span>Latitude: {schedule.location.latitude.toFixed(6)}</span>
            <span> & Longitude: {schedule.location.longitude.toFixed(6)}</span>
            <img
              src={`https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=300&height=300&center=lonlat:${schedule.location.longitude},${schedule.location.latitude}&zoom=14&marker=lonlat:${schedule.location.longitude},${schedule.location.latitude};color:%23ff0000;size:42;text:1&apiKey=2570e9cd822147ea986f65953b0421c9`}
              alt="Location map"
              className="map-image"
            />


          </div>
          {!canClockOut && (
            <p className="incomplete-tasks-warning">
              Please complete all tasks before clocking out
            </p>
          )}
          <button
            onClick={() => handleEndVisit(0, 0)}
            className={`action-button `}

          >
            Clock-Out
          </button>
        </div>
      )}

      {visitStatus === 'completed' && (
        <div className="visit-completed">
          <p className="visit-status">Visit completed</p>
          <button
            onClick={() => navigate(`/schedule-complete/${id}`)}
            className="action-button view-summary"
          >
            View Summary
          </button>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;