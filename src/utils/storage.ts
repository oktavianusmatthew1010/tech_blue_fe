import { Schedule } from "../types/types";

const SCHEDULES_KEY = 'caregiver_schedules';

export const getSchedules = (): Schedule[] => {
  const data = localStorage.getItem(SCHEDULES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSchedules = (schedules: Schedule[]) => {
  localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
};

export const addSchedule = (schedule: Schedule) => {
  const schedules = getSchedules();
  schedules.push(schedule);
  saveSchedules(schedules);
  return schedules;
};