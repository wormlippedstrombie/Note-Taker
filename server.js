const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const newNote = req.body;
    newNote.id = Date.now().toString();
    notes.push(newNote);
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
    const idToDelete = req.params.id;
    const notes = JSON.parse(fs.readFileSync('db','db.json'));
    const updatedNotes = notes.filter((note) => note.id !== idToDelete);
    fs.writeFileSync('db','db.json', JSON.stringify(updatedNotes));
    res.json({ message: 'Note deleted successfully' });
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});