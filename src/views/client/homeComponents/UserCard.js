import React, { useState, useEffect } from 'react';
import '../homeComponents/UserCard.css';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMessage } from 'react-icons/ai';
import axios from 'axios';

const UserCard = ({ id, username, email }) => {
  const navigate = useNavigate();
  const [userPoints, setUserPoints] = useState(null);

  useEffect(() => {
    const fetchReputationScore = async () => {
      try {
        const reputationResponse = await axios.get(`http://localhost:8082/api/reputations/${id}`);
        setUserPoints(reputationResponse.data.score);
      } catch (error) {
        console.error('Error fetching reputation score:', error);
      }
    };

    fetchReputationScore();
  }, [id]);

  const handleClick = () => {
    navigate(`/client/user/${id}`);
  };

  return (
    <div onClick={handleClick} className="user-card">
      <img
        src="https://bootdey.com/img/Content/avatar/avatar7.png"
        alt="User Image"
        className="user-image"
      />
      <div className="user-info">
        <h2 className="username">{username}</h2>
        <p className="email">{email}</p>
        <p className="score">Score: {userPoints !== null ? userPoints : 'Loading...'}</p>
        <AiOutlineMessage
          onClick={handleClick}
          style={{ cursor: 'pointer', fontSize: '24px', color: 'black' }}
        />
      </div>
    </div>
  );
};

export default UserCard;
