const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const authHeader = localStorage.getItem('token') 
  ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  : {};

export const fetchMilestones = async () => {
  console.log("trying...");
  console.log(authHeader);
  const response = await fetch(`${API_BASE_URL}/milestones/`,
  {
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
  }
  );
  if (!response.ok) throw new Error('Failed to fetch milestones');
  console.log(response);
  return response.json();
};

export const createTask = async (milestoneId, taskData) => {
  const response = await fetch(`${API_BASE_URL}/milestones/${milestoneId}/tasks/add`, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
};

export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_BASE_URL}/tasks/delete/${taskId}`, {
    method: 'DELETE',
    headers: authHeader
  });
  if (!response.ok) throw new Error('Failed to delete task');
  return response.json();
};

export const updateTask = async (taskId, completed) => {
  const response = await fetch(`${API_BASE_URL}/tasks/update/${taskId}`, {
    method: 'PUT',
    headers: { 
      ...authHeader,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ completed })
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};


export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    }
  });
  console.log(response);
  const data = await response.json();
  return data;
};

export const fetchCategoryLessons = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/categories/${slug}`, {
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data.data.lessons;
};

export const fetchLesson = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/lessons/${slug}`, {
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data.data;
};

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 
      ...authHeader,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ email, password })
  });
  console.log(response);
  if (!response.ok) throw new Error('Neispravna email adresa ili zaporka.');
  return response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 
      ...authHeader,
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(userData)
  });
  console.log(response);
  if (!response.ok) throw new Error('Greška prilikom registracije.');
  return response.json();
};

export const createLesson = async (lessonData) => {
  const response = await fetch(`${API_BASE_URL}/lessons/add`, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(lessonData)
  });
  if (!response.ok) throw new Error('Failed to create lesson');
  return response.json();
};

export const updateLesson = async (slug, lessonData) => {
  const response = await fetch(`${API_BASE_URL}/lessons/update/${slug}`, {
    method: 'PUT',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(lessonData)
  });
  if (!response.ok) throw new Error('Failed to update lesson');
  return response.json();
};

export const deleteLesson = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/lessons/delete/${slug}`, {
    method: 'DELETE',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) throw new Error('Failed to delete lesson');
  return response.json();
};

export const createMilestone = async (milestoneData) => {
  const response = await fetch(`${API_BASE_URL}/milestones/add`, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(milestoneData)
  });
  if (!response.ok) throw new Error('Failed to create milestone');
  return response.json();
};

export const updateMilestone = async (milestoneId, milestoneData) => {
  const response = await fetch(`${API_BASE_URL}/milestones/update/${milestoneId}`, {
    method: 'PUT',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(milestoneData)
  });
  if (!response.ok) throw new Error('Failed to update milestone');
  return response.json();
};

export const deleteMilestone = async (milestoneId) => {
  const response = await fetch(`${API_BASE_URL}/milestones/delete/${milestoneId}`, {
    method: 'DELETE',
    headers: authHeader
  });
  if (!response.ok) throw new Error('Failed to delete milestone');
  return response.json();
};

export const createCategory = async (categoryData) => {
  const response = await fetch(`${API_BASE_URL}/categories/add`, {
    method: 'POST',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(categoryData)
  });
  if (!response.ok) throw new Error('Failed to create category');
  return response.json();
};

export const updateCategory = async (slug, categoryData) => {
  console.log("api.js", slug, categoryData);
  const response = await fetch(`${API_BASE_URL}/categories/update/${slug}`, {
    method: 'PUT',
    headers: {
      ...authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(categoryData)
  });
  if (!response.ok) throw new Error('Failed to update category');
  return response.json();
};

export const deleteCategory = async (slug) => {
  const response = await fetch(`${API_BASE_URL}/categories/delete/${slug}`, {
    method: 'DELETE',
    headers: authHeader
  });
  if (!response.ok) throw new Error('Failed to delete category');
  return response.json();
}