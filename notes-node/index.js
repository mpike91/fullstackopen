require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const Note = require("./models/note");

// Middleware stack
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("build"));

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
  Note.findById(request.params.id).then((note) => response.json(note));
});

// Delete note by id
app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndDelete(request.params.id).then((note) =>
    note
      ? response.status(204).json({})
      : response.status(400).json({ message: "No such id found" })
  );
});

// Create new note
app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then((savedNote) => response.json(savedNote));
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
