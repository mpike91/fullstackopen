const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();

// Middleware stack
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("build"));

// Mongoose setup & connection
if (process.argv.length < 3)
  console.log(
    "Mongoose not connected. Provide password, eg: 'npm run dev password'"
  );

const url = `mongodb+srv://fullstack:${process.argv[2]}@cluster0.zaec9je.mongodb.net/noteApp?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

// Mongoose note schema
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// Mongoose Note model
const Note = mongoose.model("Note", noteSchema);

// Base URL
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// Get all notes
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => response.json(notes));
});

// Get node by id
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  note ? response.json(note) : response.status(404).end();
});

// Delete note by id
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

// Generate new id
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

// Create new note
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };

  notes = notes.concat(note);

  response.json(note);
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
