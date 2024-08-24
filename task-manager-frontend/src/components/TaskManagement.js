import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Import the Navbar component
import axios from 'axios';
import './TaskManagement.css';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [category, setCategory] = useState('Reminders');

  const categories = ['Reminders', 'Work', 'Home', 'School'];

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:5000/tasks');
    setTasks(response.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle editing a task
  const handleEditTask = (task) => {
    setEditMode(true);
    setEditTaskId(task.id);
    setTaskTitle(task.title);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setCategory(task.category);
  };

  // Handle saving the edited task
  const handleSaveTask = async () => {
    await axios.put(`http://localhost:5000/tasks/${editTaskId}`, {
      title: taskTitle,
      dueDate,
      priority,
      category,
    });
    setEditMode(false);
    setEditTaskId(null);
    setTaskTitle('');
    setDueDate('');
    setPriority('Low');
    setCategory('Reminders');
    fetchTasks(); // Refresh tasks after saving
  };

  // Handle deleting a task
  const handleDeleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks(); // Refresh tasks after deletion
  };

  // Handle updating task status
  const handleUpdateTaskStatus = async (id, newStatus) => {
    await axios.put(`http://localhost:5000/tasks/${id}`, { status: newStatus });
    fetchTasks(); // Refresh tasks after status update
  };

  return (
    <div className="task-management-container">
      <Navbar /> {/* Include the Navbar component */}
      <h1>View and Edit Tasks</h1>

      {editMode ? (
        <div className="edit-task-form">
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
          <button onClick={handleSaveTask} className="save-task-button">
            Save Task
          </button>
          <button onClick={() => setEditMode(false)} className="cancel-edit-button">
            Cancel
          </button>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <h3>{task.title}</h3>
              <p><strong>Due:</strong> {task.dueDate || 'N/A'}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Category:</strong> {task.category}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <div className="task-actions">
                <select
                  value={task.status}
                  onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                  className="task-status-dropdown"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button onClick={() => handleEditTask(task)} className="task-edit-button">Edit</button>
                <button onClick={() => handleDeleteTask(task.id)} className="task-delete-button">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
