import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getArchiveCaptures, getRecentCaptures } from '../api/imageryApi'; 
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import './SearchView.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface SearchViewProps {
  initialLat: number;
  initialLon: number;
}

const SearchView: React.FC<SearchViewProps> = ({ initialLat, initialLon }) => {
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLon]);
  const [locationInfo, setLocationInfo] = useState<string | null>(null);
  const navigate = useNavigate();

  const UpdateMapCenter = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(position, 13); // Update map center
    }, [position, map]);
    return null;
  };

  const handleLocationSelect = async (lat: number, lon: number) => {
    setPosition([lat, lon]); // Update map center

    // Fetch location information (using reverse geocoding)
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: { lat, lon, format: 'json' },
      });
      setLocationInfo(response.data.display_name); // Update location info
    } catch (error) {
      console.error('Error fetching location information:', error);
      setLocationInfo('Unknown location');
    }
  };

  const fetchCapturesAndRedirect = async () => {
    try {
      const captures = await getRecentCaptures(position[0], position[1]);
      navigate('/results', { state: { captures, position, showTimeline: false } });
    } catch (error) {
      console.error('Error fetching captures:', error);
      alert("Failed to fetch past and future captures.");
    }
  };

  const fetchTimelineAndRedirect = async () => {
    try {
      const captures = await getArchiveCaptures(position[0], position[1]);
      navigate('/results', { state: { captures, position, showTimeline: true } });
    } catch (error) {
      console.error('Error fetching timeline data:', error);
      alert("Failed to fetch timeline data.");
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div className="search-bar-container">
        <SearchBar onSelectLocation={handleLocationSelect} />
      </div>

      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <UpdateMapCenter />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <Marker position={position}>
          <Popup>
            <div className="popup-content">
              <p><strong>Coordinates:</strong> {position[0]}, {position[1]}</p>
              <p><strong>Location:</strong> {locationInfo || 'Fetching...'}</p>
              <div className="popup-buttons">
                <button className="show-captures-button" onClick={fetchCapturesAndRedirect}>
                  Show Imagery Captures
                </button>
                <button className="timeline-button" onClick={fetchTimelineAndRedirect}>
                  Timeline
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default SearchView;
