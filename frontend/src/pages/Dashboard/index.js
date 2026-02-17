import { useEffect, useState } from "react";
import API from "../../api";
import "./index.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchDashboard();
  }, [token, navigate]);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");

      setEvents(res.data);
    } catch {
      alert("Failed to fetch dashboard");
    }
  };

  const today = new Date();

  const upcoming = events.filter((event) => new Date(event.datetime) >= today);

  const past = events.filter((event) => new Date(event.datetime) < today);

  return (
    <div className="dashboard-container">
      <h2>My Dashboard</h2>

      <h3>Upcoming Events</h3>

      {upcoming.length === 0 && <p>No upcoming events</p>}

      {upcoming.map((event) => (
        <div key={event.id} className="event-card">
          <h4>{event.name}</h4>

          <p>{event.location}</p>

          <p>{event.datetime}</p>
        </div>
      ))}

      <h3>Past Events</h3>

      {past.length === 0 && <p>No past events</p>}

      {past.map((event) => (
        <div key={event.id} className="event-card">
          <h4>{event.name}</h4>

          <p>{event.location}</p>

          <p>{event.datetime}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
