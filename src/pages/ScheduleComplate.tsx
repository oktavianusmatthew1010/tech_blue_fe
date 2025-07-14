import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ScheduleComplate.css';
import { Schedule } from '../types/types';
import { fetchScheduleDetails } from '../services/api';
import { formatScheduleDate, formatScheduleTime } from '../utils/dateHelpers';

const ScheduleCompleted: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    const loadSchedule = async () => {
      try {

        const data = await fetchScheduleDetails(id!);
        setSchedule(data);



      } catch (err) {
        setError((err as Error).message);

      }
    };
    loadSchedule();
  }, [id]);
  return (
    <div className="schedule-completed-container">


      <div className="completion-status">Schedule Completed</div>

      <div className="schedule-details">
        <div className={`date-row ${schedule?.status ? 'completed' : ''}`}>
         
          <span>{schedule?.serviceName}</span>
        </div>

        
        
        
      </div>

      <button
        className="home-button"
        onClick={() => navigate('/')}
      >
        Go to Home
      </button>
    </div>
  );
};

export default ScheduleCompleted;