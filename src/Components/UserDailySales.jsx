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
import { Table, Form, Button } from "react-bootstrap"; // Added Button
import { db } from "./Config";
import { collection, onSnapshot } from "firebase/firestore";

const UserDailySales = () => {
  const [sales, setSales] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [filteredSales, setFilteredSales] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "sales"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().Date?.toDate
          ? doc.data().Date.toDate().toISOString().split("T")[0]
          : "",
      }));
      setSales(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = sales.filter((sale) => sale.date === selectedDate);
    setFilteredSales(filtered);
  }, [selectedDate, sales]);

  const totalSales = filteredSales.reduce(
    (acc, sale) =>
      acc + Number(sale.SellingPrice || 0) * Number(sale.Quantity || 0),
    0
  );

  // Print Receipt Function
  const handlePrintReceipt = (sale) => {
    const printWindow = window.open("", "_blank", "width=300,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              font-family: monospace;
              width: 80mm;
              margin: 0;
              padding: 10px;
            }
            h2, h4 {
              text-align: center;
              margin: 0;
              padding: 2px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            td {
              padding: 4px 0;
            }
            .total {
              border-top: 1px dashed #000;
              margin-top: 5px;
              font-weight: bold;
            }
            .center {
              text-align: center;
            }
          </style>
        </head>
        <body>
          <h2>Etech Solutions</h2>
          <h4>Receipt</h4>
          <p class="center">${sale.date}</p>
          <table>
            <tr><td>Item:</td><td>${sale.ItemName}</td></tr>
            <tr><td>Desc:</td><td>${sale.Description || "-"}</td></tr>
            <tr><td>Price:</td><td>KES ${sale.SellingPrice}</td></tr>
            <tr><td>Qty:</td><td>${sale.Quantity}</td></tr>
            <tr><td>Status:</td><td>${sale.PaymentStatus}</td></tr>
            <tr><td>Method:</td><td>${sale.PaymentMethod}</td></tr>
            <tr class="total"><td>Total:</td><td>KES ${
              Number(sale.SellingPrice) * Number(sale.Quantity)
            }</td></tr>
          </table>
          <p class="center">Thank you for shopping!</p>
          <script>
            window.print();
            window.onafterprint = function() { window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="container-fluid">
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

      <Table responsive striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Selling Price</th>
            <th>Quantity</th>
            <th>Payment Status</th>
            <th>Payment Method</th>
            <th>Action</th> {/* New column */}
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
              <td>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handlePrintReceipt(sale)}
                >
                  Print Receipt
                </Button>
              </td>
            </tr>
          ))}
          {filteredSales.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                No sales data for this date.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="my-4 text-end">
        <h5>
          Total Sales: <strong>KES {totalSales.toLocaleString()}</strong>
        </h5>
      </div>

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

export default UserDailySales;
