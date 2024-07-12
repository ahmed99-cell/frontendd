import React from "react";
import { Link } from "react-router-dom";
import "src/views/client/Acceuil.css";
import doubt from "src/assets/images/backgrounds/doubt.png";
import { useTranslation } from "react-i18next";

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: 'white'
};

const contentStyle = {
    flex: 1
};

function Acceuil() {

    const {t}= useTranslation();
    return (
        <div style={containerStyle}>
            <header style={{ height: '60px', marginTop: '20vh', zIndex: 1, backgroundColor: 'white' }}>
                <div className="container mt-1 text-center">
                    <div className="row">
                        <div className="col-lg-6 col-md-12 col-xs-12 mx-4">
                            <div className="contents">
                                <h2 className="head-title">QRSopra<br /><small> {t('ASSP')}</small></h2>
                                <p>{t('AcP')}</p>
                            </div>
                            <div className="d-flex justify-content-start">
                                <Link to={'/client/questionpage'}>
                                    <button className="btn btn-danger custom-btn">{t('Get Started')}</button>
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-5 col-md-12 col-xs-12 mx-3">
                            <div className="intro-img">
                                <img src={doubt} alt="not loaded" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            <div style={contentStyle}></div> {/* Ensures that the footer stays at the bottom */}

            <footer className="text-center text-lg-start" style={{ backgroundColor: '#5c5c5c', width: '100%', marginTop: '14px' }}>
                <div className="text-center text-white p-3" style={{ backgroundColor: '#282828' }}>
                    © 2024 Made With ❤ SopraQR
                </div>
            </footer>
        </div>
    );
}

export default Acceuil;
