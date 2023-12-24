import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <FontAwesomeIcon icon={faSearch} className="search-icon" />
    </div>
  );
}

function ButtonRow({
    isEditing,
    handleEdit,
    setIsEditing,
    handleDelete,
    onRequestClose,
  }) {
    return (
      <div className="row">
        {isEditing ? (
          <>
            <button onClick={handleEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </>
        )}
        <button onClick={onRequestClose}>Close</button>
      </div>
    );
  }
  
export { ButtonRow, SearchBar } ;
