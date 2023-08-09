import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const hook = () => {
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  };

  useEffect(hook, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (persons.find((person) => person.name === newName))
      return alert(`${newName} is already added to phonebook.`);
    setPersons([...persons, { name: newName, number: newNumber }]);
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
      <Numbers persons={persons} filter={filter} />
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

const Numbers = ({ persons, filter }) => (
  <ul>
    {persons.map((person) => (
      <Person key={person.name} person={person} filter={filter} />
    ))}
  </ul>
);

const Person = ({ person, filter }) => {
  if (person.name.toLowerCase().includes(filter.toLowerCase())) {
    return (
      <li>
        {person.name} ({person.number})
      </li>
    );
  }
};

export default App;
