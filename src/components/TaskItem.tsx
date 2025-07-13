import React, { useState, useRef  } from 'react';
import { Task } from '../types/types';

interface TaskItemProps {
  task: Task;
  onUpdate: (completed: boolean, reason?: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [reason, setReason] = useState(task.reason || '');

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const completed = e.target.checked;
    if (completed) {
      onUpdate(true);
    } else {
      setIsEditing(true);
    }
  };

  const handleReasonSubmit = () => {
    onUpdate(false, reason);
    setIsEditing(false);
  };

  return (
    <div className="p-3 border-b border-gray-200">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleCheckboxChange}
          className="h-5 w-5 text-blue-500 rounded"
        />
        <span className={`ml-3 ${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.description}
        </span>
      </div>
      
      {!task.completed && task.reason && (
        <div className="mt-2 text-sm text-gray-500">
          <strong>Reason:</strong> {task.reason}
        </div>
      )}
      
      {isEditing && (
        <div className="mt-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for not completing"
            className="w-full p-2 border rounded"
            rows={2}
          />
          <button
            onClick={handleReasonSubmit}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;