import React, { useState,useEffect } from 'react';
import './sidebar.css';
import { BsEscape, BsTagFill,BsStar,BsPerson, BsTag, BsQuestionCircle } from 'react-icons/bs';
import { BsQuestionCircleFill } from 'react-icons/bs'; // For "tag" and "question" icons

const SidebarOption = ({ title, children }) => {
  return (
    <div className="sidebar-option">
      <p>{title}</p>
      <div className="link" style={{ marginRight: '20px' }}>
        {children}
      </div>
    </div>
  );
};





const Sidebar = () => {

  const [sidebarHeight, setSidebarHeight] = useState('auto');

useEffect(() => {
  const checkPageHeight = () => {
    const pageHeight = document.documentElement.scrollHeight; // Total height of the page
    if (pageHeight < 800) {
      setSidebarHeight('800px');
    } else {
      setSidebarHeight('110%');
    }
  };

  checkPageHeight();
  window.addEventListener('resize', checkPageHeight); // Recalculate on window resize

  return () => {
    window.removeEventListener('resize', checkPageHeight);
  };
}, []);
  return (
    <div className="">
      <div style={{ height: sidebarHeight, minHeight: '100%', backgroundColor: '#f0f0f0', width: '250px' }}>
      <div
          className=" d-flex flex-column flex-shrink-0 p-3 bg-light "
          style={{ width: '250px', height: '100%' ,boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)"}}
        >
          <a
            href="/"
            className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"
          >
            <svg className="bi me-2" width={40} height={32}>
              <use xlinkHref="#bootstrap" />
            </svg>
            
          </a>
          <hr />
          <ul className="nav nav-pills flex-column mb-auto pt-3">
            <li>
              <a href="/client/questionpage" className="nav-link link-dark">
                <BsQuestionCircle className="me-2" style={{ fontSize: '1.5rem' }} />
                Question
              </a>
            </li>
            <li>
              <a href="/client/tags" className="nav-link link-dark">
                <BsTag className="me-2" style={{ fontSize: '1.5rem' }} />
                Tags
              </a>
            </li>
            <li>
              <a href="/client/Customers" className="nav-link link-dark">
                <BsPerson className="me-2" style={{ fontSize: '1.5rem' }} /> 
                Customers
              </a>
            </li>
            <li>
              <a href="/client/MesQuestionsFavorits" className="nav-link link-dark">
                <BsStar className="me-2" style={{ fontSize: '1.5rem' }} /> 
                <span style={{paddingTop:"6px"}}>Favoris</span>
              </a>
            </li>
          </ul>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
