import React, { useEffect, useState } from 'react';
import NewNavbar from './homeComponents/NewNavbar';
import Sidebar from './homeComponents/sidebar';
import '../client/Customers.css';
import UserCard from './homeComponents/UserCard';
import axios from 'axios';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Customers = () => {
  const Token = localStorage.getItem('token');
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users', {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      setUsers(response.data);
      console.log('user', response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <NewNavbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <div style={{ marginTop: '13vh', zIndex: 1, backgroundColor: 'white' }}>
            <div className="">
              <div className="stack-index">
                <div className="stack-index-content">
                  <div className="main" style={{marginTop:"10px"}}>
                    <h1 style={{ marginTop: '-20px',color:"black",fontFamily:"inherit",marginLeft:"30PX" }}>Users</h1>
                    <div className="search-bar" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px',marginTop:"-10px",marginLeft:"70%" }}>
                      <TextField
                        type="text"
                        placeholder="Find a user"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        variant="outlined"
                        size="small"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                        style={{
                          width: '200px',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                    <div className="mt-8 user-cards-container ">
                      {filteredUsers.map((user, index) => (
                        <UserCard
                          key={user.matricul}
                          id={user.matricul}
                          username={user.username}
                          email={user.email}
                          score={"100"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customers;
