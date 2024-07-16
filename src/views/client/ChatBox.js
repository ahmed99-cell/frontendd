import React, { useState } from 'react';
import './ChatBox.css'

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleMessageSend = () => {
    if (inputValue.trim() !== '') {
      const newMessage = { text: inputValue, sender: 'user' };
      setMessages([...messages, newMessage]);
      setInputValue('');
      // Ici, vous pouvez ajouter la logique pour l'envoi du message à un backend ou à un autre composant.
    }
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tapez votre message..."
        />
        <button onClick={handleMessageSend}>Envoyer</button>
      </div>
    </div>
  );
};

export default ChatBox;
