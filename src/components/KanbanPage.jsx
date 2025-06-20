import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const statuses = [
  'Ready to start',
  'In Progress',
  'Waiting for review',
  'Pending Deploy',
  'Done',
  'Stuck'
];

const statusColors = {
  'Ready to start': 'bg-purple-600',
  'In Progress': 'bg-yellow-600',
  'Waiting for review': 'bg-gray-600',
  'Pending Deploy': 'bg-blue-600',
  'Done': 'bg-green-600',
  'Stuck': 'bg-red-600'
};

const priorityColors = {
  'Critical': 'bg-red-600',
  'High': 'bg-orange-500',
  'Medium': 'bg-blue-500',
  'Low': 'bg-green-500',
  'Best Effort': 'bg-indigo-500'
};

const typeColors = {
  'Feature Enhancements': 'bg-pink-500',
  'Other': 'bg-purple-500',
  'Bug': 'bg-yellow-500'
};

const KanbanPage = ({ todos, setTodos }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key !== key) {
        return { key, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return { key: null, direction: null };
    });
  };

  const sortTodos = (list) => {
    if (!sortConfig.key || !sortConfig.direction) return list;

    return [...list].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const grouped = statuses.reduce((acc, status) => {
    acc[status] = sortTodos(todos.filter(t => t.status === status));
    return acc;
  }, {});

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;

    const updated = todos.map(todo =>
      todo.id === draggableId
        ? { ...todo, status: destination.droppableId }
        : todo
    );

    setTodos(updated);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-2 mb-2">
        <span className="text-sm text-white">Sort by:</span>
        <button onClick={() => toggleSort('title')} className="bg-gray-700 text-sm px-2 rounded">Title</button>
        <button onClick={() => toggleSort('priority')} className="bg-gray-700 text-sm px-2 rounded">Priority</button>
        <button onClick={() => toggleSort('type')} className="bg-gray-700 text-sm px-2 rounded">Type</button>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {statuses.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-900 rounded-lg p-2 min-w-[240px] shadow-md"
              >
                <h3 className={`text-sm font-bold mb-2 text-white px-2 py-1 rounded ${statusColors[status]}`}>
                  {status}
                </h3>
                {grouped[status].map((todo, index) => (
                  <Draggable
                    key={todo.id}
                    draggableId={todo.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-gray-800 p-2 rounded-lg mb-2 shadow hover:shadow-lg transition"
                      >
                        <div className="font-bold mb-1">{todo.title}</div>
                        <div className="flex flex-wrap gap-1 text-xs">
                          <span className={`text-white px-1 rounded ${priorityColors[todo.priority] || 'bg-gray-600'}`}>
                            {todo.priority}
                          </span>
                          <span className={`text-white px-1 rounded ${typeColors[todo.type] || 'bg-gray-600'}`}>
                            {todo.type}
                          </span>
                        </div>
                        <div className="text-xs mt-1">Est SP: {todo["estimatedSP"]}</div>
                        <div className="text-xs">Dev: {todo.developer}</div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanPage;
