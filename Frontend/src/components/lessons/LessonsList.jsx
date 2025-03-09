import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../../services/api';
import Chat from '../chat/Chat';

export default function LessonsList() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(err => {
        console.error('Error fetching categories:', err);
        setError('Nije moguće učitati kategorije.');
      });
  }, []);

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Materijali</h1>
      
      {categories.map(category => (
        <section key={category.id} className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
          <p className="text-gray-700 mb-6">{category.description}</p>
          
          <Link 
            to={`/materijali/kategorija/${category.slug}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Pregledaj lekcije →
          </Link>
        </section>
      ))}
      <Chat />
    </div>
  );
}