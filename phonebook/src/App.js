import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", num: "040-123456", id: 1 },
    { name: "Ada Lovelace", num: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", num: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", num: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNum, setNewNum] = useState("");
  const [filter, setFilter] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (persons.find((person) => person.name === newName))
      return alert(`${newName} is already added to phonebook.`);
    setPersons([...persons, { name: newName, num: newNum }]);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter setFilter={setFilter} />
      <h2>Add new person</h2>
      <AddPerson
        setNewName={setNewName}
        setNewNum={setNewNum}
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

const AddPerson = ({ setNewName, setNewNum, handleSubmit }) => (
  <form>
    <div>
      Name: <input onChange={(e) => setNewName(e.target.value)} />
    </div>
    <div>
      Number: <input onChange={(e) => setNewNum(e.target.value)} />
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
        {person.name} ({person.num})
      </li>
    );
  }
};

export default App;
