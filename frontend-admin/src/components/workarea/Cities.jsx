import React, { useState, useEffect } from 'react';
import './Cities.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faSearch  } from '@fortawesome/free-solid-svg-icons';
import { fetchData, createData, deleteData, updateData } from '../support/FetchService';

/**
 * Cities component for managing a list of connected cities.
 * @returns {JSX.Element} JSX representing the cities component.
 */
function Cities() {
/**
 * State to store the list of cities.
 * @type {Array}
 */
const [cities, setCities] = useState([]);

/**
 * State to manage the city input field.
 * @type {string}
 */
const [newCity, setNewCity] = useState('');

/**
 * State to manage the search input field.
 * @type {string}
 */
const [searchTerm, setSearchTerm] = useState('');

/**
 * State to manage the filtered cities.
 * @type {Array}
 */
const [filteredCities, setFilteredCities] = useState([]);

/**
 * State to keep track of the ID of the city being edited.
 * @type {?number}
 */
const [editingCityId, setEditingCityId] = useState(null);

/**
 * State to store the edited city name.
 * @type {string}
 */
const [editedCityName, setEditedCityName] = useState('');

/**
 * Fetch cities from the API and update component state.
 *
 * @param {Array} data - The data received from the API containing city information.
 */
  const fetchDataAndUpdateState = (data) => {
    /* Sort cities alphabetically */
    data.sort((a, b) => a.name.localeCompare(b.name));

    /* Emit an event with the updated city data */
    const event = new CustomEvent('citiesDataLoaded', { detail: data });
    window.dispatchEvent(event);

    /* Update component's state */
    setCities(data);

    /* Filter cities based on the search */
    const filtered = data.filter((city) =>
      typeof city.name === 'string' && city.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  /**
   * Effect to load the list of cities from a database and filter 
   * based on search term.
   * Effect is triggered when `searchTerm` change.
   */
  useEffect(() => {
    fetchData('cities', fetchDataAndUpdateState);
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
      const createdCity = await createData('cities', { name: newCity });

      /* Update the city list */
      setCities([...cities, createdCity]);

      setNewCity('');
      fetchData('cities', fetchDataAndUpdateState);
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * Handles the deletion of a city.
   *
   * @param {object} city - The city object to be deleted.
   */
  const handleDeleteCity = async (city) => {
    try {
      const success = await deleteData('cities', city.id);

      if (success) {
        const updatedCities = cities.filter((c) => c.id !== city.id);
        setCities(updatedCities);
        fetchData('cities', fetchDataAndUpdateState);
      } else {
        console.error('Failed to delete city.');
      }
    } catch (error) {
      console.error(error.message);
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
      const success = await updateData('cities', cityId, {
        name: editedCityName
      });

      if (success) {
        const updatedCities = cities.map((city) =>
          city.id === cityId ? { ...city, editing: false, name: editedCityName } : city
        );
        setCities(updatedCities);
        fetchData('cities', fetchDataAndUpdateState);
        handleCancelEdit();
      } else {
        console.error('Failed to update city.');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  /**
   * Handles canceling the edit mode for a city's name.
   */
  const handleCancelEdit = () => {
    setEditingCityId(null);
    fetchData('cities', fetchDataAndUpdateState);
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
        className="add-city-form"
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
