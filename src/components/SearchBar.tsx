import React, { useState } from 'react';
import axios from 'axios';
import './SearchBar.css';

interface Props {
  onSelectLocation: (lat: number, lon: number) => void;
}

const SearchBar: React.FC<Props> = ({ onSelectLocation }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: { q: query, format: 'json' },
      });
      
      if (response.data.length === 0) {
        alert("Location not found. Please try another search term.");
        return;
      }

      const { lat, lon } = response.data[0];
      onSelectLocation(parseFloat(lat), parseFloat(lon));
    } catch (error) {
      console.error('Error fetching location:', error);
      alert("There was an error fetching the location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search location"
        className="search-input"
        onKeyPress={handleKeyPress}
      />
      {loading && <div className="spinner"></div>}
    </div>
  );
};

export default SearchBar;
