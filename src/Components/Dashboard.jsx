// src/Dashboard.jsx
import React, { useState } from "react";
import {
  FaBoxes,
  FaCalendarDay,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaConciergeBell,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import Inventory from "./Inventory"; // Create this component
import DailySales from "./DailySales";
import MonthlySales from "./MonthlySales";
import PendingBills from "./PendingBills";
import ServiceSales from "./ServiceSales";

const Dashboard = () => {
  const [active, setActive] = useState("inventory");

  const renderContent = () => {
    switch (active) {
      case "inventory":
        return <Inventory />;
      case "daily":
        return <DailySales />;
      case "monthly":
        return <MonthlySales />;
      case "bills":
        return <PendingBills />;
      case "services":
        return <ServiceSales />;
      default:
        return <Inventory />;
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        className="bg-dark text-light p-3 d-flex flex-column align-items-center align-items-md-start"
        style={{ minWidth: "60px", width: "200px" }}
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
              active === "monthly" ? "bg-secondary" : ""
            }`}
            onClick={() => setActive("monthly")}
            title="Monthly Sales"
          >
            <FaCalendarAlt className="me-2" />
            <span className="d-none d-md-inline">Monthly Sales</span>
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
      <div className="flex-grow-1 bg-light">
        {/* Top Bar */}
        <div
          className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm sticky-top"
          style={{ zIndex: 100 }}
        >
          <div className="input-group" style={{ maxWidth: "300px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
            />
            <button className="btn btn-outline-secondary">
              <FaSearch />
            </button>
          </div>
          <button className="btn btn-primary">
            <FaPlus className="me-2" />
            <span>New Sale</span>
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;
