require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

// MIDDLEWARE
app.use(express.static("build"));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// ROUTE HANDLERS
// Get info about phonebook
app.get("/info", (req, res) => {
  Person.find({}).then((p) => {
    res.send(`
      <p>Phonebook has info for ${p.length} people</p>
      <p>${Date()}</p>
    `);
  });
});

// Get all persons
app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

// Get person by id
app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then((person) => res.json(person))
    .catch((error) => next(error));
});

// Create a new person
app.post("/api/persons", (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  });
  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((e) => next(e));
});

// Update a person
app.put("/api/persons/:id", (req, res, next) => {
  const person = { name: req.body.name, number: req.body.number };
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((person) => res.json(person))
    .catch((error) => next(error));
});

// Delete person by id
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((person) => res.status(204).end())
    .catch((error) => next(error));
});

// If unknown endpoint is used, capture and send 404 status
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint. Did you forget '/api'?" });
};
app.use(unknownEndpoint);

// ERROR HANDLER MIDDLEWARE
const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }
  // If unknown error, pass it to express's default error handler:
  next(error);
};
app.use(errorHandler);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
