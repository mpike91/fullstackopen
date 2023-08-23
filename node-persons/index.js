const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

// MIDDLEWARE
app.use(cors());

app.use(express.static("build"));

// Creates request.body property as a json formatted data object, so the rest of our backend can access it and use it.
app.use(express.json());

// Morgan logger
// app.use(morgan("dev"));
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : null,
    ].join(" ");
  })
);

// Base data
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Get info about phonebook
app.get("/info", (req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${Date()}</p>
  `);
});

// Get all persons in phonebook
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// Get specific person from phonebook by id
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  // person ? res.json(person) : res.status(404).end();
  person ? res.json(person) : res.status(400).json({ error: "bad id" });
});

// Create a name and add it to phonebook
app.post("/api/persons", (req, res) => {
  // If missing name or number, return bad request
  if (!req.body.name || !req.body.number)
    return res.status(400).json({ error: "Missing name or number" });

  // If person already exists in phonebook, return bad request
  if (persons.find((person) => person.name === req.body.name))
    return res
      .status(400)
      .json({ error: "That person already exists in the phonebook" });

  const newPerson = { ...req.body, id: Date.now() };
  persons = [...persons, newPerson];
  res.status(201).json(newPerson);
});

// Delete name from phonebook
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(persons);
  persons = persons.filter((person) => person.id !== id);
  console.log(persons);

  res.status(204).end();
});

// This middleware is positioned after all route handlers, such that if no route handler is called, the URL is considered bad and this middleware will be performed.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
