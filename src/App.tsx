// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import SearchView from './views/SearchView';
import ResultView from './views/ResultView';

const App: React.FC = () => {
  const [initialLocation, setInitialLocation] = useState({ lat: 40.7128, lon: -74.0060 }); // Default location (New York City)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setInitialLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Geolocation not available or permission denied:', error);
        }
      );
    }
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SearchView initialLat={40.7128} initialLon={-74.0060} />} />
          <Route path="/results" element={<ResultView />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
