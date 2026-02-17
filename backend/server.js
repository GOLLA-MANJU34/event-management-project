const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./database");

require("./addEvents");

const app = express();

app.use(cors());
app.use(express.json());

const SECRET = "eventsecret";

function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    req.userId = decoded.userId;

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

app.get("/", (req, res) => {
  res.send("Event Management Backend Running");
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, existingUser) => {
      if (err) {
        return res.status(500).json({
          message: "Server error",
        });
      }

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err) => {
          if (err) {
            return res.status(500).json({
              message: "Registration failed",
            });
          }

          res.json({
            message: "Registration successful",
          });
        }
      );
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password required",
    });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "Server error",
      });
    }

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ userId: user.id }, SECRET);

    res.json({
      message: "Login successful",
      token,
    });
  });
});

app.get("/events", (req, res) => {
  db.all("SELECT * FROM events", [], (err, events) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch events",
      });
    }

    res.json(events);
  });
});

app.get("/events/:id", (req, res) => {
  const eventId = req.params.id;

  db.get("SELECT * FROM events WHERE id = ?", [eventId], (err, event) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch event",
      });
    }

    res.json(event);
  });
});

app.post("/register-event", authenticate, (req, res) => {
  const { eventId } = req.body;

  if (!eventId) {
    return res.status(400).json({
      message: "Event ID required",
    });
  }

  db.get(
    "SELECT * FROM registrations WHERE userId = ? AND eventId = ?",
    [req.userId, eventId],
    (err, existing) => {
      if (existing) {
        return res.status(400).json({
          message: "Already registered",
        });
      }

      db.get(
        "SELECT capacity FROM events WHERE id = ?",
        [eventId],
        (err, event) => {
          if (!event) {
            return res.status(404).json({
              message: "Event not found",
            });
          }

          db.get(
            "SELECT COUNT(*) as total FROM registrations WHERE eventId = ?",
            [eventId],
            (err, result) => {
              if (result.total >= event.capacity) {
                return res.status(400).json({
                  message: "Event full",
                });
              }

              db.run(
                "INSERT INTO registrations (userId, eventId) VALUES (?, ?)",
                [req.userId, eventId],
                (err) => {
                  if (err) {
                    return res.status(500).json({
                      message: "Registration failed",
                    });
                  }

                  res.json({
                    message: "Event registered successfully",
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

app.post("/cancel-event", authenticate, (req, res) => {
  const { eventId } = req.body;

  db.run(
    "DELETE FROM registrations WHERE userId = ? AND eventId = ?",
    [req.userId, eventId],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: "Cancel failed",
        });
      }

      res.json({
        message: "Event cancelled successfully",
      });
    }
  );
});

app.get("/dashboard", authenticate, (req, res) => {
  const query = `
SELECT events.*
FROM events
JOIN registrations
ON events.id = registrations.eventId
WHERE registrations.userId = ?
`;

  db.all(query, [req.userId], (err, events) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch dashboard",
      });
    }

    res.json(events);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
