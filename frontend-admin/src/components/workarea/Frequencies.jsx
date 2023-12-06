import React, { useState, useEffect } from 'react';
import { fetchData } from '../support/FetchService';

function Frequencies() {
  const [frequencies, setFrequencies] = useState([]);

  useEffect(() => {
    fetchData('frequencies', (data) => {
      setFrequencies(data);
    });
  }, []);

  return (
    <div className="frequencies">
      <h2>Frequencies</h2>

      {/* Frequencies List */}
      <ul>
        {frequencies.map((frequency) => (
          <li key={frequency.id}>
            {frequency.id} 
            {' '} 
            {frequency.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Frequencies;
