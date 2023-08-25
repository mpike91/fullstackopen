require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

// MIDDLEWARE
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("build"));

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
  Person.findById(req.params.id).then((person) => res.json(person));
});

// Create a new person
app.post("/api/persons", (req, res) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  });
  person.save().then((savedPerson) => res.json(savedPerson));
});

// Delete person by id
app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndDelete(req.params.id).then((person) =>
    person
      ? res.status(204).json({})
      : res.status(400).json({ message: "No such id found" })
  );
});

// If unknown endpoint is used, capture and send 404 status
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
