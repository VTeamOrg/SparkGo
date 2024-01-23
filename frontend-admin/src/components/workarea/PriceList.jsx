import { useState, useEffect } from 'react';
import './CSS/ApiTables.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { fetchData, createData, deleteData, updateData } from '../support/FetchService';
import AddPriceListModal from './Modals/AddPriceListModal'; 
import EditPriceListModal from './Modals/EditPriceListModal'; 

/**
 * PriceList component for managing pricing and plans.
 *
 * @returns {JSX.Element} The PriceList component JSX.
 */
function PriceList() {
  const [priceList, setPriceList] = useState([]);
  const [showAddPriceListModal, setShowAddPriceListModal] = useState(false);
  const [editingPriceItem, setEditingPriceItem] = useState(null);
  const [showEditPriceListModal, setShowEditPriceListModal] = useState(false);

  useEffect(() => {
    fetchData('priceList', (data) => {
      setPriceList(data);
    });
  }, []);

  const handleEditPriceItem = (priceItem) => {
    setEditingPriceItem(priceItem);
    setShowEditPriceListModal(true);
  };

    /**
   * Handles editing a price item and opens the edit modal.
   *
   * @param {object} priceItem - The price item to edit.
   */
  const handleSaveEdit = async (updatedPriceListItem) => {
    try {
  
      const updatedItem = await updateData('priceList', updatedPriceListItem.id, updatedPriceListItem);
    
      if (updatedItem) {
        refreshData()
  
        setEditingPriceItem(null);
        setShowEditPriceListModal(false);
      } else {
        console.error('Error updating price item:', updatedItem);
      }
    } catch (error) {
      console.error('Error editing price item:', error);
    }
  };

  /**
 * Handles deleting a price item and updates the price list.
 *
 * @param {object} priceItemToDelete - The price item to delete.
 * @returns {Promise<void>} A promise that resolves after the delete operation.
 */
  const handleDeletePriceItem = async (priceItemToDelete) => {
    try {
      await deleteData('priceList', priceItemToDelete.id);
      const updatedPriceList = priceList.filter((item) => item.id !== priceItemToDelete.id);
      setPriceList(updatedPriceList);
    } catch (error) {
      console.error('Error deleting price item:', error);
    }
  };

/**
 * Opens the Add Price List modal.
 */
  const openAddPriceListModal = () => {
    setShowAddPriceListModal(true);
  };

/**
 * Closes the Add Price List modal and refreshes the price list data.
 */
  const closeAddPriceListModal = () => {
    setShowAddPriceListModal(false);
    fetchData('priceList', (data) => {
      setPriceList(data); 
    });
  };

/**
 * Handles adding a new price item, updates the price list, and closes the Add Price List modal.
 *
 * @param {object} newPriceItem - The new price item to add.
 */
const handleAddPriceItem = (newPriceItem) => {
  createData('priceList', newPriceItem)
    .then(() => {
      fetchData('priceList', (data) => {
        setPriceList(data);
      });
      closeAddPriceListModal(); 
    })
    .catch((error) => {
      console.error('Error adding price item:', error);
    });
};

/**
 * Refreshes the price list data by fetching it from the API and updating the state.
 */
const refreshData = () => {
  fetchData('priceList', (data) => {
    setPriceList(data);
  });
};

  /* JSX to render station data */
    return (
      <div className="api">
        <h2>Price lists</h2>

        {/* Add Price List */}
        <button className="add-price-list-button" onClick={openAddPriceListModal}>
          Add Price List
        </button>
    
        {/* Pricing Table */}
        <div className="api-table">
          <table>
            <thead>
              <tr>
                <th>Pricing Name</th>
                <th>Vehicle Type</th>
                <th>Price per Minute</th>
                <th>Price per Unlock</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {priceList.map((priceItem) => (
                <tr key={priceItem.id} className="api-row">
                  <td>{priceItem.list_name}</td>
                  <td>{priceItem.type_name}</td>
                  <td>{priceItem.price_per_minute}</td>
                  <td>{priceItem.price_per_unlock}</td>
                  <td className="api-edit">
                    <button onClick={() => handleEditPriceItem(priceItem)}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                    </td>
                    <td className="api-delete">
                    <button onClick={() => handleDeletePriceItem(priceItem)}>
                    <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    
        {/* AddPriceListModal component */}
        {showAddPriceListModal && (
          <AddPriceListModal
            isOpen={showAddPriceListModal}
            onRequestClose={() => closeAddPriceListModal(false)}
            onAddPriceItem={handleAddPriceItem}
          />
        )}
    
        {/* EditPriceListModal component */}
        {editingPriceItem && (
          <EditPriceListModal
          isOpen={showEditPriceListModal}
          onRequestClose={() => setShowEditPriceListModal(false)}
          priceItem={editingPriceItem}
          onSave={handleSaveEdit}
        />
        )}
    
      </div>
    );
    
  
  
}

export default PriceList;
