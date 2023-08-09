import { useEffect, useState } from "react";

import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  // Get all persons from server and set them to state
  const getPersons = () => {
    personService.getAll().then((allPersons) => setPersons(allPersons));
  };

  // Upon initial render, getPersons
  useEffect(() => getPersons(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check is person exists already
    const person = persons.find(
      (p) => p.name.toLowerCase() === newName.toLowerCase()
    );

    // If person is not in phonebook, create new person and update state.
    if (!person) {
      personService
        .create({ name: newName, number: newNumber })
        .then((returnedPerson) => setPersons([...persons, returnedPerson]));
    }
    // If person is already in phonebook, alert user before updating.
    else if (
      window.confirm(`${newName} is already added to phonebook. Update number?`)
    ) {
      // If person confirms, then update the user and then repopulate.
      personService
        .update(person.id, { name: newName, number: newNumber })
        .then(() => getPersons());
    }
  };

  const handleDelete = (id) => {
    console.log(id);
    // Alerts user before deletion, then deletes person from server if confirmed and repopulates data from server
    if (window.confirm("Do you really want to delete?")) {
      personService.deleteOne(id).then(() => getPersons());
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter setFilter={setFilter} />
      <h2>Add new person</h2>
      <AddPerson
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Numbers persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

const Filter = ({ setFilter }) => (
  <div>
    Filter shown with: <input onChange={(e) => setFilter(e.target.value)} />
  </div>
);

const AddPerson = ({ setNewName, setNewNumber, handleSubmit }) => (
  <form>
    <div>
      Name: <input onChange={(e) => setNewName(e.target.value)} />
    </div>
    <div>
      Number: <input onChange={(e) => setNewNumber(e.target.value)} />
    </div>
    <button type="submit" onClick={handleSubmit}>
      Add
    </button>
  </form>
);

const Numbers = ({ persons, filter, handleDelete }) => (
  <ul>
    {persons.map((person) => (
      <Person
        key={person.id}
        person={person}
        filter={filter}
        handleDelete={handleDelete}
      />
    ))}
  </ul>
);

const Person = ({ person, filter, handleDelete }) => {
  if (person.name.toLowerCase().includes(filter.toLowerCase())) {
    return (
      <li>
        {person.name} ({person.number}){" "}
        <button onClick={() => handleDelete(person.id)}>Delete</button>
      </li>
    );
  }
};

export default App;
