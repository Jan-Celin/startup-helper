import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchLesson, fetchCategories } from '../../services/api';
import Chat from '../chat/Chat';

export default function LessonDetail() {
  const [lesson, setLesson] = useState(null);
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const lessonData = await fetchLesson(slug);
        setLesson(lessonData);
        
        const categories = await fetchCategories();
        const matchingCategory = categories.find(cat => cat.id === lessonData.category_id);
        setCategory(matchingCategory);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Nije moguće učitati podatke.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (error) return <div className="text-red-600">{error}</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!lesson || !category) return <div>No data available</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to={`/materijali/kategorija/${category.slug}`}
          className="text-blue-600 hover:text-blue-800"
        >
          ← Nazad na {category.name}
        </Link>
      </div>
      
      <article className="prose prose-lg max-w-none">
        <h1 className="text-xl font-semibold mb-3">{lesson.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
      </article>
      <Chat />
    </div>
  );
}