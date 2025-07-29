import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Table, Form } from "react-bootstrap";

const sampleSales = [
  {
    id: 1,
    item: "Item A",
    description: "Description A",
    price: 100,
    quantity: 2,
    paymentStatus: "Paid",
    paymentMethod: "Mpesa",
    date: "2025-07-29",
  },
  {
    id: 2,
    item: "Item B",
    description: "Description B",
    price: 150,
    quantity: 1,
    paymentStatus: "Unpaid",
    paymentMethod: "Cash",
    date: "2025-07-29",
  },
  {
    id: 3,
    item: "Item C",
    description: "Description C",
    price: 200,
    quantity: 1,
    paymentStatus: "Paid",
    paymentMethod: "Card",
    date: "2025-07-28",
  },
];

const DailySales = () => {
  const [sales, setSales] = useState(sampleSales);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filteredSales, setFilteredSales] = useState([]);

  useEffect(() => {
    const filtered = sales.filter((sale) => sale.date === selectedDate);
    setFilteredSales(filtered);
  }, [selectedDate, sales]);

  const totalSales = filteredSales.reduce(
    (acc, sale) => acc + sale.price * sale.quantity,
    0
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Daily Sales</h4>
        <Form.Group
          controlId="filterDate"
          className="d-flex align-items-center"
        >
          <Form.Label className="me-2 mb-0">Select Date:</Form.Label>
          <Form.Control
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </Form.Group>
      </div>

      <Table responsive striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Selling Price</th>
            <th>Quantity</th>
            <th>Payment Status</th>
            <th>Payment Method</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.item}</td>
              <td>{sale.description}</td>
              <td>KES {sale.price}</td>
              <td>{sale.quantity}</td>
              <td>
                <span
                  className={`badge ${
                    sale.paymentStatus === "Paid" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {sale.paymentStatus}
                </span>
              </td>
              <td>{sale.paymentMethod}</td>
            </tr>
          ))}
          {filteredSales.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                No sales data for this date.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="my-4 text-end">
        <h5>
          Total Sales: <strong>KES {totalSales}</strong>
        </h5>
      </div>

      {/* Chart Section */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={filteredSales}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="item" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey={(entry) => entry.price * entry.quantity}
              fill="#3c51a1"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailySales;
