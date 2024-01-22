import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { fetchData } from '../../support/FetchService';
import EditPriceList from '../HTML/EditPriceList';
import PropTypes from 'prop-types';

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

  EditPriceListModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    priceItem: PropTypes.shape({
      id: PropTypes.number.isRequired,
      type_id: PropTypes.number.isRequired,
      list_name: PropTypes.string.isRequired,
      price_per_minute: PropTypes.string.isRequired,
      price_per_unlock: PropTypes.string.isRequired,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Station Modal"
    >
      {/* Use the EditPriceList component here */}
      <EditPriceList
        selectedType={selectedType}
        editedPriceItem={editedPriceItem}
        types={types}
        handleSubmit={handleSubmit}
        setSelectedType={setSelectedType}
        setEditedPriceItem={setEditedPriceItem}
        onRequestClose={onRequestClose}
      />
    </Modal>
  );
}

export default EditPriceListModal;
