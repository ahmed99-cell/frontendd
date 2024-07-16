import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import NewNavbar from './homeComponents/NewNavbar';
import './UserProfile.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=PlusJakartaSans:wght@300,400;700&display=swap');
body{
    Background: #FFF;
    color : #000000;
    font-family : Plus Jakarta Sans,sans-serif;
}
b,strong{
   
}
a{
    color : #fff;
}
p{
    margin : 10px 0;
    line-height: 1.5rem;
}
h1,h2{
    margin-top:20px;
    margin-bottom : 10px;
}
h1{
    font-size: 1.8rem;
}
h2{
    font-size: 1.6rem;
}
blockquote{
    background-color : rgba(0,0,0,0.1);
    padding : 15px;
    border-radius : 4px;
}
`;
const Container = styled.div`
  padding: 70px 20px;
`;

function ProfilePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    username: '',
    password: '',
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem('user')) || {
      username: '',
      email: '',
      nom: '',
      prenom: '',
      avatar: '',
    };
    setFormData(storedUserData);
    if (storedUserData.avatar) {
      setAvatarPreview(storedUserData.avatar);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      avatar: file,
    }));
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = JSON.parse(localStorage.getItem('user'));
    const accessToken = userData?.accessToken;
    const userId = userData?.id;

    function getUserRole() {
      const user = JSON.parse(localStorage.getItem('user'));
      return user?.roles?.includes('ROLE_MODERATOR') ? 'moderator' : 'user';
    }

    if (!accessToken) {
      console.error('Access token is missing from localStorage');
      return;
    }

    if (!userId) {
      console.error('User ID is missing from localStorage');
      return;
    }

    if (
      !formData.prenom ||
      !formData.nom ||
      !formData.email ||
      !formData.username
    ) {
      setErrorMessage('All fields are required');
      return;
    }

    try {
      const role = getUserRole();
      const roles = role === 'mod' ? [{ name: 'ROLE_MODERATOR' }] : [{ name: 'ROLE_USER' }];

      const formDataToSubmit = new FormData();
      formDataToSubmit.append('prenom', formData.prenom);
      formDataToSubmit.append('nom', formData.nom);
      formDataToSubmit.append('email', formData.email);
      formDataToSubmit.append('username', formData.username);
      if (formData.password) {
        formDataToSubmit.append('password', formData.password);
      }
      if (formData.avatar) {
        formDataToSubmit.append('avatar', formData.avatar);
      }
      formDataToSubmit.append('roles', JSON.stringify(roles));

      const response = await axios.put(
        `http://localhost:8080/api/user/${userId}`,
        formDataToSubmit,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setSuccessMessage('Profile updated successfully');
      setErrorMessage('');
      await Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User-Profil updated successfully!',
      });

      const { password, ...userDataWithoutPassword } = formData;
      localStorage.setItem('user', JSON.stringify(userDataWithoutPassword));
      window.location.reload();
    } catch (error) {
      setErrorMessage('Error updating profile');
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while updating the profile. Please try again later.',
      });
    }
  };

  return (
    <>
      <GlobalStyle />
      <NewNavbar />
      <Container style={{ marginTop: '20px' }}>
        <div className="container">
          <div className="row gutters">
            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
              <div className="card h-100">
                <div className="card-body">
                  <div className="account-settings">
                    <div className="user-profile">
                      <div className="user-avatar">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="User Avatar" />
                        ) : (
                          <img
                            src="https://bootdey.com/img/Content/avatar/avatar7.png"
                            alt="Default Avatar"
                          />
                        )}
                      </div>
                      <input type="file" onChange={handleAvatarChange} />
                      <h5 className="user-name">{formData.username}</h5>
                      <h6 className="user-email">{formData.email}</h6>
                    </div>
                    <div className="about">
                      <h5 style={{ color: '#cf022b' }}>About</h5>
                      <p>
                        I'm {formData.username}. Full Stack Designer I enjoy creating user-centric,
                        delightful and human experiences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
              <div className="card h-100">
                <div className="card-body">
                  <div className="row gutters">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <h6 className="mb-2 text" style={{ color: '#cf022b' }}>
                        Personal Details
                      </h6>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          name="username"
                          placeholder="Enter your new username"
                          value={formData.username}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Enter email ID"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="nom">Nom</label>
                        <input
                          type="text"
                          className="form-control"
                          id="nom"
                          name="nom"
                          placeholder="Enter your new nom"
                          value={formData.nom}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                      <div className="form-group">
                        <label htmlFor="prenom">Prenom</label>
                        <input
                          type="text"
                          className="form-control"
                          id="prenom"
                          name="prenom"placeholder="Enter your new prenom"
                          value={formData.prenom}
                          onChange={handleChange}
                          />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row gutters">
                                              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <h6 className="mt-3 mb-2 text" style={{ color: '#cf022b' }}>
                                                  Password
                                                </h6>
                                              </div>
                                              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                  <label htmlFor="password">New Password</label>
                                                  <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    name="password"
                                                    placeholder="Enter your new password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                            <div className="row gutters" style={{ marginTop: '20px' }}>
                                              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <div className="text-right" style={{ spaceBetween: '1px' }}>
                                                  <Link
                                                    to="/client/questionpage"
                                                    className="btn btn-secondary"
                                                    style={{ marginRight: '10px' }}
                                                  >
                                                    Cancel
                                                  </Link>
                                                  <button
                                                    type="button"
                                                    className="btn"
                                                    style={{ marginRight: '20px', backgroundColor: '#cf022b', color: '#fff' }}
                                                    onClick={handleSubmit}
                                                  >
                                                    Update
                                                  </button>
                                                </div>
                                                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                                                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Container>
                              </>
                            );
                          }
                          
                          export default ProfilePage;
                          
