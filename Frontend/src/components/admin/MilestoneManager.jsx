import React, { useState, useEffect } from 'react';
import { 
  fetchMilestones, 
  createMilestone, 
  updateMilestone, 
  deleteMilestone,
  updateTask,
  createTask,
  deleteTask
} from '../../services/api';

function MilestoneManager() {
  const [milestones, setMilestones] = useState([]);
  const [editingMilestoneId, setEditingMilestoneId] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState({ name: '', description: '' });
  const [taskForms, setTaskForms] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    try {
      const data = await fetchMilestones();
      setMilestones(data);

      const initialTaskForms = {};
      data.forEach(milestone => {
        initialTaskForms[milestone.id] = { name: '', description: '' };
      });
      setTaskForms(initialTaskForms);
      setError(null);
    } catch (error) {
      setError('Greška pri učitavanju miljokaza: ' + error.message);
      console.error('Error loading milestones:', error);
    }
  };

  const handleMilestoneChange = (field, value) => {
    setMilestoneForm({ ...milestoneForm, [field]: value });
  };

  const handleMilestoneSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMilestoneId) {
        await updateMilestone(editingMilestoneId, milestoneForm);
      } else {
        await createMilestone(milestoneForm);
      }
      loadMilestones();
      setEditingMilestoneId(null);
      setMilestoneForm({ name: '', description: '' });
      setError(null);
    } catch (error) {
      setError('Greška pri uređivanju miljokaza: ' + error.message);
      console.error('Error saving milestone:', error);
    }
  };

  const handleEditMilestone = (milestone) => {
    setEditingMilestoneId(milestone.id);
    setMilestoneForm({ name: milestone.name, description: milestone.description });
  };

  const handleDeleteMilestone = async (id) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovaj miljokaz?')) return;
    try {
      await deleteMilestone(id);
      loadMilestones();
      setError(null);
    } catch (error) {
      setError('Greška pri brisanju miljokaza: ' + error.message);
      console.error('Error deleting milestone:', error);
    }
  };

  const handleTaskChange = (milestoneId, field, value) => {
    setTaskForms(prev => ({
      ...prev,
      [milestoneId]: {
        ...prev[milestoneId],
        [field]: value
      }
    }));
  };

  const handleTaskSubmit = async (milestoneId) => {
    try {
      const taskData = taskForms[milestoneId];
      if (!taskData.name.trim()) {
        setError('Task name is required');
        return;
      }

      await createTask(milestoneId, taskData);

      // Reset the task form for this milestone
      setTaskForms(prev => ({
        ...prev,
        [milestoneId]: { name: '', description: '' }
      }));

      // Reload milestones to get updated data
      await loadMilestones();
      setError(null);
    } catch (error) {
      setError('Error creating task: ' + error.message);
      console.error('Error creating task:', error);
    }
  };

  const handleDeleteTask = async (milestoneId, taskId) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovaj zadatak?')) return;
    try {
      await deleteTask(taskId);
      await loadMilestones();
      setError(null);
    } catch (error) {
      setError('Error deleting task: ' + error.message);
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    try {
      await updateTask(taskId, completed);
      await loadMilestones();
      setError(null);
    } catch (error) {
      setError('Error updating task: ' + error.message);
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <form onSubmit={handleMilestoneSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <h3 className="text-lg font-medium">
          {editingMilestoneId ? 'Uredite miljokaz' : 'Dodajte novi miljokaz'}
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700">Naziv</label>
          <input
            type="text"
            value={milestoneForm.name}
            onChange={(e) => handleMilestoneChange('name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            placeholder='Naziv miljokaza'
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Opis</label>
          <textarea
            value={milestoneForm.description}
            onChange={(e) => handleMilestoneChange('description', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder='Opis miljokaza'
          />
        </div>

        <div className="flex space-x-2">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {editingMilestoneId ? 'Uredi' : 'Dodaj'}
          </button>
          {editingMilestoneId && (
            <button
              type="button"
              onClick={() => {
                setEditingMilestoneId(null);
                setMilestoneForm({ name: '', description: '' });
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Odustani
            </button>
          )}
        </div>
      </form>

      {milestones.map((milestone) => (
        <div key={milestone.id} className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-lg">{milestone.name}</h4>
              <p className="text-gray-600">{milestone.description}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEditMilestone(milestone)}
                className="text-blue-600 hover:text-blue-800"
              >
                Uredi
              </button>
              <button
                onClick={() => handleDeleteMilestone(milestone.id)}
                className="text-red-600 hover:text-red-800"
              >
                Obriši
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h5 className="font-medium text-gray-800">Zadatci</h5>
            <ul className="space-y-2">
              {milestone.tasks?.map(task => (
                <li key={task.id} className="flex justify-between items-center p-2 border-l-4 border-gray-300 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleToggleTask(task.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <div>
                      <h6 className="font-medium">{task.name}</h6>
                      <p className="text-gray-600 text-sm">{task.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteTask(milestone.id, task.id)} 
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Obriši
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-2 flex space-x-2">
              <input
                type="text"
                placeholder="Naziv zadatka"
                value={taskForms[milestone.id]?.name || ''}
                onChange={(e) => handleTaskChange(milestone.id, 'name', e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Opis zadatka"
                value={taskForms[milestone.id]?.description || ''}
                onChange={(e) => handleTaskChange(milestone.id, 'description', e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
              <button 
                onClick={() => handleTaskSubmit(milestone.id)} 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Dodaj
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export { MilestoneManager };