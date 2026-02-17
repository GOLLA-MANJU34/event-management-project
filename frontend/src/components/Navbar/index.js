import { useNavigate } from "react-router-dom";
import "./index.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <div className="navbar">
      <h2 className="logo">Event Manager</h2>

      <div className="nav-links">
        <button className="nav-button" onClick={() => navigate("/")}>
          Events
        </button>

        <button className="nav-button" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
