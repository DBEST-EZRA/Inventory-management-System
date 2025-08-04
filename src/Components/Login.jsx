import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "./Config";
import { collection, query, where, getDocs } from "firebase/firestore";
import logo from "../assets/etech.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setMessage("");

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get UID from signed-in user
      const uid = userCredential.user.uid;

      // Query Firestore for user document with matching UID
      const q = query(collection(db, "users"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No user data found in Firestore.");
      } else {
        const userData = querySnapshot.docs[0].data();
        const role = userData?.role || "";

        // Redirect based on role
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "staff") {
          navigate("/dashboard");
        } else {
          setError("Access denied: Unknown role.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError(null);
    setMessage("");
    if (!email) {
      setError("Enter your email to reset password.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset link sent. Check your email.");
    } catch (err) {
      console.error("Reset error:", err);
      setError("Failed to send reset email. Try again.");
    }
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
        {/* Logo */}
        <div className="text-center mb-4">
          <img
            src={logo}
            alt="Logo"
            style={{ width: "100px", height: "auto" }}
          />
        </div>

        {/* Title */}
        <h3 className="text-center mb-3">Login</h3>

        {/* Alerts */}
        {error && <div className="alert alert-danger text-center">{error}</div>}
        {message && (
          <div className="alert alert-success text-center">{message}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
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

          {/* Password */}
          <div className="mb-2">
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

          {/* Forgot password */}
          <div className="mb-3 text-end">
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={handleForgotPassword}
              style={{ fontSize: "0.9rem" }}
            >
              Forgot password?
            </button>
          </div>

          {/* Login button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in.." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
