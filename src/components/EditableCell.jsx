import React, { useState } from 'react';

const EditableCell = ({ value, onSave, type = 'text', options = [] }) => {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setEditing(false);
  };

  const handleSelectChange = (e) => {
    setCurrentValue(e.target.value);
    onSave(e.target.value);
    setEditing(false);
  };

  return (
    <div onClick={() => setEditing(true)} className="cursor-pointer">
      {editing ? (
        options.length > 0 ? (
          <select
            value={currentValue}
            onChange={handleSelectChange}
            autoFocus
            className="bg-gray-700 rounded p-1 text-sm"
          >
            {options.map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        ) : type === 'date' ? (
          <input
            type="date"
            value={formatDateForInput(currentValue)}
            onChange={(e) => setCurrentValue(formatDateDisplay(e.target.value))}
            onBlur={handleSave}
            autoFocus
            className="bg-gray-700 rounded p-1 text-sm"
          />
        ) : (
          <input
            type={type}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onBlur={handleSave}
            autoFocus
            className="bg-gray-700 rounded p-1 text-sm"
          />
        )
      ) : (
        <span>{currentValue || '-'}</span>
      )}
    </div>
  );
};

const formatDateForInput = (dateStr) => {
  const d = new Date(dateStr);
  return isNaN(d) ? '' : d.toISOString().split('T')[0];
};

const formatDateDisplay = (inputVal) => {
  const d = new Date(inputVal);
  if (isNaN(d)) return '';
  return d.toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
};

export default EditableCell;
