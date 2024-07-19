import React, { useEffect, useState } from 'react';
import NewNavbar from './homeComponents/NewNavbar';
import Sidebar from './homeComponents/sidebar';
import '../client/Customers.css';
import UserCard from './homeComponents/UserCard';
import axios from 'axios';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Chatbox = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  width: 360px;
  height: 400px;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const ChatHeader = styled.div`
  background: grey;
  color: white;
  padding: 12px;
  border-radius: 10px 10px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #f9f9f9;
`;

const ChatFooter = styled.div`
  padding: 10px;
  border-top: 1px solid #ddd;
  background: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MessageInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  width: 30px;
  border-radius: 2px;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const Customers = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const senderId = user?.id;
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const [currentChatUserId, setCurrentChatUserId] = useState(null); // Store ID instead of username
  const [messages, setMessages] = useState([]);
  const [currentChatUser, setCurrentChatUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [ws, setWs] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();

    // Créer une connexion WebSocket
    const socket = new WebSocket(`ws://localhost:8080/ws?token=${token}`);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      console.log('Message received:', event.data);
      const receivedMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleChatClick = (id, username) => {
    setCurrentChatUser(username);
    setCurrentChatUserId(id);
    setIsChatboxOpen(true);
  };

  const handleCloseChatbox = () => {
    setIsChatboxOpen(false);
    setCurrentChatUser(null);
    setCurrentChatUserId(null);
  };

  const handleSendMessage = () => {
    if (messageInput.trim() !== '' && ws && currentChatUserId) {
      const message = {
        content: messageInput,
        senderId: senderId,
        receiverId: currentChatUserId,
      };

      ws.send(JSON.stringify(message)); // Use ws.send instead of socket.emit
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessageInput('');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <NewNavbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <div style={{ marginTop: '13vh', zIndex: 1, backgroundColor: 'white' }}>
            <div className="main" style={{ marginTop: '10px' }}>
              <h1 style={{ marginTop: '-20px', color: 'black', fontFamily: 'inherit', marginLeft: '30px' }}>
                Users
              </h1>
              <div className="search-bar" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', marginTop: '-10px', marginLeft: '70%' }}>
                <TextField
                  type="text"
                  placeholder="Find a user"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  style={{ width: '200px', borderRadius: '4px' }}
                />
              </div>
              <div className="mt-12 mb-4 user-cards-container">
                {filteredUsers.map((user) => (
                  <UserCard
                    key={user.matricul}
                    id={user.matricul}
                    username={user.username}
                    email={user.email}
                    score={'100'}
                    onChatClick={(id, username) => handleChatClick(id, username)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isChatboxOpen && (
        <Chatbox>
          <ChatHeader>
            <span>Chat with {currentChatUser}</span>
            <CloseButton onClick={handleCloseChatbox}>×</CloseButton>
          </ChatHeader>
          <ChatBody>
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{user.username}: </strong>{msg.content}
              </div>
            ))}
          </ChatBody>
          <ChatFooter>
            <MessageInput
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </ChatFooter>
        </Chatbox>
      )}
    </>
  );
};

export default Customers;
