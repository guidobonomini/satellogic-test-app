import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getArchiveCaptures, getFutureOpportunities, getRecentCaptures } from '../api/imageryApi';
import './ResultView.css';

interface Capture {
  captureId: string;
  captureDate: string;
  resolution: string;
  location: {
    lat: number;
    lon: number;
  };
}

const ResultView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const captures = location.state?.captures as Capture[] || [];
  const [activeTab, setActiveTab] = useState<'recent' | 'timeline'>(location.state?.showTimeline ? 'timeline' : 'recent');
  const [recentCaptures, setRecentCaptures] = useState<Capture[]>([]);
  const [archiveCaptures, setArchiveCaptures] = useState<Capture[]>([]);
  const [futureOpportunities, setFutureOpportunities] = useState<Date[]>([]);
  const { lat, lon } = captures[0]?.location || { lat: 0, lon: 0 };

  useEffect(() => {
    console.log("Active tab:", activeTab);
    if (activeTab === 'recent') {
      fetchRecentCaptures();
    } else if (activeTab === 'timeline') {
      fetchTimelineData();
    }
  }, [activeTab]);

  const fetchRecentCaptures = async () => {
    try {
      const data = await getRecentCaptures(lat, lon);
      console.log("Fetched recent captures:", data);
      setRecentCaptures(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching recent captures:', error);
    }
  };

  const fetchTimelineData = async () => {
    try {
      const archiveData = await getArchiveCaptures(lat, lon);
      const futureData = await getFutureOpportunities(lat, lon);

      console.log("Fetched archive captures:", archiveData);
      console.log("Fetched future opportunities:", futureData);

      // Parse future opportunities as valid Date objects
      const parsedFutureData = Array.isArray(futureData)
        ? futureData.map(dateStr => new Date(dateStr))
        : [];

      setArchiveCaptures(Array.isArray(archiveData) ? archiveData : []);
      setFutureOpportunities(parsedFutureData);
    } catch (error) {
      console.error('Error fetching timeline data:', error);
    }
  };

  return (
    <div className="result-view">
      <header className="result-header">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        <h1>{activeTab === 'recent' ? 'Recent Imagery' : 'Timeline View'}</h1>
        <div className="tab-switcher">
          <button
            className={`tab-button ${activeTab === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveTab('recent')}
          >
            Recent Imagery
          </button>
          <button
            className={`tab-button ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            Timeline
          </button>
        </div>
      </header>

      {activeTab === 'recent' ? (
        <div className="carousel">
          {recentCaptures.length > 0 ? (
            recentCaptures.map((capture) => (
              <div key={capture.captureId} className="carousel-item">
                <div className="carousel-image">
                  <img
                    src={`https://static-maps.yandex.ru/1.x/?ll=${capture.location.lon},${capture.location.lat}&z=16&l=sat&size=650,450`}
                    alt={`Satellite view of ${capture.captureId}`}
                    className="satellite-image"
                  />
                </div>
                <div className="carousel-details">
                  <p><strong>Date:</strong> {new Date(capture.captureDate).toLocaleDateString()}</p>
                  <p><strong>Resolution:</strong> {capture.resolution}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No recent captures available.</p>
          )}
        </div>
      ) : (
        <div className="timeline-section">
          <h2>Timeline</h2>
          <ul>
            {archiveCaptures.length > 0 ? (
              archiveCaptures.map((capture) => (
                <li key={capture.captureId} className="archive-capture">
                  <div className="capture-image">
                    <img
                      src={`https://static-maps.yandex.ru/1.x/?ll=${capture.location.lon},${capture.location.lat}&z=16&l=sat&size=650,450`}
                      alt={`Archive capture on ${new Date(capture.captureDate).toLocaleDateString()}`}
                      className="satellite-image"
                    />
                  </div>
                  <p><strong>Date:</strong> {new Date(capture.captureDate).toLocaleDateString()}</p>
                  <p><strong>Resolution:</strong> {capture.resolution}</p>
                </li>
              ))
            ) : (
              <p>No archive captures available.</p>
            )}
            {futureOpportunities.length > 0 && (
              <div className="future-opportunities">
                <h3>Future Opportunities</h3>
                <ul>
                  {futureOpportunities.map((date, index) => (
                    <li key={index} className="future-opportunity">
                      <p><strong>Future Opportunity:</strong> {date.toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ResultView;
