// DarkModeToggle.jsx

import React, { useEffect } from 'react';
import Darkmode from 'darkmode-js';

const DarkModeToggle = () => {
  useEffect(() => {
    const options = {
      bottom: '64px',
      right: 'unset',
      left: '32px',
      time: '0.5s',
      mixColor: '#fff',
      backgroundColor: '#fff',
      buttonColorDark: '#100f2c',
      buttonColorLight: '#fff',
      saveInCookies: true,
      label: '🌓',
      autoMatchOsTheme: true
    };

    const darkmode = new Darkmode(options);
    darkmode.showWidget(); // Automatically shows the dark mode toggle button

    // Clean up function
    return () => {
      darkmode.destroy(); // Clean up Darkmode instance
    };
  }, []); // Run only once on component mount

  return null; // Dark mode toggle button is shown automatically
};

export default DarkModeToggle;
