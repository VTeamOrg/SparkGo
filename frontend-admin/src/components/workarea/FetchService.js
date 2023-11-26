import { API_URL } from '../../../config';

const citiesUrl = `${API_URL}/cities`;
const stationsUrl = `${API_URL}/stations`;

/* FETCH cities data */
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

/* CREATE city */
export const createCity = async (newCity) => {
  try {
    const response = await fetch(citiesUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newCity }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to create city.');
    }
  } catch (error) {
    throw new Error(`Error creating city: ${error.message}`);
  }
};

/* UPDATE city */ 
export const updateCity = async (cityId, updatedCityName) => {
  try {
    const response = await fetch(`${citiesUrl}/${cityId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: updatedCityName }),
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error('Failed to update city.');
    }
  } catch (error) {
    throw new Error(`Error updating city: ${error.message}`);
  }
};

/* DELETE city */ 
export const deleteCity = async (cityId) => {
  try {
    const response = await fetch(`${citiesUrl}/${cityId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error('Failed to delete city.');
    }
  } catch (error) {
    throw new Error(`Error deleting city: ${error.message}`);
  }
};

/* FETCH stations data */
export const fetchStationsData = async (callback) => {
  try {
    const response = await fetch(stationsUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch station data');
    }
    const data = await response.json();
    console.log(data);
    if (typeof callback === 'function') {
      callback(data.data);
    }
  } catch (error) {
    console.error('Error fetching station data:', error);
  }
};

