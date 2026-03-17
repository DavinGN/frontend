import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import logo from "../assets/library-logo.png";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", { username, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role.name);
      localStorage.setItem("username", res.data.user.username);

      if (res.data.user.role.name !== "admin") {
        alert("Only admin allowed");
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div
      className="login-page d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundImage:
          "url('https://hagiosschooloflife.sch.id/img/about/about-us.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{ width: 350, borderRadius: 16 }}
      >
        <div className="text-center mb-3">
          <img
            src={logo}
            alt="Library Logo"
            style={{ height: 150 }}
          />
          <h4 className="mt-2">Hagios Library</h4>
          <small className="text-muted">Admin Login</small>
        </div>

        <input
          className="form-control mb-3"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
