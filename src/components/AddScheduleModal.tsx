// components/AddScheduleModal.tsx
import React, { useState } from 'react';
import { Schedule, Task } from '../types/types';
import './AddScheduleModal.css';

interface AddScheduleModalProps {
  onClose: () => void;
  onSave: (schedule: Schedule) => void;
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState<Omit<Schedule, 'id' | 'status'>>({
    caregiverId: '',
    clientName: '',
    serviceName: '',
    imageUrl: '',
    emailAddress: '',
    phone: '',
    dateService: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    serviceNote: '',
    location: {
      address: '',
      latitude: 0,
      longitude: 0,
    },
    tasks: [],
  });

  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'scheduleID'>>({
    scheduleId:'',
    taskName: '',
    description: '',
    completed: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: name === 'address' ? value : Number(value),
      },
    }));
  };

  const handleAddTask = () => {
    if (newTask.taskName && newTask.description) {
      setFormData(prev => ({
        ...prev,
        tasks: [
          ...prev.tasks,
          {
            ...newTask,
            id: `task-${Date.now()}`,
            scheduleID: '', // Will be set when saving
          },
        ],
      }));
      setNewTask({scheduleId:'', taskName: '', description: '', completed: false });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: Schedule = {
      ...formData,
      id: `schedule-${Date.now()}`,
      status: 'upcoming',
      tasks: formData.tasks.map(task => ({
        ...task,
        scheduleID: `schedule-${Date.now()}`,
      })),
    };
    onSave(newSchedule);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Schedule</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Service Name</label>
            <input
              type="text"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="dateService"
              value={formData.dateService}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.location.address}
              onChange={handleLocationChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Latitude</label>
              <input
                type="number"
                name="latitude"
                value={formData.location.latitude}
                onChange={handleLocationChange}
                step="any"
              />
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input
                type="number"
                name="longitude"
                value={formData.location.longitude}
                onChange={handleLocationChange}
                step="any"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Service Note</label>
            <textarea
              name="serviceNote"
              value={formData.serviceNote}
              onChange={handleInputChange}
            />
          </div>

          <div className="tasks-section">
            <h3>Tasks</h3>
            <div className="add-task">
              <input
                type="text"
                placeholder="Task name"
                value={newTask.taskName}
                onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              />
              <button type="button" onClick={handleAddTask}>
                Add Task
              </button>
            </div>

            {formData.tasks.length > 0 && (
              <ul className="task-list">
                {formData.tasks.map((task, index) => (
                  <li key={index}>
                    <strong>{task.taskName}</strong>: {task.description}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScheduleModal;