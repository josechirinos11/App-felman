// File: src/pages/Home.jsx
import React from 'react';
import bg from '../assets/background22.jpg';

export default function Home() {
  return (
    <div className="home-container">
      <img 
        src={bg}
        alt="Background" 
        className="home-image"
      />
    </div>
  );
}