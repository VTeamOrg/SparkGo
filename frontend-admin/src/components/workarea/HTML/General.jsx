import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types'; 

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

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired, 
  setSearchTerm: PropTypes.func.isRequired, 
};

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

  ButtonRow.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    handleEdit: PropTypes.func.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
  };

  function ButtonRowShort({
    isEditing,
    handleEdit,
    setIsEditing,
    handleDelete,
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
      </div>
    );
  }

  ButtonRowShort.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    handleEdit: PropTypes.func.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func,
  };
  
export { ButtonRow, ButtonRowShort, SearchBar } ;
