import axios from 'axios';

// Set up the API base URL, defaulting to localhost:4000 if not defined
const api = axios.create({
  baseURL: 'http://localhost:4000',
});

// Function to search for imagery captures based on latitude and longitude
export const getRecentCaptures = async (lat: number, lon: number) => {
  try {
    const response = await api.get(`/search`, { params: { lat, lon } });
    return response.data;
  } catch (error) {
    console.error("Error fetching search imagery:", error);
    throw error;
  }
};

// Function to get imagery archive for a location
export const getArchiveCaptures = async (lat: number, lon: number) => {
  try {
    const response = await api.get(`/archive`, { params: { lat, lon } });
    return response.data;
  } catch (error) {
    console.error("Error fetching recent captures:", error);
    throw error;
  }
};

// Function to get future capture opportunities
export const getFutureOpportunities = async (lat: number, lon: number) => {
  try {
    const response = await api.get(`/opportunities`, { params: { lat, lon } });
    return response.data;
  } catch (error) {
    console.error("Error fetching future opportunities:", error);
    throw error;
  }
};
