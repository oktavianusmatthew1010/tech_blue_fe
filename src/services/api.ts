import { Schedule, Task } from '../types/types';

const API_URL = 'http://localhost:8080';

export const fetchAllSchedules = async (): Promise<Schedule[]> => {
  const response = await fetch(`${API_URL}/schedules`);
  if (!response.ok) {
    throw new Error('Failed to fetch schedules');
  }
  return response.json();
};

export const fetchTodaySchedules = async (): Promise<Schedule[]> => {
  const response = await fetch(`${API_URL}/schedules/today`);
  if (!response.ok) {
    throw new Error('Failed to fetch today\'s schedules');
  }
  return response.json();
};

export const fetchScheduleDetails = async (id: string): Promise<Schedule> => {
  const response = await fetch(`${API_URL}/schedules/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch schedule details');
  }
  return response.json();
};

export const startVisit = async (id: string, lat: number, lng: number): Promise<Schedule> => {
  const response = await fetch(`${API_URL}/schedules/${id}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ latitude: lat, longitude: lng }),
  });
  if (!response.ok) {
    throw new Error('Failed to start visit');
  }
  return response.json();
};

export const endVisit = async (id: string, lat: number, lng: number): Promise<Schedule> => {
  const response = await fetch(`${API_URL}/schedules/${id}/end`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ latitude: lat, longitude: lng }),
  });
  if (!response.ok) {
    throw new Error('Failed to end visit');
  }
  return response.json();
};

export const updateTask = async (taskId: string, completed: boolean, reason?: string): Promise<Schedule> => {
  const response = await fetch(`${API_URL}/tasks/${taskId}/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed, reason }),
  });
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  return response.json();
};

