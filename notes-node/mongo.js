const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.zaec9je.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

// Create the schema using the mongoose.Schema() method. This is analagous to a Class "constructor". It sets up the "architecture" of the document
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// Create new model of the noteSchema into "Note". This is like an instance of the noteSchema.
const Note = mongoose.model("Note", noteSchema);

// Create a new note object
// const note = new Note({
//   content: "GET and POST are the most important methods of HTTP protocol",
//   important: true,
// });

// Save note
// note.save().then((result) => {
//   console.log("note saved!");
//   mongoose.connection.close();
// });

// Finding notes
Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
