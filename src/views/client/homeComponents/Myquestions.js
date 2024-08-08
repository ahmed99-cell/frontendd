import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';
import NewNavbar from './NewNavbar';
import Sidebar from './sidebar';
import { useLocation } from 'react-router-dom';
import { SlBadge } from 'react-icons/sl'; // Import SlBadge icon

// Styled components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100%;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  margin-top: 60px;
  gap: 20px; // Space between profile info and badges
`;

const ProfileIcon = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 20px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding-top:30px;
  font-family: 'Arial', sans-serif;
  color: #333;
`;

const UserInfoTitle = styled.p`
  font-size: 18px;
  font-weight: bold;
  
  margin: 0;
`;

const UserInfoDetail = styled.p`
  font-size: 16px;
  margin: 0;
  color: #555;
`;

const BadgeSection = styled.div`
  display: flex;
  align-items: right;
  flex-direction: column; // Stack badges vertically
  gap: 10px; // Space between badges
`;

const Badge = styled(SlBadge)`
  font-size: 50px;
  color: ${props => props.active ? props.color : 'transparent'}; // Badge color based on status
  transition: color 0.3s ease;
  margin-top :5px;
  padding-bottom:15px
`;

const ChartsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
`;

const ChartWrapper = styled.div`
  margin: 20px;
`;

const ChartTitle = styled.h2`
  text-align: center;
`;

const HorizontalLine = styled.hr`
  width: 100%;
  margin-top: 20px;
  border: 1px solid #1f1c1f;
`;

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px' }}>
        <p>{payload[0].name}</p>
        <p>{`Value: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const ChartComponent = () => {
  const location = useLocation();
  const id = new URLSearchParams(location.search).get('id');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionChartData, setQuestionChartData] = useState([]);
  const [answerChartData, setAnswerChartData] = useState([]);
  const [userSince, setUserSince] = useState('');
  const [userName, setUserName] = useState('');
  const [userPoints, setUserPoints] = useState(0);
  const [userImage, setUserImage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          // Fetch user info
          const userResponse = await axios.get(`http://localhost:8083/api/user/${id}`);
          setUserName(userResponse.data.username);
          setUserPoints(userResponse.data.reputation.score);
          setUserImage(userResponse.data.imageBase64 || ''); // Set fallback to empty string

          const questionsResponse = await axios.get('http://localhost:8083/api/questions/by-user-and-date', {
            params: {
              userId: id,
              startDate: '2024-01-01',
              endDate: '2024-12-31'
            }
          });

          const answersResponse = await axios.get('http://localhost:8083/api/questions/byuseranddate', {
            params: {
              userId: id,
              startDate: '2024-01-01',
              endDate: '2024-12-31'
            }
          });

          setQuestions(questionsResponse.data);
          setAnswers(answersResponse.data);
          processQuestionChartData(questionsResponse.data);
          processAnswerChartData(answersResponse.data);

          if (questionsResponse.data.length > 0) {
            setUserSince(questionsResponse.data[0].createdAt);
          } else {
            setUserSince('No questions created yet');
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [id]);

  const processQuestionChartData = (data) => {
    const tagCount = {};

    data.forEach(question => {
      question.tags.forEach(tag => {
        if (tagCount[tag.name]) {
          tagCount[tag.name]++;
        } else {
          tagCount[tag.name] = 1;
        }
      });
    });

    const formattedData = Object.keys(tagCount).map(tag => ({
      name: tag,
      value: tagCount[tag]
    }));

    console.log('Question Chart Data:', formattedData);

    setQuestionChartData(formattedData);
  };

  const processAnswerChartData = (data) => {
    const answerCount = {};

    data.forEach(answer => {
      const responsesCount = answer.responses ? answer.responses.length : 0;
      answerCount[answer.content] = (answerCount[answer.content] || 0) + responsesCount;
    });

    const formattedData = Object.keys(answerCount)
      .filter(content => answerCount[content] > 0)
      .map(content => ({
        name: truncateText(content, 20),
        value: answerCount[content],
        fullContent: content
      }));

    console.log('Answer Chart Data:', formattedData);

    setAnswerChartData(formattedData);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28ED0', '#50C878', '#FF6347', '#4682B4'];

  const formatDate = (dateString) => {
    if (dateString === 'No questions created yet') {
      return dateString;
    }
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  // Determine badge state based on points
  const getBadgeState = (points) => {
    return {
      bronze: points >= 50,
      silver: points >= 100,
      gold: points >= 150
    };
  };

  const badges = getBadgeState(userPoints);

  return (
    <PageContainer>
      <NewNavbar />
      <ContentContainer>
        <Sidebar style={{ height: '100%' }} />
        <MainContent>
          <ProfileSection>
            <ProfileIcon>
              <img 
                src={userImage ? `data:image/jpeg;base64,${userImage}` : 'https://bootdey.com/img/Content/avatar/avatar7.png'} 
                alt="User Profile"
              />
            </ProfileIcon>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <UserInfo>
                <UserInfoTitle>{userName}</UserInfoTitle>
                <UserInfoDetail>User since: {userSince !== 'No questions created yet' ? formatDate(userSince) : userSince}</UserInfoDetail>
                <UserInfoDetail>Points: {userPoints}</UserInfoDetail>
              </UserInfo>
              <BadgeSection>
                {badges.gold && <Badge as={SlBadge} color="#ffd700" />}
                {badges.silver && !badges.gold && <Badge as={SlBadge} color="#c0c0c0" />}
                {badges.bronze && !badges.silver && !badges.gold && <Badge as={SlBadge} color="#cd7f32" />}
              </BadgeSection>
            </div>
          </ProfileSection>
          <HorizontalLine />
          <ChartsContainer>
            <ChartWrapper>
              <ChartTitle>Total Questions: {questions.length}</ChartTitle>
              <PieChart width={400} height={400}>
                <Pie
                  data={questionChartData}
                  cx={200}
                  cy={200}
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {questionChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ChartWrapper>

            <ChartWrapper>
              <ChartTitle>
                Total Answers: {answers.length} and Responses: {answers.reduce((total, answer) => total + (answer.responses ? answer.responses.length : 0), 0)}
              </ChartTitle>
              <PieChart width={400} height={400}>
                <Pie
                  data={answerChartData}
                  cx={200}
                  cy={200}
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {answerChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ChartWrapper>
          </ChartsContainer>
        </MainContent>
      </ContentContainer>
    </PageContainer>
  );
};

export default ChartComponent;
