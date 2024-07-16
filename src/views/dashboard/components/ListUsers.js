import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Label } from '@mui/icons-material';

const ListUsers = () => {
  const navigate = useNavigate(); // Get the navigate function from react-router-dom
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/users')
      .then((response) => {
        // Récupérer l'utilisateur connecté depuis localStorage
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString);

            // Utiliser le champ "matricule"

            // Filtrer les utilisateurs pour exclure l'utilisateur connecté
            const filteredUsers = response.data.filter(
              (user) => user.matricul !== parseInt(userData.id),
            ); // Utiliser "matricule" au lieu de "id"
            console.log(filteredUsers);
            // Mettre à jour l'état avec les utilisateurs filtrés
            setUsers(filteredUsers);
          } catch (error) {
            console.error('Erreur lors de la conversion des données utilisateur :', error);
          }
        } else {
          // Si aucune donnée utilisateur n'est présente dans localStorage, utiliser les données brutes de l'API
          setUsers(response.data);
        }
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des utilisateurs :', error);
      });
  }, []);

  const handleDeleteUser = (userId) => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?');
    if (!confirmed) {
      return; // Annuler la suppression si l'utilisateur clique sur "Annuler"
    }

    console.log("Suppression de l'utilisateur avec ID :", userId);
    // Envoyez une requête HTTP DELETE vers votre API backend pour supprimer l'utilisateur
    axios
      .delete(`http://localhost:8080/api/user/${userId}`)
      .then((response) => {
        alert('Utilisateur supprimé avec succès !');
        window.location.reload();

        // Mettez à jour l'état local des utilisateurs en supprimant l'utilisateur supprimé
        setUsers((prevUsers) => prevUsers.filter((user) => user.matricule !== userId));
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
      });
  };

  const handleRoleEdit = (userId, newRole) => {
    // Make an API call to update the user role
    axios
      .put(`http://localhost:8080/api/${userId}/role`, { newRoleName: newRole })
      .then((response) => {
        console.log(response);
        // Update the user role in the state
        setUsers((prevUsers) =>
          prevUsers.map((user) => {
            if (user.matricul === userId) {
              return { ...user, roles: [newRole] };
            }
            return user;
          })
        );
        alert('User role updated successfully!');
      })
      .catch((error) => {
        console.error('Error updating user role:', error);
      });
  };
  
  const handleRoleClick = (userId, currentRole) => {
    const newRole = prompt('Enter the new role:');
    if (newRole !== null && newRole !== '') {
      handleRoleEdit(userId, newRole);
    }
  };

  return (
    <DashboardCard title="User List">
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap', mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Matricule
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Email
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Nom
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Prénom
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Roles
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.matricul}>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user.matricul}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: '15px', fontWeight: '500' }}>{user.email}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user.nom}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user.prenom}
                  </Typography>
                </TableCell>
                <TableCell>
                  {user.roles &&
                    user.roles.map((role) => {
                      console.log('Role name:', role); // Vérifiez les noms de rôles
                      return <Chip key={role.id} label={role} onClick={()=> handleRoleClick(user.matricul,role)}/>;
                    })}
                </TableCell>

                <TableCell align="right">
                  <IconButton onClick={() => handleDeleteUser(user.matricul)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <h1 style={{ marginTop: '30px', fontSize: '14px', marginRight: '50px' }}>
          you can change role by clicking of it*(ROLE_MODERATOR OR ROLE_USER OR ROLE_ADMIN)
        </h1>
      </Box>
    </DashboardCard>
  );
};

export default ListUsers;
