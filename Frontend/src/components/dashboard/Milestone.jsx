import React, { useState } from 'react';

export default function Milestone({ milestone, onTaskUpdate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const completedTasks = milestone.tasks.filter(t => t.completed).length;
  const progress = Math.round((completedTasks / milestone.tasks.length) * 100);

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium">{milestone.name}</h3>
        <span>{completedTasks}/{milestone.tasks.length}</span>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-2">
          {milestone.tasks.length === 0 ? (
            <p className="text-gray-500">Nema zadataka za ovaj miljokaz.</p>
          ) : (
          milestone.tasks.map(task => (
            <div key={task.id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={!!task.completed}
                onChange={(e) => onTaskUpdate(task.id, e.target.checked)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                {task.name}
              </span>
            </div>
          )))}
        </div>
      )}
    </div>
  );
}
