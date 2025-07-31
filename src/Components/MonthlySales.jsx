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
import { Form, Button } from "react-bootstrap";

// Sample data - one entry per day
const sampleSales = [
  { date: "2025-07-01", total: 300 },
  { date: "2025-07-02", total: 500 },
  { date: "2025-07-03", total: 200 },
  { date: "2025-07-04", total: 450 },
  { date: "2025-07-10", total: 350 },
  { date: "2025-07-20", total: 600 },
  { date: "2025-06-01", total: 150 },
];

const MonthlySales = () => {
  const [sales, setSales] = useState(sampleSales);
  const [selectedMonth, setSelectedMonth] = useState("2025-07");
  const [filteredSales, setFilteredSales] = useState([]);

  useEffect(() => {
    const filtered = sales.filter((sale) =>
      sale.date.startsWith(selectedMonth)
    );
    setFilteredSales(filtered);
  }, [selectedMonth, sales]);

  const totalMonthlySales = filteredSales.reduce(
    (sum, sale) => sum + sale.total,
    0
  );

  return (
    <div className="container-fluid">
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
          <Button variant="primary">Generate Report</Button>
        </div>
      </div>

      <div className="mb-4">
        <h5>
          Total Sales for {selectedMonth}:{" "}
          <strong>KES {totalMonthlySales}</strong>
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

      {filteredSales.length === 0 && (
        <p className="text-muted mt-3">No sales data found for this month.</p>
      )}
    </div>
  );
};

export default MonthlySales;
