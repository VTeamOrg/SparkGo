import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { fetchData } from '../../support/FetchService';

/**
 * EditPriceListModal component for editing a price list item.
 *
 * @param {object} props - The component's props.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {function} props.onRequestClose - Function to close the modal.
 * @param {object} props.priceItem - The price item being edited.
 * @param {function} props.onSave - Function to save the edited price item.
 * @returns {JSX.Element} The EditPriceListModal component JSX.
 */
function EditPriceListModal({ isOpen, onRequestClose, priceItem, onSave }) {
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState({ id: priceItem.type_id });
  const [editedPriceItem, setEditedPriceItem] = useState({
    id: priceItem.id,
    type_id: priceItem.type_id,
    list_name: priceItem.list_name,
    price_per_minute: priceItem.price_per_minute.toString(),
    price_per_unlock: priceItem.price_per_unlock.toString(),
  });

  useEffect(() => {
    fetchData('vehicleTypes', (data) => {
      setTypes(data);
    });
  }, []);

  
    /**
   * Handles the submission of the edited price item.
   */
  const handleSubmit = async () => {

    /* Check if price_per_minute and price_per_unlock are valid numbers */
    const pricePerMinute = parseFloat(editedPriceItem.price_per_minute);
    const pricePerUnlock = parseFloat(editedPriceItem.price_per_unlock);

    if (isNaN(pricePerMinute) || isNaN(pricePerUnlock)) {
      alert('Price fields must be valid numbers.');
      return;
    }

    editedPriceItem.type_id = selectedType.id;
    editedPriceItem.price_per_minute = pricePerMinute;
    editedPriceItem.price_per_unlock = pricePerUnlock;

    onSave(editedPriceItem);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Station Modal"
    >
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
    </Modal>
  );
}

export default EditPriceListModal;
