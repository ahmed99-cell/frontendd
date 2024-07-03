import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';

import { IconListCheck, IconMail, IconUser } from '@tabler/icons';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);


  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

    useEffect(() => {
        // Fetch user role from localStorage
        const storedRole = localStorage.getItem("role");
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  function cleanLocalStorage() {
    localStorage.clear();
}
const [username, setUsername] = useState('');
  useEffect(() => {
    
    // Récupérer le nom d'utilisateur depuis localStorage
    const userDataString = localStorage.getItem('user');
    if (userDataString) {
        try {
            const userData = JSON.parse(userDataString);
            setUsername(userData.username); // Enregistrer le nom d'utilisateur dans l'état
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }
}, []);

   
  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        <div>
            {/* Conditionally render MenuItem based on user's role */}
            {userRole === "ROLE_ADMIN" ? (
                <MenuItem component={Link} to="/modifierprofile">
                    <ListItemIcon>
                        <IconUser width={20} />
                    </ListItemIcon>
                    <ListItemText>{username}</ListItemText>
                </MenuItem>
            ) : (
                <MenuItem component={Link} to="/client/profile" >
                <ListItemIcon>
                        <IconUser width={20} />
                    </ListItemIcon>
                    <ListItemText>{username}</ListItemText>
                </MenuItem>
            )}
        </div>
        <MenuItem>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <Link to="/client/Mesquestions" style={{ textDecoration: 'none', color: 'inherit' }}>
      <ListItemText>My Questions</ListItemText>
    </Link>        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconListCheck width={20} />
          </ListItemIcon>
          <Link to="/client/Mesanswers" style={{ textDecoration: 'none', color: 'inherit' }}>
      <ListItemText>My Answers</ListItemText>
    </Link>        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button to="/auth/login" variant="outlined" color="primary" component={Link} fullWidth  onClick={cleanLocalStorage}>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
