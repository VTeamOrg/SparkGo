import React, { useState, useEffect } from 'react';
import './Cities.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faSearch  } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../../config';

/**
 * Cities component for managing a list of connected cities.
 * @returns {JSX.Element} JSX representing the cities component.
 */
function Cities() {
/**
 * State to store the list of cities
 */
  const [cities, setCities] = useState([]);
  
/**
 * State to manage the city input field
 */
  const [newCity, setNewCity] = useState('');
  
  /**
 * State to manage the search input field
 */
  const [searchTerm, setSearchTerm] = useState('');

    /**
 * State to manage the filtered cities
 */
  const [filteredCities, setFilteredCities] = useState([]);

  /**
 * URL to API used on this page
 */
  const apiUrl = `${API_URL}/cities`;


  const [editingCityId, setEditingCityId] = useState(null);
  const [editedCityName, setEditedCityName] = useState('');

  /**
 * Fetch cities from the API
 */    
  const fetchCities = async () => {
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const result = await response.json();

        if (Array.isArray(result.data)) {
          /**
           * Sort cities alphabetically by name 
           */ 
          result.data.sort((a, b) => a.name.localeCompare(b.name));
          setCities(result.data);

          /**
           * Filter cities based on the search
           */
          const filtered = result.data.filter((city) =>
            typeof city.name === 'string' &&
            city.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          setFilteredCities(filtered);

          // Emit an event with the updated city data
          const event = new CustomEvent('citiesDataLoaded', { detail: result.data });
          window.dispatchEvent(event);
          console.log(result.data);

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

  /**
 * Effect to load the list of cities from a database and filter 
 * based on search term.
 * Effect is triggered when `searchTerm` change.
 */
  useEffect(() => {
    fetchCities();
  }, [searchTerm]);
  
  /**
   * Handles adding a new city.
   * @async
   * @function
   */
  const handleAddCity = async () => {

    /* Handle empty field */
    if (newCity.trim() === '') {
      return;
    }

    /* Check if the city already exists in the current list */  
    if (cities.some((city) => city.name === newCity)) {
      alert('City already exists.');
      return;
    }

    try {
      /* Make a call to createCity route with the city name in the body */
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newCity }),
      });

      if (response.ok) {

        const createdCity = await response.json();

        /* Update the city list */
        setCities([...cities, createdCity]);

        setNewCity('');
        fetchCities();
      } else {
        console.error('Failed to create city.');
      }
    } catch (error) {
      console.error('Error creating city:', error);
    }
  };



  /**
   * Handles the deletion of a city.
   *
   * @param {object} city - The city object to be deleted.
   */
  const handleDeleteCity = async (city) => {
    try {
      const response = await fetch(`${apiUrl}/${city.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedCities = cities.filter((c) => c.id !== city.id);
        setCities(updatedCities);
        fetchCities();
      } else {
        console.error('Failed to delete city.');
      }
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  };




  /**
   * Handles initiating the edit mode for a city's name.
   * @param {number} cityId - The ID of the city to edit.
   */
  const handleEdit = (cityId) => {
    setEditingCityId(cityId);
    const cityToEdit = cities.find((city) => city.id === cityId);
    setEditedCityName(cityToEdit.name);
  };

  /**
   * Handles changes in the edited city name input field.
   * @param {Object} e - The event object.
   * @param {number} cityId - The ID of the city being edited.
   */
  const handleEditChange = (e, cityId) => {
    setEditedCityName(e.target.value);
  };
 
  /**
   * Handles saving the edited city name.
   * @param {Object} e - The event object.
   * @param {number} cityId - The ID of the city being edited.
   */
  const handleSaveEdit = async (e, cityId) => {
    e.preventDefault();
    const updatedCity = cities.find((city) => city.id === cityId);
    
    try {
      /* Make a call to updateCityById route with the updated city name in the body */
      const response = await fetch(`${apiUrl}/${cityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editedCityName }), 
      });

      if (response.ok) {

        const updatedCities = cities.map((city) =>
          city.id === cityId ? { ...city, editing: false, name: editedCityName } : city
        );
        setCities(updatedCities);

        handleCancelEdit();
      } else {
        console.error('Failed to update city.');
      }
    } catch (error) {
      console.error('Error updating city:', error);
    }
  };

  /**
   * Handles canceling the edit mode for a city's name.
   */
  const handleCancelEdit = () => {
    setEditingCityId(null);
    fetchCities();
  };

  


  /* JSX to render data */
  return (
    <div className="cities">
      <h2>Connected Cities</h2>

      <div className="add-search">

{/* Add city field & button */}
<form
  onSubmit={(e) => {
    e.preventDefault();
    handleAddCity();
  }}
  className="add-city-form" // Add a class for styling
>
  <input
    type="text"
    placeholder="Enter a new city"
    value={newCity}
    onChange={(e) => setNewCity(e.target.value)}
  />
  <button type="submit" className="add-city-button">Add City</button>
</form>

      {/* Search bar */}
      <div className="search-bar">
      <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
      />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </div>
    
    </div>

    {/* Existing cities list */}
    <div className="city-list">
        <ul>

          {filteredCities.map((city, index) => (
            <li key={index} className="city-entry">
              <div className="city-info">
                {editingCityId === city.id ? (
                  <form onSubmit={(e) => handleSaveEdit(e, city.id)}>
                    <input
                      type="text"
                      value={editingCityId === city.id ? editedCityName : city.name}
                      onChange={(e) => handleEditChange(e, city.id)}
                    />
                    <button type="submit">Save</button>
                  </form>
                ) : (
                  city.name
                )}
              </div>
              <div className="city-buttons">
                {editingCityId === city.id ? (
                  <button className="cancel-button" onClick={() => handleCancelEdit()}>
                    Cancel
                  </button>
                ) : (
                  <>
                    <button className="edit-button" onClick={() => handleEdit(city.id)}>
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    <button className="delete-button" onClick={() => handleDeleteCity(city)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}

        </ul>
      </div>
    </div>
  );
}

export default Cities;
