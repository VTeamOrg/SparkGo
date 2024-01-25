import { API_URL } from '../../../config';

const apiUrl = (endpoint) => `${API_URL}/${endpoint}`;

/* FETCH data for a given endpoint */
export const fetchData = async (endpoint, callback) => {

  try {
    const response = await fetch(apiUrl(endpoint), {
      credentials: 'include', // Include cookies with the request
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data for endpoint: ${endpoint}`);
    }
    const data = await response.json();

    if (typeof callback === 'function') {
      callback(data.data);
    }
  } catch (error) {
    console.error(`Error fetching data for endpoint ${endpoint}:`, error);
  }
};

/* FETCH data for a given endpoint by ID */
export const fetchById = async (endpoint, id) => {
  const endpointWithId = `${endpoint}/${id}`;

  try {
    const response = await fetch(apiUrl(endpointWithId), {
      credentials: 'include', // Include cookies with the request
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data for endpoint ${endpoint} with ID: ${id}`);
    }

    const data = await response.json();
    return data.data; 
  } catch (error) {
    console.error(`Error fetching data for endpoint ${endpoint} with ID ${id}:`, error);
    throw error; 
  }
};

/* CREATE data for a given endpoint */
export const createData = async (endpoint, newData) => {
  try {
    const response = await fetch(apiUrl(endpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newData),
      credentials: 'include', // Include cookies with the request
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Failed to create data for endpoint: ${endpoint}`);
    }
  } catch (error) {
    throw new Error(`Error creating data for endpoint ${endpoint}: ${error.message}`);
  }
};

/* UPDATE data for a given endpoint */
export const updateData = async (endpoint, itemId, updatedData) => {

  if (updatedData.station_id === '') {
    updatedData.station_id = null;
  }

  try {
    const response = await fetch(`${apiUrl(endpoint)}/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
      credentials: 'include', // Include cookies with the request
    });
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      throw new Error(`Failed to update data for endpoint: ${endpoint}`);
    }
  } catch (error) {
    console.error(`Error updating data for endpoint ${endpoint}: ${error.message}`);
    throw new Error(`Error updating data for endpoint ${endpoint}: ${error.message}`);
  }
};

/* DELETE data for a given endpoint */
export const deleteData = async (endpoint, itemId) => {
  try {
    const response = await fetch(`${apiUrl(endpoint)}/${itemId}`, {
      method: 'DELETE',
      credentials: 'include', // Include cookies with the request
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`Failed to delete data for endpoint: ${endpoint}`);
    }
  } catch (error) {
    throw new Error(`Error deleting data for endpoint ${endpoint}: ${error.message}`);
  }
};

