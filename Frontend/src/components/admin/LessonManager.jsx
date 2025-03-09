import React, { useState, useEffect } from 'react';
import { 
  fetchCategories, 
  createLesson, 
  updateLesson, 
  deleteLesson,
  fetchLesson,
  createCategory,
  deleteCategory,
  updateCategory
} from '../../services/api';

function LessonManager() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    categoryId: ''
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
      setError(null);
    } catch (error) {
      setError('Greška pri učitavanju cjelina: ' + error.message);
      console.error('Error loading categories:', error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        categoryForm.slug = editingCategory.slug;
        
        console.log("LessonManager.jsx editingCategory", editingCategory);
        if (categories.find(category => category.name === categoryForm.name && category.slug !== editingCategory.slug)) {
          throw new Error('Cjelina s tim nazivom već postoji');
        }
        
        var response = await updateCategory(categoryForm.slug, categoryForm);

        if (!response.status_code == 201 || !response.status_code == 201) {
          throw new Error('Failed to update category');
        }

        await loadCategories();
        resetCategoryForm();
        setError(null);
      } else {
        if (!categoryForm.name) {
          throw new Error('Naziv cjeline je obavezan');
        }
          categoryForm.slug = categoryForm.name.toLowerCase().replace(/\s+/g, '-');

          var response = await createCategory(categoryForm);

          if (!response.status_code == 201 || !response.status_code == 201) {
            throw new Error('Failed to save category');
          }

          await loadCategories();
          resetCategoryForm();
          setError(null);
      }
      
    } catch (error) {
      setError('Pogreška pri spremanju cjeline: ' + error.message);
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovu cjelinu? Sve njezine lekcije bit će obrisane.')) {
      return;
    }

    try {
      const slug = categories.find(category => category.id === categoryId).slug;
      const response = await deleteCategory(slug);

      if (!response.status_code == 201 || !response.status_code == 201) {
        throw new Error('Failed to delete category');
      }

      await loadCategories();
      setError(null);
    } catch (error) {
      setError('Pogreška pri brisanju cjeline: ' + error.message);
      console.error('Error deleting category:', error);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || ''
    });
  };

  const resetCategoryForm = () => {
    setCategoryForm({ name: '', description: '' });
    setEditingCategory(null);
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateLesson(selectedLesson.slug, lessonForm);
      } else {
        await createLesson(lessonForm);
      }
      await loadCategories();
      resetLessonForm();
      setError(null);
    } catch (error) {
      setError('Pogreška pri spremanju lekcije: ' + error.message);
      console.error('Error saving lesson:', error);
    }
  };

  const handleDeleteLesson = async (slug) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovu lekciju?')) return;
    
    try {
      await deleteLesson(slug);
      await loadCategories();
      setError(null);
    } catch (error) {
      setError('Pogreška pri brisanju lekcije: ' + error.message);
      console.error('Error deleting lesson:', error);
    }
  };

  const handleEditLesson = async (lesson, category) => {
    try {
      const lessonData = await fetchLesson(lesson.slug);
      setSelectedLesson(lesson);
      setLessonForm({
        title: lesson.title,
        content: lessonData.content,
        categoryId: category.id
      });
      setIsEditing(true);
      setError(null);
    } catch (error) {
      setError('Pogreška pri učitavanju lekcije: ' + error.message);
      console.error('Error loading lesson:', error);
    }
  };

  const resetLessonForm = () => {
    setLessonForm({ title: '', content: '', categoryId: '' });
    setSelectedLesson(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <form onSubmit={handleLessonSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium">
          {isEditing ? 'Uredite lekciju' : 'Dodajte novu lekciju'}
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Naslov</label>
          <input
            type="text"
            value={lessonForm.title}
            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
            required
            placeholder='Naslov lekcije'
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cjelina</label>
          <select
            value={lessonForm.categoryId}
            onChange={(e) => setLessonForm({ ...lessonForm, categoryId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-2 py-1"
            required
          >
            <option value="">Odaberite cjelinu</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Sadržaj</label>
          <textarea
            value={lessonForm.content}
            onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={10}
            required
            placeholder='Ovdje unesite sadržaj lekcije'
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditing ? 'Uredi' : 'Dodaj'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetLessonForm}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Odustani
            </button>
          )}
        </div>
      </form>

      <div className="bg-white shadow rounded-lg p-4">
        {categories.map(category => (
          <div key={category.id} className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-600 text-sm">{category.description}</p>
                )}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Uredi
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Obriši
                </button>
              </div>
            </div>
            
            <ul className="mt-2 space-y-2">
              {category.lessons?.map(lesson => (
                <li 
                  key={lesson.id} 
                  className="pl-6 border-l-4 border-gray-300 bg-gray-50 py-3 px-4 flex items-center justify-between rounded-md"
                >
                  <h4 className="text-gray-700 font-medium">{lesson.title}</h4>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditLesson(lesson, category)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Uredi
                    </button>
                    <button
                      onClick={() => handleDeleteLesson(lesson.slug)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Obriši
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <form onSubmit={handleCategorySubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium">
          {editingCategory ? 'Uredite cjelinu' : 'Dodajte novu cjelinu'}
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Naziv cjeline</label>
          <input
            type="text"
            value={categoryForm.name}
            onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
            required
            placeholder='Naziv cjeline'
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Opis cjeline</label>
          <textarea
            value={categoryForm.description}
            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder='Opis cjeline'
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {editingCategory ? 'Uredi' : 'Dodaj'}
          </button>
          {editingCategory && (
            <button
              type="button"
              onClick={resetCategoryForm}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Odustani
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export { LessonManager };