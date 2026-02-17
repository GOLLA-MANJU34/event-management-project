import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import Navbar from "../../components/Navbar";
import "./index.css";

function Events() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");

      setEvents(res.data);
    } catch {
      alert("Failed to fetch events");
    }
  };

  const handleRegister = async (eventId) => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await API.post("/register-event", {
        eventId,
      });

      alert("Registered successfully");
    } catch (error) {
      alert("Registration failed");
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase()) ||
      event.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      <div className="events-container">
        <h2 className="events-title">Browse Events</h2>

        <input
          className="search-input"
          placeholder="Search by name, location, or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <p>No events found</p>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="event-card">
                <h3 className="event-name">{event.name}</h3>

                <p>Organizer: {event.organizer}</p>

                <p>Location: {event.location}</p>

                <p>Category: {event.category}</p>

                <p>Date: {event.datetime}</p>

                <p>Capacity: {event.capacity}</p>

                <button
                  className="register-button"
                  onClick={() => handleRegister(event.id)}
                >
                  Register
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Events;
