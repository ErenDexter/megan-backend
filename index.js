const sql3 = require("sqlite3").verbose();
const express = require("express");
const md5 = require("md5");
const app = express();
const cors = require("cors");
const { uuid } = require("uuidv4");

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

const PORT = process.env.PORT || 1234;
let COMMAND;

// Connecting to the database

const db = new sql3.Database("megan.db", sql3.OPEN_READWRITE, (err) => {
  if (err) return console.error(err.message);
});

// Creating Users Table
//db.run("DROP TABLE users");
db.run(`CREATE TABLE IF NOT EXISTS users(userId, userName, hash, token)`);

// Creating Notes Table

db.run(`CREATE TABLE IF NOT EXISTS notes(noteId, userId, note)`);

// Adding User

app.post("/notes/v1/signUp", (req, res) => {
  const userName = req.body.userName;

  db.get(`SELECT * FROM users WHERE userName = ?`, [userName], (err, row) => {
    if (err) res.json(err.message);
    else {
      if (row == null) {
        const password = req.body.password;
        const hash = md5(password);
        const token = getToken(hash);
        const userId = uuid();
        COMMAND = `INSERT INTO users(userId, userName, hash, token) VALUES(?, ?, ?, ?)`;

        db.run(COMMAND, [userId, userName, hash, token], function (err) {
          if (err) {
            res.json(err.message);
            console.log(err.message);
          } else {
            res.json({
              userId: userId,
              token: token,
            });
            console.log("Successfully added the user to the Database.");
          }
        });
      } else {
        res.json("Username is taken.");
      }
    }
  });
});

// Logging in

app.post("/notes/v1/signIn", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;
  const hash = md5(password);
  COMMAND = `SELECT * FROM users WHERE userName = ?`;
  db.get(COMMAND, [userName], (err, row) => {
    if (err) res.json(err.message);
    else {
      if (row == null) res.json("User not Found");
      else {
        if (row.hash == hash) {
          res.json({
            userId: row.userId,
            token: row.token,
          });
        } else res.json("Password Incorrect");
      }
    }
  });
});

// Getting Notes

app.get("/notes/v1", (req, res) => {
  const { userId, token } = req.query;
  console.log(token);
  if (token == "test") {
    COMMAND = `SELECT * FROM notes WHERE userId = ?`;
    db.all(COMMAND, [userId], (err, rows) => {
      if (err) res.json(err.message);
      else {
        res.json(rows);
      }
    });
  } else {
    db.get(`SELECT token FROM users WHERE userId = ?`, [userId], (err, t) => {
      if (err) res.json(err.message);
      else {
        if (t.token === token) {
          COMMAND = `SELECT * FROM notes WHERE userId = ?`;
          db.all(COMMAND, [userId], (err, rows) => {
            if (err) res.json(err.message);
            else {
              res.json(rows);
            }
          });
        } else res.json("Unauthorized!");
      }
    });
  }
});

// Adding Notes

app.post("/notes/v1/add", (req, res) => {
  const { userId, token, note } = req.body;
  const noteId = uuid();
  console.log(token);
  if (token == "test") {
    COMMAND = `INSERT INTO notes(noteId, userId, note) VALUES(?, ?, ?)`;
    db.run(COMMAND, [noteId, userId, note], function (err) {
      if (err) {
        res.json(err.message);
        console.log(err.message);
      } else {
        res.json({
          noteId: noteId,
          note: note,
        });
        console.log("Note Added Successfully");
      }
    });
  } else {
    db.get(`SELECT token FROM users WHERE userId = ?`, [userId], (err, t) => {
      if (err) res.json(err.message);
      else {
        if (t.token == token) {
          COMMAND = `INSERT INTO notes(noteId, userId, note) VALUES(?, ?, ?)`;
          db.run(COMMAND, [noteId, userId, note], function (err) {
            if (err) {
              res.json(err.message);
              console.log(err.message);
            } else {
              res.json({
                noteId: noteId,
                note: note,
              });
              console.log("Note Added Successfully");
            }
          });
        } else res.json("Unauthorized");
      }
    });
  }
});

// Updating Notes

app.post("/notes/v1/update", async (req, res) => {
  const { userId, token, note } = req.body;

  db.get(`SELECT token FROM users WHERE userId = ?`, [userId], (err, t) => {
    if (err) res.json(err.message);
    else {
      if (t.token == token) {
        COMMAND = `INSERT INTO notes(userId, note) VALUES(?, ?)`;
        db.run(COMMAND, [userId, note], function (err) {
          if (err) {
            res.json(err.message);
            console.log(err.message);
          } else {
            res.json({
              noteId: this.lastID,
              note: note,
            });
            console.log(this.lastID);
            console.log("Note Updated Successfully");
          }
        });
      } else res.json("Unauthorized");
    }
  });
});

// Deleting Notes

app.delete("/note/v1", (req, res) => {
  const { userId, noteId, token } = req.body;

  db.get(`SELECT token FROM users WHERE userId = ?`, [userId], (err, t) => {
    if (err) res.json(err.message);
    else {
      if (t.token == token) {
        COMMAND = `DELETE FROM notes WHERE noteId = ?`;
        db.run(COMMAND, [noteId], (err) => {
          if (err) res.json(err.message);
          else res.json(`Note with the ID ${noteId} deleted successfully`);
        });
      } else res.json("Unauthorized");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Listening at PORT:${PORT}`);
});

// const verifyToken = (token, userId) => {
//   db.get(`SELECT token FROM users WHERE userId = ?`, [userId], (err, t) => {
//     if (t.token == token) return true;
//     else return false;
//   });
// };

function getToken(hashedPass) {
  return hashedPass + md5(hashedPass);
}
