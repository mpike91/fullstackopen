require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

// Mongoose model
const Note = require("./models/note");

// Middleware stack
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("build"));

// Base URL
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

// Get all notes
app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

// Get node by id
app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      note ? res.json(note) : res.status(404).end();
    })
    .catch((error) => next(error));

  // {
  //   console.log("ERROR! SEE BELOW FOR DETAILS:\n", error);
  //   res.status(400).send({ error: "malformatted id" });
  // });
});

// Create new note
app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date().toLocaleString(),
  });

  note
    .save()
    .then((savedNote) => res.json(savedNote))
    .catch((error) => next(error));
});

// Delete note by id
app.delete("/api/notes/:id", (req, res) => {
  Note.findByIdAndRemove(req.params.id)
    .then((note) => res.status(204).end())
    .catch((error) => next(error));
});

// Toggle importance
app.put("/api/notes/:id", (req, res, next) => {
  const { content, important } = req.body;

  Note.findByIdAndUpdate(
    req.params.id, // id to search in db
    { content, important }, // object to "PUT"
    { new: true, runValidators: true, context: "query" } // options
  )
    .then((updatedNote) => res.json(updatedNote))
    .catch((error) => next(error));
});

// Middleware to handle unknown endpoints
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// Our custom error handler middleware. This MUST be the last middleware in the stack!
const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    // CastError thrown when bad id is sent
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    // ValidationError thrown when bad POST data sent, does not fit schema validation
    return res.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
