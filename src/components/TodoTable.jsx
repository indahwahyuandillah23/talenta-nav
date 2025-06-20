import React, { useState } from 'react';
import EditableCell from './EditableCell';

const TodoTable = ({ todos, setTodos }) => {
  const sumSP = todos.reduce((acc, t) => acc + t.estimatedSP, 0);
  const sumActualSP = todos.reduce((acc, t) => acc + t.actualSP, 0);
  const [sorts, setSorts] = useState([]);

  const handleUpdate = (index, key, value) => {
    const updated = [...todos];
    updated[index][key] = value;
    setTodos(updated);
  };

  const handleUpdateById = (id, key, value) => {
    const updated = todos.map(todo => 
      todo.id === id ? { ...todo, [key]: value } : todo
    );
    setTodos(updated);
  };
  
    const getPercentage = (key, value) => {
        if (todos.length === 0) return 0;
        const count = todos.filter(todo => todo[key] === value).length;
        return Math.round((count / todos.length) * 100);
    };

    const toggleSort = (key) => {
        setSorts(prev => {
            const existing = prev.find(s => s.key === key);
            if (!existing) {
            return [...prev, { key, direction: 'asc' }];
            } else if (existing.direction === 'asc') {
            return prev.map(s => s.key === key ? { ...s, direction: 'desc' } : s);
            } else {
            return prev.filter(s => s.key !== key);
            }
        });
    };

    const renderSortIcon = (key) => {
        const sort = sorts.find(s => s.key === key);
        if (!sort) return null;
        return sort.direction === 'asc' ? '↑' : '↓';
     };

    const sortedTodos = [...todos].sort((a, b) => {
        for (const s of sorts) {
            let valA = a[s.key];
            let valB = b[s.key];

            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();

            if (valA < valB) return s.direction === 'asc' ? -1 : 1;
            if (valA > valB) return s.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });


  return (
    <div>
      <h2 className="text-lg font-bold mb-2">All Task</h2>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2 border border-gray-700 cursor-pointer" onClick={() => toggleSort('title')}>Task {renderSortIcon('title')}</th>
            <th className="p-2 border border-gray-700">Developer</th>
            <th className="p-2 border border-gray-700">Status</th>
            <th className="p-2 border border-gray-700">Priority</th>
            <th className="p-2 border border-gray-700">Type</th>
            <th className="p-2 border border-gray-700">Date</th>
            <th className="p-2 border border-gray-700 cursor-pointer" onClick={() => toggleSort('Estimated SP')}>Estimated SP {renderSortIcon('Estimated SP')}</th>
            <th className="p-2 border border-gray-700 cursor-pointer" onClick={() => toggleSort('Actual SP')}>Actual SP {renderSortIcon('Actual SP')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedTodos.map((todo, idx) => (
            <tr key={todo.id} className="hover:bg-gray-800">
              <td className="p-2 border border-gray-700">
                <EditableCell
                  value={todo.title}
                  onSave={(val) => handleUpdateById(todo.id, 'title', val)}
                />
              </td>
              <td className="p-2 border border-gray-700">
                <EditableCell
                  value={todo.developer}
                  onSave={(val) => handleUpdateById(todo.id, 'developer', val)}
                />
              </td>
              <td className="p-2 border border-gray-700">
                <div className={`px-2 py-1 rounded text-xs ${statusColor(todo.status)}`}>
                    <EditableCell
                        value={todo.status}
                        onSave={(val) => handleUpdateById(todo.id, 'status', val)}
                        options={['Ready to start', 'In Progress', 'Waiting for review', 'Pending Deploy', 'Done', 'Stuck']}
                    />
                </div>
              </td>
              <td className="p-2 border border-gray-700">
                <div className={`px-2 py-1 rounded text-xs ${priorityColor(todo.priority)}`}>
                    <EditableCell
                        value={todo.priority}
                        onSave={(val) => handleUpdateById(todo.id, 'priority', val)}
                        options={['Critical', 'High', 'Medium', 'Low', 'Best Effort']}
                    />
                </div>
              </td>
              <td className="p-2 border border-gray-700">

                <div className={`px-2 py-1 rounded text-xs ${typeColor(todo.type)}`}>
                  <EditableCell
                        value={todo.type}
                        onSave={(val) => handleUpdateById(todo.id, 'type', val)}
                        options={['Feature Enhancements', 'Other', 'Bug']}
                    />
                </div>
              </td>
              <td className="p-2 border border-gray-700">
                <EditableCell
                  value={todo.date}
                  onSave={(val) => handleUpdateById(todo.id, 'date', val)}
                  type="date"
                />
              </td>
              <td className="p-2 border border-gray-700">
                <EditableCell
                  value={todo["Estimated SP"]}
                  onSave={(val) => handleUpdateById(todo.id, 'estimatedSP', parseInt(val))}
                  type="number"
                />
              </td>
              <td className="p-2 border border-gray-700">
                <EditableCell
                  value={todo["Actual SP"]}
                  onSave={(val) => handleUpdateById(todo.id, 'actualSP', parseInt(val))}
                  type="number"
                />
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
            <tr>
                <td colSpan="8" className="p-2 border-t border-gray-700">
                <div className="flex flex-col gap-2 text-xs">
                    <div>
                    <span className="font-bold">Status:</span>
                    {['Ready to start', 'In Progress', 'Waiting for review', 'Pending Deploy', 'Done', 'Stuck'].map((status, i) => (
                        <span key={i} className={`ml-2 px-2 py-1 rounded ${statusColor(status)}`}>
                        {status}: {getPercentage('status', status)}%
                        </span>
                    ))}
                    </div>
                    <div>
                    <span className="font-bold">Priority:</span>
                    {['Critical', 'High', 'Medium', 'Low', 'Best Effort'].map((priority, i) => (
                        <span key={i} className={`ml-2 px-2 py-1 rounded ${priorityColor(priority)}`}>
                        {priority}: {getPercentage('priority', priority)}%
                        </span>
                    ))}
                    </div>
                    <div>
                    <span className="font-bold">Type:</span>
                    {['Feature Enhancements', 'Other', 'Bug'].map((type, i) => (
                        <span key={i} className={`ml-2 px-2 py-1 rounded ${typeColor(type)}`}>
                        {type}: {getPercentage('type', type)}%
                        </span>
                    ))}
                    </div>
                </div>
                </td>
            </tr>
        </tfoot>
      </table>
    </div>
  );
};

const statusColor = (status) => {
  switch (status) {
    case 'Ready to start': return 'bg-purple-600';
    case 'In Progress': return 'bg-yellow-600';
    case 'Waiting for review': return 'bg-gray-600';
    case 'Pending Deploy': return 'bg-blue-600';
    case 'Done': return 'bg-green-600';
    case 'Stuck': return 'bg-red-600';
    default: return 'bg-gray-700';
  }
};

const priorityColor = (priority) => {
  switch (priority) {
    case 'Critical': return 'bg-red-600';
    case 'High': return 'bg-orange-600';
    case 'Medium': return 'bg-blue-600';
    case 'Low': return 'bg-green-600';
    case 'Best Effort': return 'bg-indigo-600';
    default: return 'bg-gray-700';
  }
};

const typeColor = (type) => {
  switch (type) {
    case 'Feature Enhancements': return 'bg-pink-600';
    case 'Other': return 'bg-purple-600';
    case 'Bug': return 'bg-yellow-600';
    default: return 'bg-gray-700';
  }
};

export default TodoTable;
