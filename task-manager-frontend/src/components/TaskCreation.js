import React, { useState } from 'react';
import Navbar from './Navbar'; // Import the Navbar component
import axios from 'axios';
import Select from 'react-select';
import './TaskCreation.css';

const TaskCreation = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('Reminders');
  const [dependencies, setDependencies] = useState([]);
  const categories = ['Reminders', 'Work', 'Home', 'School'];

  // Fetch existing tasks for dependencies (optional if you want to implement dependencies)
  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:5000/tasks');
    return response.data;
  };

  const handleCreateTask = async () => {
    if (!taskTitle) return;

    const newTask = {
      title: taskTitle,
      dueDate,
      priority,
      category,
      dependencies,
    };

    await axios.post('http://localhost:5000/tasks', newTask);

    // Reset form
    setTaskTitle('');
    setDueDate('');
    setPriority('Low');
    setCategory('Reminders');
    setDependencies([]);
  };

  return (
    <div className="task-creation-container">
      <Navbar /> {/* Include the Navbar component */}
      <h1>Create a New Task</h1>
      <input
        type="text"
        placeholder="Task title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="input-field"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="input-field"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="input-field"
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="input-field"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <Select
        options={[]} // Implement fetching of tasks for dependencies if needed
        isMulti
        placeholder="Select dependencies"
        value={dependencies.map((dep) => ({
          value: dep,
          label: dep, // Replace with proper task label
        }))}
        onChange={(selectedOptions) =>
          setDependencies(selectedOptions.map((option) => option.value))
        }
        className="dependency-select"
      />
      <button onClick={handleCreateTask} className="create-task-button">
        Create Task
      </button>
    </div>
  );
};

export default TaskCreation;
