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
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
if(!exists){
  db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS Todos (id INTEGER PRIMARY KEY AUTOINCREMENT, todo TEXT)"
  );
  console.log("New table Dreams created!");
});
// insert default dreams
db.serialize(() => {
  db.run(
    'INSERT INTO Todos (todo) VALUES ("Find and count some sheep"), ("emmanuel.segunlean@aun.edu.ng"), ("eslean20@gmail.com")'
  );
});
}


db.serialize(() => {
  db.each("SELECT * from Todos", (err, row) => {
    if (err) {
      return console.error(err);
    }

    if (row) {
      console.log(`record: ${row.todo}`);
    }
  });

  console.log('Database "Todos" ready to go!');
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/index.html`);
});

app.get("/abc", (request, response) => {
  response.send("yo!");
});

// endpoint to get all the dreams in the database
app.get("/todos", (req, res) => {
  db.all("SELECT * from Todos", (err, rows) => {
    if (err) {
      return res.send(err);
    }
    

    res.render("sent", {
   todos: rows
  })
  });
});

// endpoint to send todo to user
app.post("/new", (request, response) => {
  console.log(`add to dreams ${request.body.todo}`);

  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    const cleansedTodo = cleanseString(request.body.todo);
    db.run(`INSERT INTO Todos (todo) VALUES (?)`, cleansedTodo, error => {
      if (error) {
        response.send({ message: "error!" });
      } else {
        response.send({ message: "success" });
      }
    });
  }

  response.send(`<p>Todo added successfully!</p><p><a href="/todos">todos</a>
  </p><p><a href="/">new todo</a></p>`);
});

// endpoint to clear dreams from the database
app.get("/clearTodos", (request, response) => {
  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    db.each(
      "SELECT * from Todos",
      (err, row) => {
        console.log("row", row);
        db.run(`DELETE FROM Todos WHERE ID=?`, row.id, error => {
          if (row) {
            console.log(`deleted row ${row.id}`);
          }
        });
      },
      err => {
        if (err) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
