'use client';

import { useEffect, useState } from 'react';
import SunnyIcon from '@mui/icons-material/Sunny';
import BedtimeIcon from '@mui/icons-material/Bedtime';


export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    if(darkMode){
      document.documentElement.classList.add('dark');
    }else{
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className=" rounded dark:text-white text-black"
    >
      {darkMode ? <BedtimeIcon/> : <SunnyIcon/>}
    </button>
  );
}
