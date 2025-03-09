import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Chat from './components/chat/Chat';
import LessonsList from './components/lessons/LessonsList';
import CategoryLessons from './components/lessons/CategoryLessons';
import LessonDetail from './components/lessons/LessonDetail';
import Login from './components/auth/login';
import Register from './components/auth/register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { AdminDashboard } from './components/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/materijali" element={
                <ProtectedRoute>
                  <LessonsList />
                </ProtectedRoute>
              } />
              
              <Route path="/materijali/kategorija/:slug" element={
                <ProtectedRoute>
                  <CategoryLessons />
                </ProtectedRoute>
              } />
              
              <Route path="/materijali/lekcija/:slug" element={
                <ProtectedRoute>
                  <LessonDetail />
                </ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
            </Routes>
            {/* <Chat /> */}
          </Layout>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;