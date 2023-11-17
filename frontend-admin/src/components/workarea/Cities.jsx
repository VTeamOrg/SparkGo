import React, { useState, useEffect } from 'react';
import './Cities.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faSearch  } from '@fortawesome/free-solid-svg-icons';

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
 * Loads the list of cities from a database.
 */
  useEffect(() => {
  /**
   * Simulated list of cities
   * @type {string[]}
   */
    const fetchedCities = [
      'Karlskrona',
      'Linköping',
      'Stockholm',
      'Stockholm B',
    ];

    fetchedCities.sort();
    setCities(fetchedCities);

    /**
     * Filter cities based on the search term
     */
    const filtered = fetchedCities.filter((city) =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCities(filtered);
    }, [searchTerm]);

    /**
     * Handles adding a new city.
     */
  const handleAddCity = () => {
    if (newCity.trim() !== '') {
      setCities([...cities, newCity]);
      setNewCity('');
    }
  };

/**
 * Handles deleting a city.
 * @param {string} cityToDelete - The city to be deleted.
 */
  const handleDeleteCity = (cityToDelete) => {
    const updatedCities = cities.filter((city) => city !== cityToDelete);
    setCities(updatedCities);
  };

/* RETURN */
  return (
    <div className="cities">
      <h2>Connected Cities</h2>

      <div className="add-search">
        <button>Add city</button>
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

      <div className="city-list">
        <ul>
          {filteredCities.map((city, index) => (
            <li key={index} className="city-entry">
              <div className="city-info">
                {city}
              </div>
              <div className="city-buttons">
                <button className="edit-button" onClick={() => handleDeleteCity(city)}>
                <FontAwesomeIcon icon={faPencilAlt} />
                </button>
                <button className="delete-button" onClick={() => handleDeleteCity(city)}>
                <FontAwesomeIcon icon={faTrash} /> 
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Cities;
