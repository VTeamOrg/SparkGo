import { API_URL } from '../../../config';

const citiesUrl = `${API_URL}/cities`;
const stationsUrl = `${API_URL}/stations`;

export const fetchCitiesData = async (callback) => {
  try {
    const response = await fetch(citiesUrl);
    if (response.ok) {
      const result = await response.json();

      if (Array.isArray(result.data)) {

        result.data.sort((a, b) => a.name.localeCompare(b.name));
        callback(result.data);
      } else {
        console.error('Received data.data is not an array:', result.data);
      }
    } else {
      console.error('Failed to fetch cities.');
    }
  } catch (error) {
    console.error('Error fetching cities:', error);
  }
};

export const fetchStationsData = async (callback) => {
  try {
    const response = await fetch(stationsUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch station data');
    }
    const data = await response.json();

    if (typeof callback === 'function') {
      callback(data.data);
    }
  } catch (error) {
    console.error('Error fetching station data:', error);
  }
};