import React, { useRef, useState, useEffect } from 'react';
import NewNavbar from './homeComponents/NewNavbar';
import './askpage.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const AskPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const question = location.state?.question;
  const [title, setTitle] = useState(question ? question.title : '');
  const [content, setContent] = useState(question ? question.content : '');
  const [file, setFile] = useState(null);
  const [tagId, setTagId] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const editor = useRef(null);
  const votreToken = localStorage.getItem('token');
  const [isAnonymous, setIsAnonymous] = useState(question ? question.userAnonymous : false);
  const [isEditMode, setIsEditMode] = useState(!!question);
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get('http://localhost:8082/api/tags/getAll', {
          headers: {
            Authorization: `Bearer ${votreToken}`,
          },
        });
        setTags(response.data); // Assuming the response data is an array of tags
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (editor.current) {
      // Vérifier si l'éditeur est prêt
      if (editor.current.editor) {
        // L'éditeur est prêt, nous pouvons maintenant ajouter un écouteur pour l'événement 'ready'
        editor.current.editor.events.on('ready', () => {
          console.log('Editor is ready!');
        });
      } else {
        // L'éditeur n'est pas encore prêt, attendons un instant et réessayons
        setTimeout(() => {
          console.log('Retrying editor initialization...');
          // Rappel de useEffect pour réessayer l'initialisation
        }, 1000); // Attendre 1 seconde avant de réessayer
      }
    }
  }, []);

  useEffect(() => {
    if (question) {
      setExistingImage(question.image);
      setSelectedTags(question.tags.map((tag) => ({ value: tag.id, label: tag.name })));
    }
  }, [question]);

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    // Retrieve the authentication token from localStorage
    const votreToken = localStorage.getItem('token');

    // Check if the token is present
    if (!votreToken) {
      alert(t('Please log in to ask a question.'));
      navigate('/auth/login'); // Redirect to the login page
      return;
    }

    // Create a headers object with the authentication token
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${votreToken}`, // Include the token in the Authorization header
    };

    const formData = new FormData();
    
    // Convert the questionRequest data to a JSON string and append it
    const questionRequest = {
      title: title,
      content: content,
      tagIds: selectedTags.map(tag => tag.value),
      userAnonymous: isAnonymous
    };

    formData.append('questionRequest', JSON.stringify(questionRequest));
    
    if (file) {
      formData.append('file', file);
    }

    if (isEditMode) {
      // Update question
      try {
        const response = await axios.put(`http://localhost:8082/api/questions/${question.id}`, formData, { headers });

        if (response.status === 200) {
          await Swal.fire({
            icon: 'success',
            title: t('Success'),
            text: t('Question updated successfully!'),
          });

          navigate('/client/questionpage'); // Redirect to home page or wherever you want
        }
      } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
          icon: 'error',
          title: t('Error'),
          text: t('An error occurred while updating the question. Please try again later.'),
        });
      }
    } else {
      // Create new question
      try {
        const response = await axios.post('http://localhost:8082/api/questions/create', formData, {
          headers: headers, // Pass the headers object to Axios
        });
        if (response.status === 200) {
          await Swal.fire({
            icon: 'success',
            title: t('Success'),
            text: t('Question created successfully!'),
          });

          navigate('/client/questionpage'); // Redirect to home page or wherever you want
        }
      } catch (error) {
        console.error('Error:', error);
        await Swal.fire({
          icon: 'error',
          title: t('Error'),
          text: t('An error occurred while creating the question. Please try again later.'),
        });
      }
    }
  };


  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTagChange = (selectedOptions) => {
    setSelectedTags(selectedOptions);
  };

  return (
    <>
      <NewNavbar />
      <div style={{ marginTop: 100 }}>
        <div className="container mb-5" style={{ width: '70%', display: 'block', margin: 'auto' }}>
          <div className="card mt-5" style={{ backgroundColor: 'hsl(206,100%,97%)' }}>
            <div className="card-header">
              <h3>
                <b>{isEditMode ? t('Update Question') : t('Ask a Public Question')}</b>
              </h3>
            </div>
            <div className="card-body">
              <h5 className="card-title">{t('Writing a Good Question')}</h5>
              <p className="card-text">
                {t('ready to ask')}
              </p>
              <h5>{t('Steps')}</h5>
              <ul>
                <li>{t('Summarize your problem in a one-line title.')}</li>
                <li>{t('Describe your problem in more detail.')}</li>
                <li>{t('Describe what you tried and what you expected to happen.')}</li>
                <li>{t('Add “tags” which help surface your question to members of the community.')}</li>
                <li>{t('You can add a question as an Anonyme User')}</li>
              </ul>
            </div>
          </div>
          <form id="question-form" onSubmit={handleSubmit}>
            <div className="card mb-3 mt-5">
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="title">{t('Title')}</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-control"
                    id="title"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="content">{t('Subject')}</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="form-control"
                    id="content"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="file">{t('Add file')}</label>
                  {existingImage && (
                    <div>
                      <img src={existingImage} alt="Existing image" style={{ maxWidth: '100%', maxHeight: '200px', marginBottom: '10px' }} />
                    </div>
                  )}
                  <input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="form-control"
                  />
                </div>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="tags">{t('Question Tags')}</label>

                  <Select
                    value={selectedTags}
                    onChange={handleTagChange}
                    options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
                    isMulti={true}
                    placeholder={t('Select tags')}
                    id="tags"
                  />

                  <small className="form-text text-muted">
                    {t('Enter Question Tags')}
                  </small>
                </div>
              </div>
            </div>
            <div className="form-group form-check" style={{ marginTop: '30px' }}>
              <input
                type="checkbox"
                className="form-check-input"
                id="anonymousCheckbox"
                checked={isAnonymous}
                style={{ backgroundColor: 'red', borderColor: 'white' }}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="anonymousCheckbox">
                <FontAwesomeIcon icon={faUserSecret} style={{ marginRight: '5px' }} />
                {t('Rester anonyme')}
              </label>
            </div>

            <button type="submit" className="btn btn-danger custom-btn mt-5 mb-5">
              {isEditMode ? t('Update Question') : t('Ask Question')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AskPage;
