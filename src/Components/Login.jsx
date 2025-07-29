// src/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/etech.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login with:", { email, password });

    // You can add real authentication here
    // After success:
    navigate("/dashboard");
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#f0f2f5" }}
    >
      <div
        className="card p-4 shadow rounded"
        style={{ maxWidth: "400px", width: "100%", backgroundColor: "#ffffff" }}
      >
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Logo"
            style={{ width: "100px", height: "auto" }}
          />
        </div>

        <h3 className="text-center mb-3">Login</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
