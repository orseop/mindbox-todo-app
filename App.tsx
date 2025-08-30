import React, { useState } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type FilterType = 'all' | 'active' | 'completed';

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date()
    };
    setTodos(prev => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active': return !todo.completed;
      case 'completed': return todo.completed;
      default: return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return {
    todos: filteredTodos,
    activeTodosCount,
    completedCount,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    clearCompleted
  };
};

const TodoItem: React.FC<{ todo: Todo; onToggle: (id: string) => void }> = ({ todo, onToggle }) => {
  return (
    <div style={styles.todoItem}>
      <label style={styles.todoLabel}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          style={styles.checkbox}
        />
        <span style={{
          ...styles.todoText,
          ...(todo.completed && styles.completedText)
        }}>
          {todo.text}
        </span>
      </label>
      <div style={styles.todoTime}>
        {todo.createdAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

const TodoApp: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const {
    todos,
    activeTodosCount,
    completedCount,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    clearCompleted
  } = useTodos();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue.trim());
      setInputValue('');
    }
  };

  const getFilterLabel = (type: FilterType): string => {
    switch (type) {
      case 'all': return 'Все';
      case 'active': return 'Активные';
      case 'completed': return 'Завершенные';
      default: return type;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📝 Мои задачи</h1>
        <div style={styles.stats}>
          <span style={styles.statItem}>Активные: {activeTodosCount}</span>
          <span style={styles.statItem}>Выполнены: {completedCount}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Что нужно сделать?"
          style={styles.input}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
        />
        <button 
          type="submit"
          style={{
            ...styles.addButton,
            ...(!inputValue.trim() && styles.disabledButton)
          }}
          disabled={!inputValue.trim()}
        >
          ➕ Добавить
        </button>
      </form>

      <div style={styles.filterContainer}>
        {(['all', 'active', 'completed'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterButton,
              ...(filter === f && styles.activeFilterButton)
            }}
          >
            {getFilterLabel(f)}
          </button>
        ))}
      </div>

      <div style={styles.todoList}>
        {todos.length === 0 ? (
          <div style={styles.emptyState}>
            {filter === 'completed' 
              ? 'Нет выполненных задач' 
              : filter === 'active' 
              ? 'Все задачи выполнены! 🎉'
              : 'Добавьте первую задачу выше'
            }
          </div>
        ) : (
          todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
            />
          ))
        )}
      </div>

      {completedCount > 0 && (
        <button 
          onClick={clearCompleted}
          style={styles.clearButton}
        >
          🗑️ Очистить выполненные ({completedCount})
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '20px auto',
    padding: '25px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 25px rgba(0, 0, 0, 0.08)',
    minHeight: '500px'
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center' as const
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#2d3748',
    margin: '0 0 15px 0'
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    fontSize: '14px',
    color: '#718096'
  },
  statItem: {
    padding: '6px 16px',
    backgroundColor: '#f7fafc',
    borderRadius: '20px',
    fontWeight: '500'
  },
  form: {
    display: 'flex',
    gap: '12px',
    marginBottom: '25px'
  },
  input: {
    flex: 1,
    padding: '16px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.2s ease',
    ':focus': {
      borderColor: '#4299e1',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
    }
  },
  addButton: {
    padding: '16px 20px',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#3182ce',
      transform: 'translateY(-1px)'
    }
  },
  disabledButton: {
    backgroundColor: '#cbd5e0',
    cursor: 'not-allowed',
    ':hover': {
      backgroundColor: '#cbd5e0',
      transform: 'none'
    }
  },
  filterContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
    justifyContent: 'center'
  },
  filterButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#718096',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': {
      borderColor: '#4299e1',
      color: '#4299e1'
    }
  },
  activeFilterButton: {
    backgroundColor: '#4299e1',
    color: 'white',
    borderColor: '#4299e1',
    ':hover': {
      backgroundColor: '#3182ce',
      borderColor: '#3182ce',
      color: 'white'
    }
  },
  todoList: {
    marginBottom: '20px'
  },
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    marginBottom: '10px',
    backgroundColor: '#f8fafc',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f1f5f9',
      transform: 'translateX(2px)'
    }
  },
  todoLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    cursor: 'pointer',
    flex: 1
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    borderRadius: '4px'
  },
  todoText: {
    fontSize: '16px',
    color: '#2d3748',
    transition: 'all 0.2s ease',
    fontWeight: '500'
  },
  completedText: {
    textDecoration: 'line-through',
    color: '#94a3b8'
  },
  todoTime: {
    fontSize: '12px',
    color: '#94a3b8',
    fontStyle: 'italic'
  },
  emptyState: {
    textAlign: 'center' as const,
    color: '#94a3b8',
    padding: '50px 20px',
    fontSize: '16px',
    fontStyle: 'italic'
  },
  clearButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#fed7d7',
    color: '#c53030',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#feb2b2',
      transform: 'translateY(-1px)'
    }
  }
};

export default TodoApp;