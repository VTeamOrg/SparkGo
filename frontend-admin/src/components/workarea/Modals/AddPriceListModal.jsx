import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { fetchData } from '../../support/FetchService';
import AddPriceList from '../HTML/AddPriceList'; 
import PropTypes from 'prop-types';

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
    discount: 0,
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
    const discount = parseFloat(newPriceItem.discount);

    if (isNaN(pricePerMinute) || isNaN(pricePerUnlock) || isNaN(discount) ) {
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

  AddPriceListModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onAddPriceItem: PropTypes.func.isRequired,
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Add Station Modal">
      <AddPriceList
        types={types}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        newPriceItem={newPriceItem}
        setNewPriceItem={setNewPriceItem}
        handleSubmit={handleSubmit}
        onRequestClose={onRequestClose} 
      />
    </Modal>
  );
}

export default AddPriceListModal;
