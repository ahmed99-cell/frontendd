import React,{useState} from 'react';
import axios from 'axios';

import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import 'src/views/sample-page/AjouterModerateur.css';
import { useNavigate } from 'react-router';

const AjouterModerateur = () => {

    const navigate = useNavigate(); // Get the navigate function from react-router-dom

    const [formData, setFormData] = useState({
        prenom: '',
        nom: '',
        email: '',
        username: '',
        role: ["mod"] // Définition du rôle par défaut
    });
    const [errors, setErrors] = useState({

    });
    const [loading, setLoading] = useState(false); // Définir l'état loading
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
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
            const response = await axios.post('http://localhost:8083/api/auth/signup', formData);
            console.log(response.data);
            alert('ajout réussie !');
            setLoading(false);
            navigate('/dashboard');
            
            // Définir l'état de chargement sur false après la réception de la réponse
            // Afficher un message de succès

        } catch (error) {
            setLoading(false)
            if (error.response && error.response.data.error) {
                setErrors({ ...errors, username: 'Username or email already exists' });
            } else if (error.response) {
                // La requête a été reçue par le serveur, mais le serveur a renvoyé une erreur avec un code de statut HTTP
                console.error('Erreur lors de lajout', error.response.data);
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
        <PageContainer title="Ajouter Modérateur" description="Ajouter Modérateur">
            <DashboardCard title="Ajouter Modérateur">
                <form id="formMP" onSubmit={handleSubmit}>
                    <label>
                        Nom complet *
                        <div>
                            <input type="text" name="prenom" placeholder="Prénom" style={{marginBottom:"6px"}} value={formData.prenom} onChange={handleChange} required />
                            <br />
                            <input type="text" name="nom" placeholder="Nom"  style={{marginBottom:"6px"}} value={formData.nom} onChange={handleChange} required />
                        </div>
                    </label>

                    <label>
                        Adresse e-mail *
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </label>

                    <label>
                        Nom d'utilisateur
                        <input type="text" name="username" placeholder="Nom d'utilisateur" value={formData.username} onChange={handleChange} required />
                    </label>

                    

                    <button type="submit">Ajouter</button>
                </form>
            </DashboardCard>
        </PageContainer>
    );
};
export default AjouterModerateur;
