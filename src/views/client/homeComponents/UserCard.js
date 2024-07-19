import React, { useState } from 'react';
import '../homeComponents/UserCard.css';
import { useNavigate } from 'react-router-dom';
import { IoIosChatbubbles } from 'react-icons/io';
import styled from 'styled-components';

const Card = styled.div`
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 10px;
  position: relative;
  background: #fff;
`;

const ChatIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  color: grey;
`;

const UserCard = ({ id, username, email, score, onChatClick }) => {
  const navigate = useNavigate();
  const [userPoints, setUserPoints] = useState(null);

  // Uncomment this block if you want to fetch user points from an API
  /*
  useEffect(() => {
    const fetchReputationScore = async () => {
      try {
        const reputationResponse = await axios.get(`http://localhost:8080/api/reputations/${id}`);
        setUserPoints(reputationResponse.data.score);
      } catch (error) {
        console.error('Error fetching reputation score:', error);
      }
    };

    fetchReputationScore();
  }, [id]);
  */

  const handleClick = () => {
    navigate(`/client/user?id=${id}`);
  };

  return (
    <Card>
      <img
        src="https://bootdey.com/img/Content/avatar/avatar7.png"
        alt="User Image"
        className="user-image"
      />
      <div className="user-info">
        <h2 className="username" onClick={handleClick}>{username}</h2>
        <p className="email">{email}</p>
        <p className="score">Score: {userPoints !== null ? userPoints : 'Loading...'}</p>
        <ChatIcon onClick={() => onChatClick(id,username)}> {/* Pass the user ID to onChatClick */}
          <IoIosChatbubbles />
        </ChatIcon>
      </div>
    </Card>
  );
};

export default UserCard;
