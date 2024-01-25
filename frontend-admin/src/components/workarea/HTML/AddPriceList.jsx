import PropTypes from 'prop-types';

function AddPriceList({
  types,
  selectedType,
  setSelectedType,
  newPriceItem,
  setNewPriceItem,
  handleSubmit,
  onRequestClose,
}) {

  // Helper function to convert percentage input to decimal
    const percentageToDecimal = (percentage) => {
        const percentValue = parseFloat(percentage);
        if (isNaN(percentValue)) return null;
        return percentValue / 100;
      };

  // Helper function to convert decimal value to percentage input
  const decimalToPercentage = (decimal) => {
    return (decimal * 100).toString();
  };


  return (
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
            value={newPriceItem.list_name}
            onChange={(e) =>
              setNewPriceItem({ ...newPriceItem, list_name: e.target.value })
            }
            required
          />
        </div>

        {/* Numeric fields for price_per_minute and price_per_unlockand discount */}
        <div className="form-group">
          <label>Price per Minute</label>
          <input
            type="text"
            value={newPriceItem.price_per_minute.toString()}
            onChange={(e) =>
              setNewPriceItem({
                ...newPriceItem,
                price_per_minute: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Price per Unlock</label>
          <input
            type="text"
            value={newPriceItem.price_per_unlock.toString()}
            onChange={(e) =>
              setNewPriceItem({
                ...newPriceItem,
                price_per_unlock: e.target.value,
              })
            }
          />
        </div>

        {/* Numeric field for discount (in percentage, positive value) */}
        <div className="form-group">
          <label>Discount (in percentage)</label>
          <input
            type="text"
            value={newPriceItem.discount !== null ? decimalToPercentage(newPriceItem.discount) : ''}
            onChange={(e) => {
              const discountPercentage = percentageToDecimal(e.target.value);
              setNewPriceItem({
                ...newPriceItem,
                discount: discountPercentage !== null ? discountPercentage : newPriceItem.discount,
              });
            }}
          />
        </div>

        <button type="submit">Save</button>
        <button onClick={onRequestClose}>Cancel</button>
      </form>
    </div>
  );
}

AddPriceList.propTypes = {
    types: PropTypes.array.isRequired,
    selectedType: PropTypes.object.isRequired,
    setSelectedType: PropTypes.func.isRequired,
    newPriceItem: PropTypes.object.isRequired,
    setNewPriceItem: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
  };

export default AddPriceList;
