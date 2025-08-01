import React, { useState } from "react";
import {
  FaBoxes,
  FaCalendarDay,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaConciergeBell,
  FaSearch,
  FaPlus,
  FaUserPlus,
  FaCartPlus,
} from "react-icons/fa";
import Inventory from "./Inventory";
import DailySales from "./DailySales";
import MonthlySales from "./MonthlySales";
import PendingBills from "./PendingBills";
import ServiceSales from "./ServiceSales";
import AddItem from "./AddItem"; // new component
import AddUser from "./AddUser"; // new component

const AdminDashboard = () => {
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
      case "add-item":
        return <AddItem />;
      case "add-user":
        return <AddUser />;
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
          {[
            { key: "inventory", icon: <FaBoxes />, label: "Inventory" },
            { key: "daily", icon: <FaCalendarDay />, label: "Daily Sales" },
            { key: "monthly", icon: <FaCalendarAlt />, label: "Monthly Sales" },
            {
              key: "bills",
              icon: <FaFileInvoiceDollar />,
              label: "Pending Bills",
            },
            {
              key: "services",
              icon: <FaConciergeBell />,
              label: "Service Sales",
            },
            { key: "add-item", icon: <FaCartPlus />, label: "Add Items" },
            { key: "add-user", icon: <FaUserPlus />, label: "Add Users" },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              className={`btn text-start text-light mb-2 w-100 ${
                active === key ? "bg-secondary" : ""
              }`}
              onClick={() => setActive(key)}
              title={label}
            >
              {icon}
              <span className="ms-2 d-none d-md-inline">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Panel */}
      <div
        className="d-flex flex-column flex-grow-1 bg-light"
        style={{ overflow: "hidden" }}
      >
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

        {/* Scrollable Content */}
        <div
          className="p-4"
          style={{ overflowY: "auto", flexGrow: 1, minHeight: 0 }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
