import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router';

const AuthResetPassword = ({ subtext }) => {
    
        const navigate = useNavigate();
        const [email, setEmail] = useState('');
        const [oldPassword, setOldPassword] = useState('');
        const [newPassword, setNewPassword] = useState('');
        const [error, setError] = useState('');
    
       

  const handleReset = async (event) => {
    event.preventDefault();

    try {
      // Envoyer les données du formulaire au backend pour réinitialiser le mot de passe
      await axios.post('http://localhost:8080/api/auth/reset-password', {
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      // Réinitialisation réussie, naviguer vers la page de connexion
      alert('changement de mot de passe a reussi');
      navigate('/auth/login');
    } catch (error) {
      // Gérer les erreurs
      if (error.response && error.response.data.error) {
        setError(error.response.data.error); // Afficher l'erreur renvoyée par l'API
      } else {
        console.error('Erreur lors de la réinitialisation du mot de passe :', error);
        setError(
          'Une erreur est survenue lors de la réinitialisation du mot de passe. Veuillez réessayer.',
        );
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleReset} mt={2}>
      <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
        Reset Your Password
      </Typography>
      <Typography
        variant="subtitle1"
        fontWeight={600}
        style={{ color: 'black' }}
        component="label"
        htmlFor="password"
        mb="5px"
      >
        Email
      </Typography>
      <TextField
        id="email"
        label="Email"
        type="email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        mb={2}
      />
      <Typography
        variant="subtitle1"
        fontWeight={600}
        style={{ color: 'black' }}
        component="label"
        htmlFor="password"
        mb="5px"
      >
        Old Password
      </Typography>
      <TextField
        id="oldPassword"
        label="Old Password"
        type="password"
        variant="outlined"
        fullWidth
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        mb={2}
      />
      <Typography
        variant="subtitle1"
        fontWeight={600}
        style={{ color: 'black' }}
        component="label"
        htmlFor="password"
        mb="5px"
      >
        New Password
      </Typography>
      <TextField
        id="newPassword"
        label="New Password"
        type="password"
        variant="outlined"
        fullWidth
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        mb={2}
      />
      <Typography
        component={Link}
        to="/auth/Login"
        fontWeight="900"
        marginTop="70px"
        sx={{
          textDecoration: 'none',
          color: 'primary.main',
        }}
      >
        Annuler ?
      </Typography>
      <Box mt={3}>
        {error && (
          <Typography variant="body2" color="error" mb={2}>
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth mt={2}>
          Reset Password
        </Button>
      </Box>
      <Box mt={3}>
        {' '}
        {/* Ajout de l'espace en haut du bouton */}
        {subtext}
      </Box>
    </Box>
  );
};
export default AuthResetPassword;
