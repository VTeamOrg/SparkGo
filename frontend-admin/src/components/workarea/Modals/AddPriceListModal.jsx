import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { fetchData } from '../../support/FetchService';

/**
 * AddPriceListModal component for adding a new price list item.
 *
 * @param {object} props - The component's props.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {function} props.onRequestClose - Function to close the modal.
 * @param {function} props.onAddPriceItem - Function to add a new price item.
 * @returns {JSX.Element} The AddPriceListModal component JSX.
 */
function AddPriceListModal({ isOpen, onRequestClose, onAddPriceItem }) {
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState({ id: '' });
  const [newPriceItem, setNewPriceItem] = useState({
    type_id: '',
    list_name: '',
    price_per_minute: 0,
    price_per_unlock: 0,
  });

  useEffect(() => {
    fetchData('vehicleTypes', (data) => {
      setTypes(data);
    });
  }, []);

    /**
   * Handles the submission of the new price item.
   *
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
  
    /* Check if price_per_minute and price_per_unlock are valid numbers */
    const pricePerMinute = parseFloat(newPriceItem.price_per_minute);
    const pricePerUnlock = parseFloat(newPriceItem.price_per_unlock);
  
    if (isNaN(pricePerMinute) || isNaN(pricePerUnlock)) {
      alert('Price fields must be valid numbers.');
      return;
    }
  
    /* Update type_id in newPriceItem with the selected type's id */
    newPriceItem.type_id = selectedType.id;
    newPriceItem.price_per_minute = pricePerMinute;
    newPriceItem.price_per_unlock = pricePerUnlock;
 
    onAddPriceItem(newPriceItem);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Station Modal"
    >
      <div className="add-price-list-modal">
        <h3>Add Price List</h3>
        <form onSubmit={handleSubmit}>
          {/* Dropdown list for selecting vehicle type */}
          <div className="form-group">
            <label>Select Vehicle Type</label>
            <select
                value={selectedType.id.toString()} 
                onChange={(e) => {
                    const selectedTypeId = e.target.value;
                    const selectedTypeObj = types.find((type) => type.id.toString() === selectedTypeId); // Convert selectedTypeId to a string for comparison
                    setSelectedType(selectedTypeObj || { id: '' });
                }}
                required
                >
              <option value="">Select Type</option>
              {types.map((type) => (
                <option key={type.id} value={type.id.toString()}> 
                {/* Convert type.id to a string */}
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
              value={newPriceItem.list_name}
              onChange={(e) => setNewPriceItem({ ...newPriceItem, list_name: e.target.value })}
              required
            />
          </div>

            {/* Numeric fields for price_per_minute and price_per_unlock */}
            <div className="form-group">
            <label>Price per Minute</label>
            <input
                type="text" 
                value={newPriceItem.price_per_minute.toString()} 
                onChange={(e) => setNewPriceItem({ ...newPriceItem, price_per_minute: e.target.value })}
            />
            </div>

            <div className="form-group">
            <label>Price per Unlock</label>
            <input
                type="text" 
                value={newPriceItem.price_per_unlock.toString()} 
                onChange={(e) => setNewPriceItem({ ...newPriceItem, price_per_unlock: e.target.value })}
            />
            </div>

          <button type="submit">Save</button>
          <button onClick={onRequestClose}>Cancel</button>
        </form>
      </div>
    </Modal>
  );
}

export default AddPriceListModal;
