import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getArchiveCaptures, getFutureOpportunities, getRecentCaptures } from '../api/imageryApi';
import { Capture, ArchiveCapture, FutureOpportunity } from '../types/ImageryTypes';
import './ResultView.css';


const ResultView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const captures = location.state?.captures || [];
  const position = location.state?.position || [0, 0];
  const [activeTab, setActiveTab] = useState<'recent' | 'timeline'>(location.state?.showTimeline ? 'timeline' : 'recent');
  const [recentCaptures, setRecentCaptures] = useState<Capture[]>([]);
  const [archiveCaptures, setArchiveCaptures] = useState<ArchiveCapture[]>([]);
  const [futureOpportunities, setFutureOpportunities] = useState<FutureOpportunity[]>([]);

  const fetchRecentCaptures = async () => {
    try {
      const data = await getRecentCaptures(position[0], position[1]);
      setRecentCaptures(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching recent captures:', error);
    }
  };

  const fetchTimelineData = async () => {
    try {
      const archiveData = await getArchiveCaptures(position[0], position[1]);
      const futureData = await getFutureOpportunities(position[0], position[1]);

      setArchiveCaptures(archiveData ? archiveData.features : []);
      setFutureOpportunities(Array.isArray(futureData) ? futureData : []);
    } catch (error) {
      console.error('Error fetching timeline data:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'recent') {
      fetchRecentCaptures();
    } else if (activeTab === 'timeline') {
      fetchTimelineData();
    }
  }, [activeTab]);

  return (
    <div className="result-view">
      <header className="result-header">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        <h1>{activeTab === 'recent' ? 'Recent Imagery' : 'Timeline'}</h1>
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
        <div className="timeline">
          <ul>
            {archiveCaptures.map((capture) => (
              <li key={capture.properties.captureId} className="timeline-item">
                <div className="timeline-content">
                  <div className="capture-image">
                    <img
                      src={`https://static-maps.yandex.ru/1.x/?ll=${capture.geometry.coordinates[0]},${capture.geometry.coordinates[1]}&z=16&l=sat&size=650,450`}
                      alt={`Capture on ${new Date(capture.properties.captureDate).toLocaleDateString()}`}
                    />
                  </div>
                  <p><strong>Date:</strong> {new Date(capture.properties.captureDate).toLocaleDateString()}</p>
                  <p><strong>Resolution:</strong> {capture.properties.resolution}</p>
                </div>
              </li>
            ))}
            {futureOpportunities.map((opportunity) => (
              <li key={opportunity.opportunityId} className="timeline-item">
                <div className="timeline-content">
                  <p><strong>Estimated Date:</strong> {new Date(opportunity.estimatedCaptureDate).toLocaleDateString()}</p>
                  <p><strong>Confidence:</strong> {opportunity.confidence}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      )}
    </div>
  );
};

export default ResultView;
