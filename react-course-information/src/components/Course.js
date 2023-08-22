const Course = ({ course }) => {
  return (
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  );
};

const Header = ({ course }) => <h1>{course}</h1>;

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} name={part.name} exercises={part.exercises} />
    ))}
  </>
);

const Part = (props) => (
  <p>
    {props.name} {props.exercises}
  </p>
);

const Total = ({ parts }) => {
  const total = parts.reduce(
    (total, currentElement) => total + currentElement.exercises,
    0
  );
  return (
    <p>
      <b>Total of {total} exercises</b>
    </p>
  );
};

export default Course;
