import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchCategoryLessons } from '../../services/api';
import Chat from '../chat/Chat';

export default function CategoryLessons() {
  const [lessons, setLessons] = useState([]);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  
  useEffect(() => {
    fetchCategoryLessons(slug)
      .then(setLessons)
      .catch(err => {
        console.error('Error fetching lessons:', err);
        setError('Nije moguće učitati lekcije.');
      });
  }, [slug]);

  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <Link to="/materijali" className="text-blue-600 hover:text-blue-800">
        ← Nazad na kategorije
      </Link>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map(lesson => (
          <Link 
            key={lesson.id}
            to={`/materijali/lekcija/${lesson.slug}`}
            className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-3">{lesson.title}</h3>
            <p className="text-gray-600">{lesson.description}</p>
          </Link>
        ))}
        {lessons.length === 0 && <p className="text-gray-500">Nema lekcija u ovoj cjelini.</p>}
      </div>
      <Chat />
    </div>
  );
}