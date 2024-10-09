import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useTranslation } from 'react-i18next';
import Sidebar from './sidebar';
import NewNavbar from './NewNavbar';

const MySwal = withReactContent(Swal);

const ResponseStat = styled.div`
  text-align: center;
  display: inline-block;
  font-size: 1.2rem;
  color: #aaa;
  margin-top: 6px;
  span {
    font-size: 0.7rem;
    display: block;
    font-weight: 300;
    margin-top: 4px;
  }
`;

const ResponseTitleArea = styled.div`
  padding: 0px 30px;
`;

const ResponseLink = styled.div`
  text-decoration: none;
  color: #bc1434;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 5px;
  cursor: pointer;
`;

const WhoAndWhen = styled.div`
  display: inline-block;
  color: #aaa;
  font-size: 0.8rem;
  float: right;
  padding: 10px 0;
`;

const StyledResponseRow = styled.div`
  background-color: rgba(0, 0, 0, 0.01);
  padding: 15px 15px 10px;
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid grey;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px;
  margin-right: 10px;
  box-shadow: 1px 1px #888888;
  position: relative;
`;

const EditDeleteIcons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  color: #bc1434;
  cursor: pointer;
`;

const DateInputsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const H2 = styled.h2`
  margin-top: 10%;
  font-size: 2em;
  font-weight: bold;
  color: #333;
  text-align: center;
  font-family: 'Arial', sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ddd;
`;

const AnswersResponsePage = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  const accessToken = userData?.accessToken;
  const userId = userData?.id;
  const [responses, setResponses] = useState([]);
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fetch responses for answers based on user ID and date range
  const fetchResponses = async () => {
    if (!userId || isNaN(userId)) {
      console.error('Invalid or missing user ID');
      return;
    }

    if (!accessToken) {
      console.error('Missing access token');
      return;
    }

    try {
      // Ensure the correct endpoint URL
      const response = await axios.get(
        `http://localhost:8083/api/questions/answersbyuseranddaterange?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data)
      setResponses(response.data);
    } catch (error) {
      console.error('Error fetching responses:', error);
      MySwal.fire({
        title: t('Error!'),
        text: t('Failed to fetch responses. Please check the endpoint and parameters.'),
        icon: 'error',
      });
    }
  };

  useEffect(() => {
    fetchResponses();
  }, [userId, startDate, endDate, accessToken]);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleEditClick = async (questionId, parentAnswerId, responseId) => {
    console.log('Editing Response:', { questionId, parentAnswerId, responseId });

    if (!questionId || !parentAnswerId || !responseId) {
      console.error('One of the required IDs is missing!');
      return;
    }
    const selectedResponse = responses.find((response) => response.id === responseId);
    if (!selectedResponse) {
      console.error(`Response with id ${responseId} not found.`);
      return;
    }

    const { value: formData } = await MySwal.fire({
      title: t('Edit Response'),
      html: `<textarea id="swal-textarea" style="width: 100%; min-height: 100px;">${selectedResponse.content || ''}</textarea>`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('Save Changes'),
      preConfirm: () => {
        const content = document.querySelector('#swal-textarea').value;
        if (!content) {
          MySwal.showValidationMessage(t('Content must be provided'));
        }
        return { content };
      },
    });

    if (formData) {
      const { content } = formData;

      try {
        // Use the correct endpoint format with the provided IDs
        await axios.put(
          `http://localhost:8083/api/questions/${questionId}/answers/${parentAnswerId}/responses/${responseId}`,
          { content },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        MySwal.fire({
          title: t('Updated!'),
          text: t('Your response has been updated.'),
          icon: 'success',
        });
        fetchResponses(); // Refresh the responses list after updating
      } catch (error) {
        console.error('Error updating response:', error);
        MySwal.fire({
          title: t('Error!'),
          text: t('Failed to update response.'),
          icon: 'error',
        });
      }
    }
  };

  const handleDeleteClick = async (responseId) => {
    if (!responseId || isNaN(responseId)) {
      console.error('Invalid responseId for delete');
      return;
    }

    MySwal.fire({
      title: t('Are you sure?'),
      text: t('You will not be able to recover this response!'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('Yes, delete it!'),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:8083/api/responses/${responseId}`, // Adjust this endpoint to match your API
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          setResponses(responses.filter((response) => response.id !== responseId));
          MySwal.fire({
            title: t('Deleted!'),
            text: t('Your response has been deleted.'),
            icon: 'success',
          });
        } catch (error) {
          console.error('Error deleting response:', error);
          MySwal.fire({
            title: t('Error!'),
            text: t('Failed to delete response.'),
            icon: 'error',
          });
        }
      }
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const sortedResponses = responses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const handleAnswerClick = (questionId) => {
    if (!questionId || isNaN(questionId)) {
      console.error('Invalid questionId');
      return;
    }
    navigate(`/client/question/${questionId}`);
  };
  return (
    <div>
      <NewNavbar />
      <div style={{ display: 'flex' }}>
        <Sidebar className="h-100" />

        <div style={{ flex: 1 }}>
          <H2>My Responses to Answers</H2>
          <div style={{ padding: '20px', marginTop: '10px' }}>
            <DateInputsContainer style={{ marginLeft: '25%' }}>
              <div>
                <label htmlFor="startDate">{t('Start Date:')}</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </div>
              <div>
                <label htmlFor="endDate">{t('End Date:')}</label>
                <input type="date" id="endDate" value={endDate} onChange={handleEndDateChange} />
              </div>
            </DateInputsContainer>
            <p>{t('Total responses')}: {responses.length}</p>
            {sortedResponses.map((response) => (
              <StyledResponseRow key={response.id} onClick={() => handleAnswerClick(response.questionId)}>
                <EditDeleteIcons>
                <FontAwesomeIcon
                    icon={faEdit}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(response.questionId, response.answerId, response.id);
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(response.id);
                    }}
                  />
                </EditDeleteIcons>
                <ResponseStat>
                  <span>{response.content || 'No response content'}</span>
                </ResponseStat>
                <ResponseTitleArea>
                  <ResponseLink>{response.content || 'No content'}</ResponseLink>
                  <WhoAndWhen>{t('Answered on')} {formatDate(response.createdAt)}</WhoAndWhen>
                </ResponseTitleArea>
              </StyledResponseRow>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswersResponsePage;
