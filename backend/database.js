const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./event.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,r̥
email TEXT UNIQUE,
password TEXT
)`);

  db.run(`CREATE TABLE IF NOT EXISTS events (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
organizer TEXT,
location TEXT,
datetime TEXT,
description TEXT,
capacity INTEGER,
category TEXT
)`);

  db.run(`CREATE TABLE IF NOT EXISTS registrations (
id INTEGER PRIMARY KEY AUTOINCREMENT,
userId INTEGER,
eventId INTEGER
)`);
});

module.exports = db;
