import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import TaskManagement from './components/TaskManagement';
import TaskCreation from './components/TaskCreation';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tasks" element={<TaskManagement />} />
        <Route path="/create" element={<TaskCreation />} />
      </Routes>
    </Router>
  );
}

export default App;
