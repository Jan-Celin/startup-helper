import React, { useState, useEffect } from 'react';
import Milestone from './Milestone';
import ProgressBar from './ProgressBar';
import { fetchMilestones, updateTask } from '../../services/api';
import Chat from '../chat/Chat';

export default function Dashboard() {
  const [milestones, setMilestones] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    fetchMilestones()
      .then(data => {
        setMilestones(data);
        calculateProgress(data);
      })
      .catch(error => console.error('Error fetching milestones:', error));
  }, []);

  const calculateProgress = (milestoneData) => {
    const totalTasks = milestoneData.reduce((sum, m) => sum + m.tasks.length, 0);
    const completedTasks = milestoneData.reduce(
      (sum, m) => sum + m.tasks.filter(t => t.completed).length, 
      0
    );
    setOverallProgress(Math.round((completedTasks / totalTasks) * 100));
  };

  const handleTaskUpdate = async (taskId, completed) => {
    try {
      console.log('Updating task:', { taskId, completed });
      await updateTask(taskId, completed);
      
      const updatedMilestones = milestones.map(milestone => ({
        ...milestone,
        tasks: milestone.tasks.map(task =>
          task.id === taskId ? { ...task, completed: completed } : task
        )
      }));
  
      setMilestones(updatedMilestones);
      calculateProgress(updatedMilestones);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Pregled stanja</h2>
        <ProgressBar progress={overallProgress} />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Miljokazi</h3>
        <div className="space-y-4">
          {milestones.map(milestone => (
            <Milestone
              key={milestone.id}
              milestone={milestone}
              onTaskUpdate={handleTaskUpdate}
            />
          ))}
        </div>
      </div>

      <Chat />
    </div>
  );
}