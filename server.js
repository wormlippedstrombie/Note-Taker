const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets (CSS, JavaScript)
app.use(express.static('public'));

// HTML routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// API routes
app.get('/api/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync('db.json'));
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  const notes = JSON.parse(fs.readFileSync('db.json'));
  newNote.id = Date.now().toString(); // Unique ID using timestamp
  notes.push(newNote);
  fs.writeFileSync('db.json', JSON.stringify(notes));
  res.json(newNote);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});