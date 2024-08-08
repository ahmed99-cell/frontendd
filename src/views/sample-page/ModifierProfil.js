import React, { useState } from 'react';
import { Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import 'src/views/sample-page/ModifierProfil.css';
import axios from 'axios';
import { useNavigate } from 'react-router';

const ModifierProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    username: '', // Change the key to match the input name
    password: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
   
  const userData = JSON.parse(localStorage.getItem('user'));
const accessToken = userData.accessToken;
const userId = userData.id;

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Retrieve user ID and access token from localStorage
    

    
    // Check if user ID and access token are available
    if ( !accessToken) {
      console.error(' access token is missing from localStorage');
      return;
    }
    
    if (!userId ) {
      console.error('User ID  is missing from localStorage');
      return;
    }

    // Check if any field is empty
    if (
      !formData.prenom.trim() ||
      !formData.nom.trim() ||
      !formData.email.trim() ||
      !formData.username.trim() || // Change the key to match the input name
      !formData.password.trim()
    ) {
      setErrorMessage('All fields are required');
      return;
    }

    try {
      // Send a PUT request to update the profile
      const response = await axios.put(
        `http://localhost:8083/api/user/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      // Handle success response
      setSuccessMessage('Profile updated successfully');
      setErrorMessage('');
      alert('user modification reussi');
      navigate('/dashboard');
    } catch (error) {
      // Handle error
      setErrorMessage('Error updating profile');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <PageContainer title="Modifier Profil" description="Modifier Profil">
        <DashboardCard title="Modifier Profil">
          <form id="formMP" onSubmit={handleSubmit}>
            <label>
              Nom complet *
              <div>
                <input
                  type="text"
                  name="prenom" // Match the key in formData
                  placeholder="Prénom"
                  required
                  onChange={handleChange}
                />
                <br />
                <input
                  type="text"
                  name="nom" // Match the key in formData
                  placeholder="Nom"
                  required
                  onChange={handleChange}
                />
              </div>
            </label>

            <label>
              Adresse e-mail *
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
              />
            </label>

            <label>
              Username
              <input
                type="text"
                name="username" // Match the key in formData
                placeholder="Username"
                required
                onChange={handleChange}
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                required
                onChange={handleChange}
              />
            </label>

            <button type="submit">Modifier</button>
          </form>
        </DashboardCard>
      </PageContainer>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default ModifierProfile;
