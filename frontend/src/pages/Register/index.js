import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "./index.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      setError("All fields are required");
      return;
    }

    try {
      await API.post("/register", {
        name,
        email,
        password,
      });

      alert("Registration successful");

      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Register</h2>

        <input
          className="register-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="register-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="register-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <button className="register-button" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;
