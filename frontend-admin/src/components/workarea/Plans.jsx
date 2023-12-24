import React, { useState, useEffect } from 'react';
import './CSS/ApiTables.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { fetchData, createData, deleteData, updateData } from '../support/FetchService';
import PlanModal from './Modals/PlanModal'; 
import AddPlanModal from './Modals/AddPlanModal'; 

function Plans() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 

  useEffect(() => {
    fetchData('plans', (data) => {
      setPlans(data);
    });
  }, []);

  // Function to open the modal and set the selected plan
  const openPlanModal = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closePlanModal = () => {
    setIsModalOpen(false);
  };

    // Function to refresh plans data after the modal closes
    const refreshPlansData = () => {
      fetchData('plans', (data) => {
        setPlans(data);
      });
    };

      // Function to open the Add Plan modal
  const openAddPlanModal = () => {
    setIsAddModalOpen(true);
  };

  // Function to close the Add Plan modal
  const closeAddPlanModal = () => {
    setIsAddModalOpen(false);
  };

  return (
    <div className="plan">
      <h2>Plans</h2>

      <button onClick={openAddPlanModal}>Add Plan</button>

      {/* Plans Table */}
      <div className="plan-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="plan-row">
                <td>
                  {/* Make each row clickable to open the modal */}
                  <button onClick={() => openPlanModal(plan)}>
                    {plan.title}
                  </button>
                </td>
                <td>{plan.description}</td>
                <td>{plan.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Plan Modal */}
      {isModalOpen && (
        <PlanModal
          isOpen={isModalOpen}
          onRequestClose={closePlanModal}
          plan={selectedPlan}
          refreshPlans={refreshPlansData}
        />
      )}

            {/* Add Plan Modal */}
            {isAddModalOpen && (
        <AddPlanModal
          isOpen={isAddModalOpen}
          onRequestClose={closeAddPlanModal}
          refreshPlans={refreshPlansData}
        />
      )}
    </div>
  );
}

export default Plans;
