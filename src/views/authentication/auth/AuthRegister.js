import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';


const AuthRegister = ({ title, subtitle, subtext }) => {
    const navigate = useNavigate(); // Get the navigate function from react-router-dom

    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        username: '',
        role: ["user"]
    });

    const [errors, setErrors] = useState({

    });
    const [loading, setLoading] = useState(false); // Définir l'état loading


    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'role') {
            let updatedRoles = [...formData.role];
            if (event.target.checked) {
                updatedRoles.push(value);
            } else {
                updatedRoles = updatedRoles.filter(role => role !== value);
            }
            setFormData({ ...formData, [name]: updatedRoles });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Validation des champs vides
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (!formData[key]) {
                newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
            }
        });
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        try {
            // Envoyez les données du formulaire au backend
            const response = await axios.post('http://localhost:8082/api/auth/signup', formData);
            console.log(response.data);
            alert('Inscription réussie !');
            setLoading(false); // Définir l'état de chargement sur false après la réception de la réponse
            // Afficher un message de succès
            
            navigate('/auth/login'); // Corrected: it should be navigate instead of Navigate
            // Redirigez l'utilisateur vers la page de connexion ou affichez un message de succès
        } catch (error) {
            setLoading(false)
            if (error.response && error.response.data.error) {
                setErrors({ ...errors, username: 'Username or email already exists' });
            } else if (error.response) {
                // La requête a été reçue par le serveur, mais le serveur a renvoyé une erreur avec un code de statut HTTP
                console.error('Erreur lors de l\'inscription :', error.response.data);
                // Afficher un message d'erreur approprié à l'utilisateur
                // Par exemple, si le serveur renvoie des erreurs de validation, vous pouvez afficher les détails des erreurs de validation à l'utilisateur
            } else if (error.request) {
                // La requête a été effectuée, mais aucune réponse n'a été reçue
                console.error('Pas de réponse du serveur :', error.request);
                // Afficher un message d'erreur générique à l'utilisateur
            } else {
                // Une erreur s'est produite lors de la configuration de la requête ou lors de la gestion de la réponse
                console.error('Erreur lors de la configuration de la requête ou de la gestion de la réponse :', error.message);
                // Afficher un message d'erreur générique à l'utilisateur
            }
        }
    };
    

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Box component="form" onSubmit={handleSubmit}>
                <Stack mb={3}>
                    <Typography variant="subtitle1" fontWeight={600} style={{color:"black"}} component="label" htmlFor='prenom' mb="4px">First Name <span style={{ color: "red" }}>*</span></Typography>
                    <CustomTextField id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} variant="outlined" fullWidth />
                    {errors.prenom && <Typography variant="body2" color="error">{errors.prenom}</Typography>}
                    <Typography variant="subtitle1" fontWeight={600} style={{color:"black"}} component="label" htmlFor='nom' mb="4px">Last Name <span style={{ color: "red" }}>*</span></Typography>
                    <CustomTextField id="nom" name="nom" value={formData.nom} onChange={handleChange} variant="outlined" fullWidth />
                    {errors.nom && <Typography variant="body2" color="error">{errors.nom}</Typography>}
                    <Typography variant="subtitle1" fontWeight={600} style={{color:"black"}} component="email" htmlFor='email' mb="4px">Email Address <span style={{ color: "red" }}>*</span></Typography>
                    <CustomTextField id="email" name="email" value={formData.email} onChange={handleChange} variant="outlined" fullWidth />
                    {errors.email && <Typography variant="body2" color="error">{errors.email}</Typography>}
                    <Typography variant="subtitle1" fontWeight={600} style={{color:"black"}} component="label" htmlFor='username' mb="4px">Username <span style={{ color: "red" }}>*</span></Typography>
                    <CustomTextField id="username" name="username" value={formData.username} onChange={handleChange} variant="outlined" fullWidth />
                    {errors.username && <Typography variant="body2" color="error">{errors.username}</Typography>}
                    
                </Stack>
                {Object.values(errors).map((error, index) => (
                <Typography key={index} variant="body2" color="error" mb={1}>
                    {error}
                </Typography>
                ))}
                <Button type="submit" color="primary" variant="contained" size="large" fullWidth >
                    Sign Up
                </Button>
            </Box>
            {subtitle}
        </>
    );
};

export default AuthRegister;