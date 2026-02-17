import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import "./index.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (email.trim() === "" || password.trim() === "") {
      setError("Email and password are required");
      return;
    }

    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);

        alert("Login successful");

        navigate("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        <input
          className="login-input"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        <button className="register-button" onClick={goToRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default Login;
