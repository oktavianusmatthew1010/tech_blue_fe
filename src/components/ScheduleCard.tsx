import React, { useRef } from 'react';
import { Schedule } from '../types/types';
import { formatTime, getStatusColor } from '../utils/helpers';
import './ScheduleCard.css';
import { formatScheduleDate, formatScheduleTime } from '../utils/dateHelpers';

interface ScheduleCardProps {
  schedule: Schedule;
  onClick: () => void;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule, onClick }) => {
  const statusColor = getStatusColor(schedule.status);

  return (
    <div
      className="schedule-card"
      onClick={onClick}
    >
      <span className={`status-badge bg-${statusColor}-100 text-${statusColor}-800`}>
        {schedule.status}
      </span>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex flex-col items-center">

          </div>
          <div className="client-profile">
            <img src={schedule.imageUrl} alt={schedule.clientName} width={40} className="avatar-pic" />
            <div className="client-info">
              <div className="client-name">{schedule.clientName}</div>
              <div className="service-name">{schedule.serviceName}</div>
            </div>
          </div>

          <p className="text-gray-600">{schedule.location.address}</p>

          <div className="datetime-badge">
            <span className="flex items-center gap-1"> {formatScheduleDate(schedule.startTime)}</span>
            <span>|</span>
            <span className="flex items-center gap-1"> {formatScheduleTime(schedule.startTime)} - {formatScheduleTime(schedule.endTime)}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScheduleCard;