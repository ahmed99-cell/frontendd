import React, { useState } from 'react';
import './NewNavbar.css';
import sopra from "src/assets/images/logos/sopra (2).svg";
import Profile from "src/layouts/full/header/Profile";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewNavbar = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8082/api/questions/search`, { params: { keyword } });
      setSearchResults(response.data); // Mettre à jour les résultats avec les données de réponse
      onSearch(response.data); // Appeler la fonction de recherche parente avec les résultats
    } catch (error) {
      console.error('There was an error searching for questions!', error);
      // Optionnel : Afficher un message d'erreur à l'utilisateur
    }
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('since');
    localStorage.removeItem('Usertype');
    window.location.reload(true);
    navigate('/');
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-light"
      style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', position: 'fixed', top: 0, zIndex: 9999, width: '100%' }}
    >
      <div className="container-fluid" style={{ height: '50px' }}>
        <div className="navbar-brand d-flex" style={{ fontWeight: '500', color: 'black', paddingTop: '10px' }}>
          <a href="/client/home" style={{ marginLeft: '10px', textDecoration: 'none' }}>
            <img src={sopra} alt="logo" style={{ width: '80px', height: '80px', marginRight: '20px' }} />
          </a>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ bsScrollHeight: '100px' }}></ul>
          <form className="d-flex me-auto" style={{ width: '600px', marginRight: '10px' }} onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              id="searchQue"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button className="btn btn-outline-danger" type="submit">
              Search
            </button>
          </form>
          {/* Afficher les résultats de la recherche */}
          {searchResults.length > 0 && (
            <ul className="list-group mt-3" style={{ width: '100%', position: 'absolute', background: 'white', zIndex: 999 }}>
              {searchResults.map((result) => (
                <li key={result.id} className="list-group-item">{result.title}</li>
                // Personnalisez l'affichage des résultats selon votre structure de données
              ))}
            </ul>
          )}
          <ul className="navbar-nav">
            {localStorage.getItem('Usertype') === 'user' && (
              <li className="nav-item">
                <a className="nav-link mr" href="/editor" style={{ color: 'black' }}>
                  <button className="btn btn-outline dark">&lt;/&gt;</button>
                </a>
              </li>
            )}
            <li className="nav-item">
              <button className="btn btn-white mr-2">
                <i className="fa fa-home"></i>
              </button>
            </li>
            {localStorage.getItem('Usertype') === 'user' && (
              <li className="nav-item">
                <button className="btn btn-outline-danger" onClick={logout}>
                  Logout
                </button>
              </li>
            )}
            {!localStorage.getItem('Usertype') && (
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Profile />
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NewNavbar;

