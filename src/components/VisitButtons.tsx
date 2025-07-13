import React, { useState, useRef } from 'react';
import { getCurrentLocation } from '../services/geolocation';
import { Schedule } from '../types/types';

interface VisitButtonsProps {
  schedule: Schedule;
  onVisitStart: () => void;
  onVisitEnd: () => void;
}

const VisitButtons: React.FC<VisitButtonsProps> = ({ schedule, onVisitStart, onVisitEnd }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartVisit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { latitude, longitude } = await getCurrentLocation();
      await onVisitStart();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError((err as Error).message);
    }
  };

  const handleEndVisit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { latitude, longitude } = await getCurrentLocation();
      await onVisitEnd();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError((err as Error).message);
    }
  };

  return (
    <div className="mb-6">
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="flex space-x-4">
        {schedule.status === 'upcoming' && (
          <button
            onClick={handleStartVisit}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Starting...' : 'Start Visit'}
          </button>
        )}
        {schedule.status === 'in-progress' && (
          <button
            onClick={handleEndVisit}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300"
          >
            {isLoading ? 'Ending...' : 'End Visit'}
          </button>
        )}
      </div>
    </div>
  );
};

export default VisitButtons;