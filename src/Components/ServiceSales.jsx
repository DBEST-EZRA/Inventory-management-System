import React, { useState } from "react";
import { Form, Table, Badge } from "react-bootstrap";

const sampleServices = [
  {
    id: 1,
    type: "Mouse Pad",
    charges: 500,
    method: "Cash",
    date: "2025-07-29",
    status: "paid",
  },
  {
    id: 2,
    type: "Monitor",
    charges: 3000,
    method: "M-Pesa",
    date: "2025-07-29",
    status: "unpaid",
  },
  {
    id: 3,
    type: "Kyocera PrintHead",
    charges: 2500,
    method: "Card",
    date: "2025-07-27",
    status: "paid",
  },
];

const ServiceSales = () => {
  const [services] = useState(sampleServices);
  const [filterDate, setFilterDate] = useState("");

  const filtered = filterDate
    ? services.filter((srv) => srv.date === filterDate)
    : services;

  const total = filtered.reduce((sum, srv) => sum + srv.charges, 0);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <h4>Service Sales</h4>
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
            <th>Service Type</th>
            <th>Charges (KES)</th>
            <th>Payment Method</th>
            <th>Date</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((srv) => (
            <tr
              key={srv.id}
              className={srv.status === "unpaid" ? "table-warning" : ""}
            >
              <td>{srv.type}</td>
              <td>{srv.charges}</td>
              <td>{srv.method}</td>
              <td>{srv.date}</td>
              <td>
                <Badge bg={srv.status === "paid" ? "success" : "danger"}>
                  {srv.status}
                </Badge>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No records found for the selected date.
              </td>
            </tr>
          )}
        </tbody>
        {filtered.length > 0 && (
          <tfoot>
            <tr className="table-secondary">
              <td colSpan="1" className="fw-bold">
                Total Sales:
              </td>
              <td colSpan="4" className="fw-bold text-success">
                KES {total.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        )}
      </Table>
    </div>
  );
};

export default ServiceSales;
