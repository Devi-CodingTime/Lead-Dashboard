import React, { useState } from 'react';

const Checkbox = ({name}) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleCheckboxChange = (value) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((item) => item !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  return (
    <>
    <div className="container d-flex flex-row align-items-center mb-4 gap-2 gap-3" style={{ marginLeft: "-10px" }}>
     
      <div className="form-check">
        <input 
          className="form-check-input"
          type="checkbox"
          id="Android"
          value="Android"
          name={name}
          checked={selectedValues.includes('Android')}
          onChange={() => handleCheckboxChange('Android')}
        />
        <label className="form-check-label" htmlFor="Android">Android</label>
      </div>
      <div className="form-check">
        <input 
          className="form-check-input"
          type="checkbox"
          id="Web"
          value="Web"
          name={name}
          checked={selectedValues.includes('Web')}
          onChange={() => handleCheckboxChange('Web')}
        />
        <label className="form-check-label" htmlFor="Web">Web</label>
      </div>
      <div className="form-check">
        <input 
          className="form-check-input"
          type="checkbox"
          id="iOS"
          value="iOS"
          name={name}
          checked={selectedValues.includes('iOS')}
          onChange={() => handleCheckboxChange('iOS')}
        />
        <label className="form-check-label" htmlFor="iOS">iOS</label>
      </div>
    
    </div>
  </>
  );
};

export default Checkbox;