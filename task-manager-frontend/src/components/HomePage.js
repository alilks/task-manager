import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Import the Navbar component
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import './HomePage.css';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle updating task status
  const handleUpdateTaskStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { status: newStatus });
      fetchTasks(); // Refresh tasks after status update
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks(); // Refresh tasks after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Task Analytics Data
  const taskAnalyticsData = [
    { name: 'Pending', value: tasks.filter((task) => task.status === 'Pending').length },
    { name: 'In Progress', value: tasks.filter((task) => task.status === 'In Progress').length },
    { name: 'Completed', value: tasks.filter((task) => task.status === 'Completed').length },
  ];

  const COLORS = ['#FF8042', '#0088FE', '#00C49F'];

  // Filtered tasks based on search query with safe checks for undefined task.title
  const filteredTasks = tasks.filter((task) => {
    return (
      task.title &&
      typeof task.title === 'string' &&
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="home-container">
      <Navbar />
      <h1>Task Manager Dashboard</h1>

      <div className="analytics-section">
        <h2>Task Analytics</h2>
        <PieChart width={350} height={350}>
          <Pie
            data={taskAnalyticsData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {taskAnalyticsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
        </PieChart>
      </div>

      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />

      <div className="task-buttons">
        <Link to="/tasks" className="view-tasks-button">
          View/Edit Tasks
        </Link>
        <Link to="/create" className="create-task-button">
          Create New Task
        </Link>
      </div>

      {searchQuery && (
        <div className="search-results">
          <h3>Search Results</h3>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div className="search-task-card" key={task.id}>
                <h4>{task.title}</h4>
                <p><strong>Due Date:</strong> {task.dueDate || 'N/A'}</p>
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
                  <button onClick={() => handleDeleteTask(task.id)} className="task-delete-button">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
