import 'leaflet/dist/leaflet.css';
import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import './index.css';
import App from './App';

// Create the root
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
