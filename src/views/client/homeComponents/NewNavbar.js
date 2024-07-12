import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './NewNavbar.css';
import sopra from 'src/assets/images/logos/sopra (2).svg';
import Profile from 'src/layouts/full/header/Profile';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { FaLanguage } from 'react-icons/fa6';
import LanguageSwitcher from 'src/languageSwitcher';
import { useTranslation } from 'react-i18next';

const NewNavbar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [unreadNotifications, setUnreadNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8082/api/notifications/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedNotifications = response.data;
        setNotifications(fetchedNotifications);
        setUnreadNotifications(fetchedNotifications.filter(notification => !notification.read));
        console.log(fetchedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('since');
    localStorage.removeItem('Usertype');
    window.location.reload(true);
    navigate('/');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark all notifications as read when dropdown is opened
      const token = localStorage.getItem('token');
      axios.put('http://localhost:8082/api/notifications/mark-all-as-read', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then(() => {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
        setUnreadNotifications([]);
      }).catch(error => {
        console.error('Error marking notifications as read:', error);
      });
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8082/api/notifications/${notificationId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Update state to mark notification as read
      const updatedNotifications = notifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      );
      setNotifications(updatedNotifications);
      setUnreadNotifications(updatedNotifications.filter(notification => !notification.read));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };


  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-light"
      style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', position: 'fixed', top: 0, zIndex: 9999, width: '100%' }}
    >
      <div className="container-fluid" style={{ height: '50px' }}>
        <div className="navbar-brand d-flex" style={{ fontWeight: 500, color: 'black', paddingTop: '10px' }}>
          <a href="/client/home" style={{ marginLeft: '10px', textDecoration: 'none' }}>
            <img src={sopra} alt="logo" style={{ width: '80px', height: '80px', marginRight: '20px' }} />
          </a>
        </div>

        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ bsScrollHeight: '100px' }}></ul>

          <form className="d-flex me-auto" style={{ width: '600px', marginRight: '10px', marginLeft: '70px' }}>
            <input
              className="form-control me-2"
              id="searchQue"
              type="search"
              placeholder={t('Search')}
              aria-label="Search"
            />
            <button className="btn btn-outline-danger" type="submit">
              {t('Search')}
            </button>
          </form>

          <div className="notification-icon" style={{ marginRight: '30px', cursor: 'pointer' }} onClick={toggleNotifications}>
            <IoMdNotificationsOutline style={{ width: '25px', height: '25px' }} />
            <span className="badge rounded-pill badge-notification bg-danger">{unreadNotifications.length}</span>

          </div>

          {/* Dropdown for notifications */}
          {showNotifications && (
            <div className="notifications-dropdown">
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => markNotificationAsRead(notification.id)}
                  >

                    <p style={{ color: "black" }}>
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACgUlEQVR4nO1Zy2oUURBtNC5052vj4x+Enjq2EmioGoILl0ZFPyTqxo2PrENICP6BEhca/A9FP0DNRieGZO7tmLhpqRkddIL0496e7pE+UNDQiz6nbt17q04HQYsWLZyRzs8f3RO6YhkPLGPdCn2wQttG8ENDn63g/fAd7iddROnD4EhQN/bmOheNYNEIbVpBWiSM0GfDeJrEuDBx4v1rl84apjXDOChK/JAQxoFlrOwKnZ4IedOlO5bpmyvxQ8HYMtK5VRnxNAyPGcEz78RlvLSwmsbxjF/y18MTRvCmavJ2VFa0od/0mfnC5NPe9l9RSkTsYSXKlo2rADvcFyuO5Olu2TLwIkCQmi7dLEVejzUr6NUtwDK2+nF4pnj2mdZcNqI3AaJBy4XI6+3oekn5FGAY+wlH5/NnX7DoljHfKwA9lZ7kIq9NlvYpjRMgtKlNY6aAQVfp+LEqBFhBmnCITAGDlrihAmyX7uWp/5eNFSD0InsFdPBoqgCmdzlKyE+rXM0KoJddQh6GlKoEGMb+/y/ATnsJ2enfxFhvrADB8+m+yJgWMgWo6dRUAYl0KF8zx/jUNAGG8TG3m6eOmaea9RZG6HEu8r4GGq/kueBAo1BHoG7i9ncwloKi2JmLTlnG1yYM9btlfVPDl2/XLaDPuFGK/EiEYLU2AVyidMahc2iZIcfdWsRrbybvwNxl2qhsk8oYecGrNIqOeyE/EhHHMxM5mRhL3u31P6FepYvl+G/i9MV5wxY6YoWW9YJxLxf6rlnfmZ09GUwaejuqY1amd9LexggeJd2r54K6oU2Wmk7q26j1oYOHTnbajgx/4umUR29/vVvQrrIRv1lbtAimHz8BNz/RC6gTB7UAAAAASUVORK5CYII="
                        alt="Notification Icon"
                        style={{ width: '24px', height: '24px', marginRight: '10px' }}
                      />{notification.content}</p>                    </div>
                ))
              ) : (
                <p>No unread notifications</p>
              )}
            </div>
          )}

          <ul className="navbar-nav">
            <LanguageSwitcher style={{ marginBottom: '20px' }} />

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