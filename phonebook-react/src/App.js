import { useEffect, useState } from "react";
import personService from "./services/persons";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    isError: false,
  });

  // Upon initial render, getPersons
  useEffect(() => getPersons(), []);

  // Get all persons from server and set them to state
  const getPersons = () => {
    personService.getAll().then((allPersons) => setPersons(allPersons));
  };

  // Show notification. Receive message to be displayed, and isError value (default false).
  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      setNotification({ ...notification, message: null });
    }, 5000);
  };

  // Add person from form upon submit
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
        .then((returnedPerson) => {
          setPersons([...persons, returnedPerson]);
          showNotification(`Added ${newName}`);
        })
        .catch((e) => {
          console.log(e.response.data.error);
          showNotification(e.response.data.error, true);
        });
    }
    // If person is already in phonebook, alert user before updating.
    else if (
      window.confirm(`${newName} is already added to phonebook. Update number?`)
    ) {
      // If person confirms, then update the user and then repopulate.
      personService
        .update(person.id, { name: newName, number: newNumber })
        .then(() => {
          getPersons();
          showNotification(`Updated ${newName}`);
        })
        .catch((e) => {
          console.log(e.response.data.error);
          showNotification(e.response.data.error, true);
        });
    }
  };

  const handleDelete = (id, name) => {
    // Alerts user before deletion, then deletes person from server if confirmed and repopulates data from server
    if (window.confirm(`Do you really want to delete ${name}?`)) {
      personService
        .deleteOne(id)
        .then(() => {
          getPersons();
          showNotification(`Successfully deleted ${name}`);
        })
        .catch((e) => {
          showNotification(
            `${name} has already been removed from server.`,
            true
          );
        });
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
      <Notification
        message={notification.message}
        isError={notification.isError}
      />
      <h2>Numbers</h2>
      <Numbers persons={persons} filter={filter} handleDelete={handleDelete} />
    </div>
  );
};

const Notification = ({ message, isError }) =>
  message === null ? null : (
    <div
      className="notification"
      style={isError ? { color: "red" } : { color: "green" }}
    >
      {message}
    </div>
  );

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
        <button onClick={() => handleDelete(person.id, person.name)}>
          Delete
        </button>
      </li>
    );
  }
};

export default App;
