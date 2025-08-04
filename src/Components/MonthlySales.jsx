import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Form, Button, Table } from "react-bootstrap";
import { db } from "./Config";
import { collection, onSnapshot } from "firebase/firestore";
import * as XLSX from "xlsx";

const MonthlySales = () => {
  const [sales, setSales] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [filteredSales, setFilteredSales] = useState([]);

  // Fetch sales data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "sales"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const sale = doc.data();
        const dateStr = sale.Date?.toDate
          ? sale.Date.toDate().toISOString().split("T")[0]
          : "";
        return {
          id: doc.id,
          date: dateStr,
          ItemName: sale.ItemName || "",
          Description: sale.Description || "",
          SellingPrice: Number(sale.SellingPrice || 0),
          Quantity: Number(sale.Quantity || 0),
        };
      });
      setSales(data);
    });

    return () => unsubscribe();
  }, []);

  // Filter and group by date
  useEffect(() => {
    const filtered = sales.filter((sale) =>
      sale.date.startsWith(selectedMonth)
    );

    // Group by day and sum totals
    const dailyMap = {};
    filtered.forEach((sale) => {
      if (!dailyMap[sale.date]) dailyMap[sale.date] = 0;
      dailyMap[sale.date] += sale.SellingPrice * sale.Quantity;
    });

    // Convert to array for chart & table
    const dailyArray = Object.keys(dailyMap)
      .sort()
      .map((day) => ({
        date: day,
        total: dailyMap[day],
      }));

    setFilteredSales(dailyArray);
  }, [selectedMonth, sales]);

  const totalMonthlySales = filteredSales.reduce(
    (sum, sale) => sum + sale.total,
    0
  );

  // Export to Excel
  const generateReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Sales");
    XLSX.writeFile(workbook, `Monthly_Sales_${selectedMonth}.xlsx`);
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <h4>Monthly Sales</h4>
        <div className="d-flex align-items-center gap-3">
          <Form.Group className="mb-0">
            <Form.Label className="me-2 mb-0">Select Month:</Form.Label>
            <Form.Control
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" onClick={generateReport}>
            Generate Report
          </Button>
        </div>
      </div>

      {/* Total Sales */}
      <div className="mb-4">
        <h5>
          Total Sales for {selectedMonth}:{" "}
          <strong>KES {totalMonthlySales.toLocaleString()}</strong>
        </h5>
      </div>

      {/* Line Chart */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={filteredSales}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#88c244"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Sales Table */}
      <Table striped bordered responsive className="mt-4">
        <thead className="table-dark">
          <tr>
            <th>Date</th>
            <th>Total Sales (KES)</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale.date}>
              <td>{sale.date}</td>
              <td>{sale.total.toLocaleString()}</td>
            </tr>
          ))}
          {filteredSales.length === 0 && (
            <tr>
              <td colSpan="2" className="text-center text-muted">
                No sales data found for this month.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default MonthlySales;
