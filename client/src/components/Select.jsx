import React, { useState } from 'react';

const Select = ({option1, option2,name}) => {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="container">
     
      <select name={name}
        className="form-select" style={{marginLeft:"-10px"}}
        value={selectedOption}
        onChange={handleChange}
      >
        <option value="">Select an option</option>
        <option value={option1}>{option1}</option>
        <option value={option2}>{option2}</option>
      </select>
    </div>
  );
};

export default Select;
