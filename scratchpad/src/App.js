// EXERCISES 6-11:
//
// import { useState } from "react";

// const Statistics = ({ good, neutral, bad }) => {
//   if (!(good + neutral + bad)) return <div>No feedback given</div>;
//   return (
//     <table>
//       <tbody>
//         <StatisticsLine text="good" value={good} />
//         <StatisticsLine text="neutral" value={neutral} />
//         <StatisticsLine text="bad" value={bad} />
//         <StatisticsLine text="total" value={good + neutral + bad} />
//         <StatisticsLine
//           text="average"
//           value={Math.floor((good + neutral + bad) / 0.3) / 10}
//         />
//         <StatisticsLine
//           text="positive"
//           value={Math.floor((good / (good + neutral + bad)) * 100)}
//           percentage={true}
//         />
//       </tbody>
//     </table>
//   );
// };

// const StatisticsLine = ({ text, value, percentage }) => {
//   const percSymbol = percentage ? "%" : "";
//   return (
//     <tr>
//       <td>{text}</td>
//       <td>
//         {value}
//         {percSymbol}
//       </td>
//     </tr>
//   );
// };

// const Button = ({ handleClick, text }) => {
//   return <button onClick={handleClick}>{text}</button>;
// };

// const App = () => {
//   // save clicks of each button to its own state
//   const [good, setGood] = useState(0);
//   const [neutral, setNeutral] = useState(0);
//   const [bad, setBad] = useState(0);

//   return (
//     <div>
//       <h1>Give Feedback</h1>
//       <Button handleClick={() => setGood(good + 1)} text="good" />
//       <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
//       <Button handleClick={() => setBad(bad + 1)} text="bad" />
//       <h1>Statistics</h1>
//       <Statistics good={good} neutral={neutral} bad={bad} />
//     </div>
//   );
// };

// export default App;

// EXERCISES 12+:
// import { useState } from "react";

// const Button = ({ handleClick, text }) => {
//   return <button onClick={handleClick}>{text}</button>;
// };

// const App = () => {
//   const anecdotes = [
//     "If it hurts, do it more often.",
//     "Adding manpower to a late software project makes it later!",
//     "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
//     "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
//     "Premature optimization is the root of all evil.",
//     "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
//     "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
//     "The only way to go fast, is to go well.",
//   ];

//   const [selected, setSelected] = useState(anecdotes[0]);
//   const [vote, setVote] = useState(new Array(anecdotes.length + 1).fill(0));
//   const [currIdx, setCurrIdx] = useState(0);

//   const randomIndex = () => {
//     const rndIdx = Math.floor(Math.random() * anecdotes.length);
//     setCurrIdx(rndIdx);
//     return rndIdx;
//   };

//   const handleClickVote = () => {
//     const voteCopy = [...vote];
//     voteCopy[currIdx]++;
//     setVote(voteCopy);
//   };

//   const handleClickAnecdote = () => setSelected(anecdotes[randomIndex()]);

//   const most = () => {
//     const m = Math.max(...vote);
//     return vote.findIndex((x) => x === m);
//   };

//   return (
//     <>
//       <Button handleClick={handleClickVote} text="Vote" />
//       <Button handleClick={handleClickAnecdote} text="Anecdote" />

//       <h1>Anecdote of the Day</h1>
//       <p>Votes: {vote[currIdx]}</p>
//       <p>{selected}</p>
//       <h1>Anecdote with most votes</h1>
//       <p>{anecdotes[most()]}</p>
//       {console.log(vote)}
//     </>
//   );
// };

// export default App;

// PART 2
import { useState, useSyncExternalStore } from "react";
import Note from "./components/Note";

const App = (props) => {
  const [notes, setNotes] = useState(props.notes);
  const [newNote, setNewNote] = useState("A new note...");
  const [showAll, setShowAll] = useState(true);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: notes.length + 1,
    };

    setNotes([...notes, noteObject]);
    setNewNote("");
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? "Important" : "All"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default App;
