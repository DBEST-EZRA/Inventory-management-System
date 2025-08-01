import React, { useEffect, useState } from "react";
import { auth, db } from "./Config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "bootstrap/dist/css/bootstrap.min.css";

const AddUser = () => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("staff");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const fetchUsers = () => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(data);
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    const unsub = fetchUsers();
    return () => unsub();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");

    try {
      // Create in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        "123456"
      );
      const newUser = userCredential.user;

      // Add to Firestore
      await addDoc(collection(db, "users"), {
        uid: newUser.uid,
        email,
        username,
        role,
      });

      setMessage("User added successfully!");
      setEmail("");
      setUsername("");
      setRole("staff");
    } catch (err) {
      console.error("Error adding user:", err);
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this user from Firestore?")) {
      try {
        await deleteDoc(doc(db, "users", id));
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Failed to delete user.");
      }
    }
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4 text-center">User Management</h3>

      <div className="mb-4 text-center">
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Hide Form" : "Add New User"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleAddUser}>
              {error && (
                <div className="alert alert-danger text-center">{error}</div>
              )}
              {message && (
                <div className="alert alert-success text-center">{message}</div>
              )}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={username}
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Add User
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">All Users</h5>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => alert("Edit feature not implemented")}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
