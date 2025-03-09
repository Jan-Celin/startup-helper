import React from 'react';

export default function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      >
      </div>
      <p className="text-sm text-gray-600 mt-1">{progress}% Complete</p>
    </div>
  );
}