// src/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  FaBoxes,
  FaCalendarDay,
  FaFileInvoiceDollar,
  FaConciergeBell,
  FaUser,
} from "react-icons/fa";
import Inventory from "./Inventory";
import UserDailySales from "./UserDailySales";
import UserPendingBills from "./UserPendingBills";
import ServiceSales from "./ServiceSales";
import { auth, db } from "./Config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [active, setActive] = useState("inventory");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUsername(querySnapshot.docs[0].data().username);
      }
    };
    fetchUsername();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const renderContent = () => {
    switch (active) {
      case "inventory":
        return <Inventory />;
      case "daily":
        return <UserDailySales />;
      case "bills":
        return <UserPendingBills />;
      case "services":
        return <ServiceSales />;
      default:
        return <Inventory />;
    }
  };

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-light p-3 d-flex flex-column align-items-center align-items-md-start"
        style={{
          width: "15vw",
          maxWidth: "200px",
          minWidth: "60px",
          flexShrink: 0,
        }}
      >
        <div className="mb-4 w-100 text-center text-md-start">
          <h5 className="d-none d-md-block">Menu</h5>
        </div>

        <nav className="nav flex-column w-100">
          <button
            className={`btn text-start text-light mb-2 w-100 ${
              active === "inventory" ? "bg-secondary" : ""
            }`}
            onClick={() => setActive("inventory")}
            title="Inventory"
          >
            <FaBoxes className="me-2" />
            <span className="d-none d-md-inline">Inventory</span>
          </button>
          <button
            className={`btn text-start text-light mb-2 w-100 ${
              active === "daily" ? "bg-secondary" : ""
            }`}
            onClick={() => setActive("daily")}
            title="Daily Sales"
          >
            <FaCalendarDay className="me-2" />
            <span className="d-none d-md-inline">Daily Sales</span>
          </button>
          <button
            className={`btn text-start text-light mb-2 w-100 ${
              active === "bills" ? "bg-secondary" : ""
            }`}
            onClick={() => setActive("bills")}
            title="Pending Bills"
          >
            <FaFileInvoiceDollar className="me-2" />
            <span className="d-none d-md-inline">Pending Bills</span>
          </button>
          <button
            className={`btn text-start text-light mb-2 w-100 ${
              active === "services" ? "bg-secondary" : ""
            }`}
            onClick={() => setActive("services")}
            title="Service Sales"
          >
            <FaConciergeBell className="me-2" />
            <span className="d-none d-md-inline">Service Sales</span>
          </button>
        </nav>
      </div>

      {/* Main Panel */}
      <div
        className="d-flex flex-column flex-grow-1 bg-light"
        style={{ overflow: "hidden" }}
      >
        {/* Top Bar */}
        <div
          className="d-flex justify-content-end align-items-center p-3 bg-white shadow-sm sticky-top gap-3"
          style={{ zIndex: 100 }}
        >
          <FaUser className="text-secondary" />
          <strong>{username}</strong>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm"
          >
            Logout
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          className="p-4"
          style={{
            overflowY: "auto",
            flexGrow: 1,
            minHeight: 0,
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
