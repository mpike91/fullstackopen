const App = () => {
  const course = "Half Stack application development";
  const part1 = "Fundamentals of React";
  const exercises1 = 10;
  const part2 = "Using props to pass data";
  const exercises2 = 7;
  const part3 = "State of a component";
  const exercises3 = 14;

  return (
    <div>
      <Header course={course} exercise={exercises1} />
      <Content
        part1={part1}
        part2={part2}
        part3={part3}
        exercises1={exercises1}
        exercises2={exercises2}
        exercises3={exercises3}
      />
      <Total exercises={exercises1 + exercises2 + exercises3} />
    </div>
  );
};

const Header = ({ course, exercise }) => <h1>{course}</h1>;

const Content = (props) => (
  <>
    <Part part={props.part1} exercises={props.exercises1} />
    <Part part={props.part2} exercises={props.exercises2} />
    <Part part={props.part1} exercises={props.exercises3} />
  </>
);

const Part = (props) => (
  <p>
    {props.part} {props.exercises}
  </p>
);

const Total = ({ exercises }) => <p>Number of exercises {exercises}</p>;

export default App;
