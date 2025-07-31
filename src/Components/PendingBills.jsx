import React, { useState } from "react";
import { Button, Form, Table } from "react-bootstrap";

const sampleBills = [
  {
    id: 1,
    patient: "John Doe",
    service: "50 Key Holders",
    amount: 1500,
    date: "2025-07-15",
    status: "unpaid",
  },
  {
    id: 2,
    patient: "Jane Smith",
    service: "2 CCTV Cameras",
    amount: 2000,
    date: "2025-07-28",
    status: "paid",
  },
  {
    id: 3,
    patient: "Samuel K.",
    service: "64GB FlashDisk",
    amount: 500,
    date: "2025-07-28",
    status: "unpaid",
  },
];

const PendingBills = () => {
  const [bills, setBills] = useState(sampleBills);
  const [filterDate, setFilterDate] = useState("");

  const filteredBills = filterDate
    ? bills.filter((bill) => bill.date === filterDate)
    : bills;

  const handleMarkAsPaid = (id) => {
    const updatedBills = bills.map((bill) =>
      bill.id === id ? { ...bill, status: "paid" } : bill
    );
    setBills(updatedBills);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <h4>Pending Bills</h4>
        <Form.Group className="mb-0 d-flex align-items-center gap-2">
          <Form.Label className="mb-0">Filter by Date:</Form.Label>
          <Form.Control
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </Form.Group>
      </div>

      <Table striped bordered responsive>
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Service</th>
            <th>Amount (KES)</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBills.map((bill) => (
            <tr
              key={bill.id}
              className={bill.status === "unpaid" ? "table-warning" : ""}
            >
              <td>{bill.patient}</td>
              <td>{bill.service}</td>
              <td>{bill.amount}</td>
              <td>{bill.date}</td>
              <td>
                <span
                  className={`badge ${
                    bill.status === "paid" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {bill.status}
                </span>
              </td>
              <td>
                {bill.status === "unpaid" && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleMarkAsPaid(bill.id)}
                  >
                    Mark as Paid
                  </Button>
                )}
              </td>
            </tr>
          ))}
          {filteredBills.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No pending bills found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default PendingBills;
