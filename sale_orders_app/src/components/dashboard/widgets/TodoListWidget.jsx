import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';

export default function TodoListWidget() {
  const { state } = useApp();
  const [todos, setTodos] = useState([
    { id: 1, text: 'Review dispatch logs', done: false },
    { id: 2, text: 'Approve new supplier', done: false },
    { id: 3, text: 'Update production plan', done: true }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const handleAdd = (e) => {
    if (e.key === 'Enter' && newTodo.trim()) {
      setTodos([{ id: Date.now(), text: newTodo, done: false }, ...todos]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[18px]">checklist</span>
        Task Board
      </h3>
      <input 
        type="text" 
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyDown={handleAdd}
        placeholder="Add task and press Enter..." 
        className={`w-full text-xs rounded-lg border-outline-variant/30 focus:ring-primary mb-3 ${
          state.dashboardBackground ? 'bg-surface-container/20' : 'bg-surface'
        }`}
      />
      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {todos.map(todo => (
          <div key={todo.id} className="flex items-center gap-2">
            <input 
              type="checkbox" 
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
            />
            <span className={`text-xs ${todo.done ? 'line-through text-on-surface-variant/50' : 'text-on-surface'}`}>
              {todo.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
