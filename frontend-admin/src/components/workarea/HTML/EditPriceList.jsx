import React from 'react';

/**
 * EditPriceList component for the HTML portion of editing a price list item.
 *
 * @param {object} props - The component's props.
 * @param {object} props.selectedType - The selected vehicle type.
 * @param {object} props.editedPriceItem - The edited price item.
 * @param {array} props.types - The list of vehicle types.
 * @param {function} props.handleSubmit - Function to handle form submission.
 * @param {function} props.setSelectedType - Function to set the selected vehicle type.
 * @param {function} props.setEditedPriceItem - Function to set the edited price item.
 * @param {function} props.onRequestClose - Function to close the modal.
 * @returns {JSX.Element} The EditPriceList component JSX.
 */
function EditPriceList({
  selectedType,
  editedPriceItem,
  types,
  handleSubmit,
  setSelectedType,
  setEditedPriceItem,
  onRequestClose,
}) {
  return (
    <div className="edit-price-list-modal">
      <h3>Edit Price List</h3>
      <form onSubmit={(e) => handleSubmit(e)}>
        {/* Dropdown list for selecting vehicle type */}
        <div className="form-group">
          <label>Select Vehicle Type</label>
          <select
            value={selectedType.id.toString()}
            onChange={(e) => {
              const selectedTypeId = e.target.value;
              const selectedTypeObj = types.find(
                (type) => type.id.toString() === selectedTypeId
              );
              setSelectedType(selectedTypeObj || { id: '' });
            }}
            required
          >
            <option value="">Select Type</option>
            {types.map((type) => (
              <option key={type.id} value={type.id.toString()}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Text field for list_name */}
        <div className="form-group">
          <label>List Name</label>
          <input
            type="text"
            value={editedPriceItem.list_name}
            onChange={(e) =>
              setEditedPriceItem({ ...editedPriceItem, list_name: e.target.value })
            }
            required
          />
        </div>

        {/* Numeric fields for price_per_minute and price_per_unlock */}
        <div className="form-group">
          <label>Price per Minute</label>
          <input
            type="text"
            value={editedPriceItem.price_per_minute}
            onChange={(e) =>
              setEditedPriceItem({
                ...editedPriceItem,
                price_per_minute: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Price per Unlock</label>
          <input
            type="text"
            value={editedPriceItem.price_per_unlock}
            onChange={(e) =>
              setEditedPriceItem({
                ...editedPriceItem,
                price_per_unlock: e.target.value,
              })
            }
          />
        </div>

        <button type="button" onClick={handleSubmit}>
          Save
        </button>
        <button onClick={onRequestClose}>Cancel</button>
      </form>
    </div>
  );
}

export default EditPriceList;
