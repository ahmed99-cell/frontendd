import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import styled from 'styled-components';
import NewNavbar from './NewNavbar';
import Sidebar from './sidebar';
import { FaUserCircle } from 'react-icons/fa'; // User icon
import { NavLink, useLocation, useParams } from 'react-router-dom';

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
  margin-top: 60px; /* Adjusted margin to move it away from the navbar */
`;

const ProfileIcon = styled.div`
  font-size: 80px;
  color: #8884d8;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px; /* Adjusted margin to ensure there is space between icon and text */
`;

const ChartsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px; /* Adjusted margin to ensure charts are spaced correctly */
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

const CustomTooltip = ({ active, payload, label }) => {
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
 // const { id } = useParams();
  const location = useLocation();
  const id = new URLSearchParams(location.search).get('id');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionChartData, setQuestionChartData] = useState([]);
  const [answerChartData, setAnswerChartData] = useState([]);
  const [userSince, setUserSince] = useState('');
  const [userName, setUserName] = useState('');
  const [userPoints, setUserPoints] = useState(0);
const userId = id;
  // Assuming the userId is dynamic and can be fetched from props or a higher component
console.log('UserrrrrrrrrrrrID', id)
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          // Fetch user info
          const userResponse = await axios.get(`http://localhost:8082/api/user/${id}`);
          setUserName(userResponse.data.userName);

          // Fetch reputation info
          const reputationResponse = await axios.get(`http://localhost:8082/api/reputations/${id}`);
          setUserPoints(reputationResponse.data.score);

          // Fetch questions and answers
          const questionsResponse = await axios.get('http://localhost:8082/api/questions/by-user-and-date', {
            params: {
              userId,
              startDate: '2024-01-01',
              endDate: '2024-12-31'
            }
          });

          const answersResponse = await axios.get('http://localhost:8082/api/questions/byuseranddate', {
            params: {
              userId,
              startDate: '2024-01-01',
              endDate: '2024-12-31'
            }
          });

          setQuestions(questionsResponse.data);
          setAnswers(answersResponse.data);
          processQuestionChartData(questionsResponse.data);
          processAnswerChartData(answersResponse.data);

          // Set user since date as the date of the first question
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

    setQuestionChartData(formattedData);
  };

  const processAnswerChartData = (data) => {
    const answerCount = {};

    data.forEach(answer => {
      const responsesCount = answer.responses ? answer.responses.length : 0;
      answerCount[answer.content] = responsesCount;
    });

    const formattedData = Object.keys(answerCount).map(content => ({
      name: truncateText(content, 20), // Truncate the text to 20 characters
      value: answerCount[content],
      fullContent: content // Keep the full content for tooltip
    }));

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

  return (
    <PageContainer>
      <NewNavbar />
      <ContentContainer>
        <Sidebar style={{ height: '100%' }} />
        <MainContent>
          <ProfileSection>
            <ProfileIcon>
              <FaUserCircle />
            </ProfileIcon>
            <UserInfo>
              <p>{userName}</p>
              <p>User since: {userSince !== 'No questions created yet' ? formatDate(userSince) : userSince}</p>
              <p>Points: {userPoints}</p>
            </UserInfo>
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
