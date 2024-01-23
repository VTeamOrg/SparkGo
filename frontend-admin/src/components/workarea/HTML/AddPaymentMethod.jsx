import PropTypes from 'prop-types';

function AddPaymentMethod({ isOpen, onRequestClose, memberId, memberName, selectedPaymentMethod, referenceInfo, setSelectedPaymentMethod, setReferenceInfo, handleSave }) {
  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h2>Add Payment Method</h2>
        <h3> Member: {memberId} - {memberName}</h3>
        <div>
          <label>Payment Method (e.g. VISA, KLARNA):</label>
          <input
            type="text"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Reference Info:</label>
          <input
            type="text"
            value={referenceInfo}
            onChange={(e) => setReferenceInfo(e.target.value)}
            required
          />
        </div>
        <div>
          <button onClick={handleSave}>Save</button>
          <button onClick={onRequestClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

AddPaymentMethod.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    memberId: PropTypes.string.isRequired,
    memberName: PropTypes.string.isRequired,
    selectedPaymentMethod: PropTypes.string.isRequired,
    referenceInfo: PropTypes.string.isRequired,
    setSelectedPaymentMethod: PropTypes.func.isRequired,
    setReferenceInfo: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
  };

export default AddPaymentMethod;
