const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}
const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.zaec9je.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 4) {
  Person.find({}).then((result) => {
    console.log("Phonebook:");
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else createNewPerson();

function createNewPerson() {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({ name, number });

  person.save().then((result) => {
    console.log(`Added "${name} (${number})" to phonebook`);
    mongoose.connection.close();
  });
}
