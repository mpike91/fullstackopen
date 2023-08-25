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
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      note ? response.json(note) : response.status(404).end();
    })
    .catch((error) => next(error));

  // {
  //   console.log("ERROR! SEE BELOW FOR DETAILS:\n", error);
  //   response.status(400).send({ error: "malformatted id" });
  // });
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

// Delete note by id
app.delete("/api/notes/:id", (req, res) => {
  Note.findByIdAndRemove(req.params.id)
    .then((note) => res.status(204).end())
    .catch((error) => next(error));
});

// Toggle importance
app.put("/api/notes/:id", (req, res, next) => {
  const note = {
    content: req.body.content,
    important: req.body.important,
  };
  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then((updatedNote) => res.json(updatedNote))
    .catch((error) => next(error));
});

// Middleware to handle unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// LAST middleware in stack, our custom error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};
app.use(errorHandler);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
