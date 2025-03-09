import React from 'react';

export default function ChatMessage({ message }) {
  const isBot = message.sender === 'bot';
  
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[75%] p-3 rounded-lg ${
        isBot ? 'bg-gray-100' : 'bg-blue-500 text-white'
      }`}>
        {message.text}
      </div>
    </div>
  );
}