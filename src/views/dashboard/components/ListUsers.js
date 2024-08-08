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
  TextField,
  Button,
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const ListUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filterNom, setFilterNom] = useState('');
  const [filterPrenom, setFilterPrenom] = useState('');
  const [sortOrderNom, setSortOrderNom] = useState('asc');
  const [sortOrderPrenom, setSortOrderPrenom] = useState('asc');

  useEffect(() => {
    axios
      .get('http://localhost:8083/api/users')
      .then((response) => {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
          try {
            const userData = JSON.parse(userDataString);
            const filteredUsers = response.data.filter(
              (user) => user.matricul !== parseInt(userData.id),
            );
            setUsers(filteredUsers);
          } catch (error) {
            console.error('Erreur lors de la conversion des données utilisateur :', error);
          }
        } else {
          setUsers(response.data);
        }
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des utilisateurs :', error);
      });
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Cette action est irréversible !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:8083/api/user/${userId}`);
        await Swal.fire({
          icon: 'success',
          title: 'Utilisateur supprimé',
          text: "L'utilisateur a été supprimé avec succès.",
          confirmButtonText: 'OK',
        });
        setUsers((prevUsers) => prevUsers.filter((user) => user.matricule !== userId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur :", error);
      await Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Une erreur est survenue lors de la suppression de l'utilisateur. Veuillez réessayer.",
        confirmButtonText: 'OK',
      });
    }
  };

  const handleRoleEdit = async (userId, newRole) => {
    try {
      const response = await axios.put(`http://localhost:8083/api/${userId}/role`, {
        newRoleName: newRole,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.matricul === userId) {
            return { ...user, roles: [newRole] };
          }
          return user;
        }),
      );
      await Swal.fire({
        icon: 'success',
        title: 'Rôle mis à jour',
        text: "Le rôle de l'utilisateur a été mis à jour avec succès.",
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle de l'utilisateur :", error);
      await Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la mise à jour du rôle. Veuillez réessayer.',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleRoleClick = async (userId, currentRole) => {
    const { value: newRole } = await Swal.fire({
      title: 'Modifier le rôle',
      input: 'text',
      inputLabel: 'Entrez le nouveau rôle',
      inputValue: currentRole,
      showCancelButton: true,
      confirmButtonText: 'Sauvegarder',
      cancelButtonText: 'Annuler',
    });

    if (newRole) {
      handleRoleEdit(userId, newRole);
    }
  };

  const handleSortNom = () => {
    const sortedUsers = [...users].sort((a, b) => {
      if (sortOrderNom === 'asc') {
        return a.nom.localeCompare(b.nom);
      } else {
        return b.nom.localeCompare(a.nom);
      }
    });
    setUsers(sortedUsers);
    setSortOrderNom(sortOrderNom === 'asc' ? 'desc' : 'asc');
  };

  const handleSortPrenom = () => {
    const sortedUsers = [...users].sort((a, b) => {
      if (sortOrderPrenom === 'asc') {
        return a.prenom.localeCompare(b.prenom);
      } else {
        return b.prenom.localeCompare(a.prenom);
      }
    });
    setUsers(sortedUsers);
    setSortOrderPrenom(sortOrderPrenom === 'asc' ? 'desc' : 'asc');
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nom.toLowerCase().includes(filterNom.toLowerCase()) &&
      user.prenom.toLowerCase().includes(filterPrenom.toLowerCase()),
  );

  return (
    <DashboardCard title="User List">
      <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 , mt:"10px"}}>
          <TextField
            label="Filter by Nom"
            variant="outlined"
            value={filterNom}
            onChange={(e) => setFilterNom(e.target.value)}
            sx={{ mr: 2 }}
          />

          <Button variant="contained" onClick={handleSortNom}>
            Sort by Nom ({sortOrderNom === 'asc' ? 'Desc' : 'Asc'})
          </Button>
        </Box>
        <Table aria-label="simple table" sx={{ whiteSpace: 'nowrap', mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Image
                </Typography>
              </TableCell>
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
            {filteredUsers.map((user) => (
              <TableRow key={user.matricul}>
                <TableCell>
                  {user.imageBase64 ? (
                    <img
                      src={`data:image/jpeg;base64,${user.imageBase64}`}
                      alt="User"
                      style={{ width: 50, height: 50, borderRadius: '50%' }}
                    />
                  ) : (
                    <Typography variant="subtitle2">No Image</Typography>
                  )}
                </TableCell>
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
                    user.roles.map((role) => (
                      <Chip
                        key={role}
                        label={role}
                        onClick={() => handleRoleClick(user.matricul, role)}
                      />
                    ))}
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
          You can change the role by clicking on it *(ROLE_MODERATOR OR ROLE_USER OR ROLE_ADMIN)
        </h1>
      </Box>
    </DashboardCard>
  );
};

export default ListUsers;
