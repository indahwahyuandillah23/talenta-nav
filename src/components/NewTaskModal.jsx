import React, { useState } from 'react';

const NewTaskModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    developer: "",
    status: "Ready to start",
    priority: "Medium",
    type: "Feature Enhancements",
    date: "",
    estimatedSP: 0,
    actualSP: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const task = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      ...formData,
      developer: formData.developer,
      estimatedSP: parseInt(formData.estimatedSP),
      actualSP: parseInt(formData.actualSP),
    };
    onSave(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Add New Task</h2>
        <input name="title" onChange={handleChange} placeholder="Task title" className="w-full mb-2 p-2 rounded bg-gray-700" />
        <input name="developer" onChange={handleChange} placeholder="Developer (comma separated)" className="w-full mb-2 p-2 rounded bg-gray-700" />
        <select name="status" onChange={handleChange} className="w-full mb-2 p-2 rounded bg-gray-700">
          <option>Ready to start</option>
          <option>In Progress</option>
          <option>Waiting for review</option>
          <option>Pending Deploy</option>
          <option>Done</option>
          <option>Stuck</option>
        </select>
        <select name="priority" onChange={handleChange} className="w-full mb-2 p-2 rounded bg-gray-700">
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
          <option>Best Effort</option>
        </select>
        <select name="type" onChange={handleChange} className="w-full mb-2 p-2 rounded bg-gray-700">
          <option>Feature Enhancements</option>
          <option>Other</option>
          <option>Bug</option>
        </select>
        <input name="date" type="date" onChange={handleChange} placeholder="Date" className="w-full mb-2 p-2 rounded bg-gray-700" />
        <input name="estimatedSP" type="number" onChange={handleChange} placeholder="Estimated SP" className="w-full mb-2 p-2 rounded bg-gray-700" />
        <input name="actualSP" type="number" onChange={handleChange} placeholder="Actual SP" className="w-full mb-4 p-2 rounded bg-gray-700" />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-600 px-3 py-1 rounded">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 px-3 py-1 rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
