import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { sendChatMessage}  from '../../services/chatbotService';

export default function Chat() {
  const [messages, setMessages] = useState([{ text: "Bok! Kako Vam mogu pomoći?", sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      sendChatMessage(input)
        .then(response => {
          const answer = { text: response, sender: 'bot' };
          console.log(answer)
          console.log(input)
          setMessages(prev => [...prev, answer]);
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl 
      ${isMinimized ? 'h-12' : 'h-96'} transition-all duration-300`}>
      <div className="flex justify-between items-center p-3 border-b">
        <div className="flex items-center space-x-2">
          <img 
            src="chat_crnobijeli.png"
            alt="" 
            className="w-6 h-6"
          />
          <span className="font-medium">Suzi</span>
        </div>
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isMinimized ? '+' : '−'}
        </button>
      </div>

      {!isMinimized && (
        <>
          <div className="h-64 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="absolute bottom-0 w-full p-3 border-t bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Napišite poruku..."
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Pošalji
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}