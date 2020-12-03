// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const eta = require("eta");
// Returns: '<p>My favorite kind of cake is: Chocolate!</p>'
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine("eta", eta.renderFile);

app.set("view engine", "eta");

app.set("views", "./views");

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const Datastore = require('nedb');
    // Security note: the database is saved to the file `datafile` on the local filesystem. It's deliberately placed in the `.data` directory
    // which doesn't get copied if someone remixes the project.
const t_db = new Datastore({ filename: '.data/todos-datafile', autoload: true });

const db = {todos: t_db};

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

// endpoint to get all the dreams in the database
app.get("/todos", (req, res) => {
  db.todos.find({}, function (err, todos) { // Find all users in the collection
    res.render("sent", {todos}); // sends dbUsers back to the page
  });
});

// endpoint to send todo to user
app.post("/new", (request, response) => {
   db.todos.insert({ todo: request.body.todo, from: request.body.from, to: request.body.to}, function (err, todoAdded) {
    if(err) console.log("There's a problem with the database: ", err);
    else if(todoAdded) console.log("New user inserted in the database");
  });
  response.status(200).send('Todo created successfully!');
});

// endpoint to clear dreams from the database
app.get("/clearTodos", (request, response) => {
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
