const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

const Header = ({ course }) => <h1>{course}</h1>;

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part name={part.name} exercises={part.exercises} />
    ))}
  </>
);

const Part = (props) => (
  <p>
    {props.name} {props.exercises}
  </p>
);

const Total = (props) => (
  <p>
    Number of exercises{" "}
    {props.parts.reduce(
      (total, currentElement) => total + currentElement.exercises,
      0
    )}
  </p>
);

export default App;
