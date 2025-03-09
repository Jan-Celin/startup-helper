import React from 'react';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  );
}