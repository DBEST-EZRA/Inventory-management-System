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
import { db } from "./Config";
import { collection, onSnapshot } from "firebase/firestore";

const DailySales = () => {
  const [sales, setSales] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filteredSales, setFilteredSales] = useState([]);

  // Fetch sales live from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "sales"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().Date?.toDate
          ? doc.data().Date.toDate().toISOString().split("T")[0]
          : "", // Convert Firestore Timestamp to YYYY-MM-DD
      }));
      setSales(data);
    });

    return () => unsubscribe();
  }, []);

  // Filter sales by selected date
  useEffect(() => {
    const filtered = sales.filter((sale) => sale.date === selectedDate);
    setFilteredSales(filtered);
  }, [selectedDate, sales]);

  // Calculate total sales amount
  const totalSales = filteredSales.reduce(
    (acc, sale) =>
      acc + Number(sale.SellingPrice || 0) * Number(sale.Quantity || 0),
    0
  );

  return (
    <div className="container-fluid">
      {/* Header + Date Filter */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
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

      {/* Sales Table */}
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
              <td>{sale.ItemName}</td>
              <td>{sale.Description}</td>
              <td>KES {sale.SellingPrice}</td>
              <td>{sale.Quantity}</td>
              <td>
                <span
                  className={`badge ${
                    sale.PaymentStatus === "Paid" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {sale.PaymentStatus}
                </span>
              </td>
              <td>{sale.PaymentMethod}</td>
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

      {/* Total Sales */}
      <div className="my-4 text-end">
        <h5>
          Total Sales: <strong>KES {totalSales.toLocaleString()}</strong>
        </h5>
      </div>

      {/* Chart Section */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={filteredSales.map((sale) => ({
              name: sale.ItemName,
              total:
                Number(sale.SellingPrice || 0) * Number(sale.Quantity || 0),
            }))}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#3c51a1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DailySales;
