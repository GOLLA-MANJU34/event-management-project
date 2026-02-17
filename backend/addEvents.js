const db = require("./database");

const events = [
  [
    "React Conference",
    "Meta",
    "Hyderabad",
    "2026-03-10",
    "React learning event",
    100,
    "Tech",
  ],

  [
    "Music Festival",
    "Live Nation",
    "Mumbai",
    "2026-03-15",
    "Music event",
    200,
    "Music",
  ],

  [
    "Startup Meetup",
    "Google",
    "Bangalore",
    "2026-03-20",
    "Startup networking",
    150,
    "Business",
  ],

  ["AI Workshop", "OpenAI", "Chennai", "2026-03-25", "AI workshop", 80, "Tech"],

  [
    "College Fest",
    "IIT",
    "Delhi",
    "2026-04-01",
    "College event",
    300,
    "Education",
  ],
];

events.forEach((event) => {
  db.run(
    `INSERT INTO events
(name,organizer,location,datetime,description,capacity,category)
VALUES(?,?,?,?,?,?,?)`,
    event
  );
});

console.log("Events added successfully");
