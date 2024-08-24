const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// In-memory task storage (array)
let tasks = [];

// Route to create a task (POST /tasks)
app.post('/tasks', (req, res) => {
  const { title, dueDate, status = 'Pending', priority = 'Low', category } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = { id: tasks.length + 1, title, dueDate, status, priority, category };
  tasks.push(newTask);
  return res.status(201).json(newTask);
});

// Route to get all tasks (GET /tasks)
app.get('/tasks', (req, res) => {
  return res.json(tasks);
});

// Route to update a task (PUT /tasks/:id)
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, dueDate, status, priority, category } = req.body;
  const task = tasks.find((task) => task.id === parseInt(id));
  if (task) {
    task.title = title || task.title;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.category = category || task.category;
    return res.json(task);
  }
  return res.status(404).json({ error: 'Task not found' });
});

// Route to delete a task (DELETE /tasks/:id)
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((task) => task.id !== parseInt(id));
  return res.status(204).send();
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
