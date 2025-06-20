import { useState, useEffect } from 'react';
import TodoTable from './components/TodoTable';
import KanbanPage from './components/KanbanPage';
import { fetchTodos } from './service/api';
import NewTaskModal from './components/NewTaskModal';

function App() {
  const [todos, setTodos] = useState([]);
  const [view, setView] = useState('table');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [personFilter, setPersonFilter] = useState('');

  useEffect(() => {
    const loadTodos = async () => {
      const data = await fetchTodos();
      console.log(data);
      
      const withId = data.map(todo => ({
        ...todo,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      }));
      setTodos(withId);
    };
    loadTodos();
  }, []);

  const filteredTodos = todos
  .filter(todo => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const title = String(todo.title || '').toLowerCase().trim();
    return title.includes(term);
  })
  .filter(todo => {
    const person = personFilter.toLowerCase().trim();
    if (!person) return true;
    const devList = String(todo.developer || '')
      .split(',')
      .map(dev => dev.trim().toLowerCase());
    return devList.some(dev => dev.includes(person));
  });

    console.log('Search Term:', `"${searchTerm.toLowerCase().trim()}"`);
    console.log('Filtered Titles:', filteredTodos.map(t => t.title));

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {showNewTaskModal && (
        <NewTaskModal 
          onClose={() => setShowNewTaskModal(false)} 
          onSave={(newTask) => setTodos([newTask, ...todos])} 
        />
      )}

      <nav className="flex items-center justify-between border-b border-gray-700 p-4">
        <div className="flex gap-4">
          <button
            onClick={() => setView('table')}
            className={`pb-1 border-b-2 ${
              view === 'table' ? 'border-blue-500 text-blue-400' : 'border-transparent'
            }`}
          >
            Main Table
          </button>
          <button
            onClick={() => setView('kanban')}
            className={`pb-1 border-b-2 ${
              view === 'kanban' ? 'border-green-500 text-green-400' : 'border-transparent'
            }`}
          >
            Kanban
          </button>
          <button className="pb-1 border-b-2 border-transparent">+</button>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm" onClick={() => setShowNewTaskModal(true)}>New Task</button>
          <input 
            type="text" 
            placeholder="Search Task..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 text-sm rounded px-2 py-1 placeholder-gray-400"
          />
          <input 
            type="text"
            placeholder="Filter by Developer..."
            value={personFilter}
            onChange={(e) => setPersonFilter(e.target.value)}
            className="bg-gray-700 text-sm rounded px-2 py-1 placeholder-gray-400"
          />
        </div>
      </nav>

      <main className="p-4">
        {view === 'table' ? (
          <TodoTable todos={filteredTodos} setTodos={setTodos} />
        ) : (
          <KanbanPage todos={filteredTodos} setTodos={setTodos} />
        )}
      </main>
    </div>
  );
}

export default App;
