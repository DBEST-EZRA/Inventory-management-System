import React, { useEffect, useState } from "react";
import { Button, Form, Table, Collapse, InputGroup } from "react-bootstrap";
import { db } from "./Config";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const PendingBills = () => {
  const [bills, setBills] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    service: "",
    amount: "",
    status: "unpaid",
    date: "",
  });

  // Fetch live data
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "pendingbills"),
      (snapshot) => {
        let data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort unpaid first
        data.sort((a, b) =>
          a.status === "unpaid" && b.status === "paid" ? -1 : 1
        );

        setBills(data);
      }
    );

    return () => unsubscribe();
  }, []);

  const clearForm = () => {
    setFormData({
      name: "",
      service: "",
      amount: "",
      status: "unpaid",
      date: "",
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, service, amount, status, date } = formData;

    if (!name || !service || !amount || !date) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "pendingbills", editingId), {
          name,
          service,
          amount: Number(amount),
          status,
          date: new Date(date),
        });
        alert("Bill updated successfully!");
      } else {
        await addDoc(collection(db, "pendingbills"), {
          name,
          service,
          amount: Number(amount),
          status,
          date: new Date(date),
          createdAt: serverTimestamp(),
        });
        alert("Bill added successfully!");
      }
      clearForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving bill:", err);
    }
  };

  const handleEdit = (bill) => {
    setEditingId(bill.id);
    setFormData({
      name: bill.name,
      service: bill.service,
      amount: bill.amount,
      status: bill.status,
      date: bill.date?.toDate
        ? bill.date.toDate().toISOString().split("T")[0]
        : bill.date,
    });
    setShowForm(true);
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await updateDoc(doc(db, "pendingbills", id), { status: "paid" });
      alert("Marked as paid!");
    } catch (err) {
      console.error("Error marking as paid:", err);
    }
  };

  //NEWWW
  const handleGenerateInvoice = (bill) => {
    const invoiceWindow = window.open("", "_blank", "width=800,height=1000");
    invoiceWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${bill.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              width: 210mm;
              padding: 20px;
              box-sizing: border-box;
            }
            h1 {
              text-align: center;
              margin-bottom: 5px;
            }
            h3 {
              text-align: center;
              margin-top: 0;
              color: #555;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              padding: 10px;
              border: 1px solid #ccc;
              text-align: left;
            }
            .footer {
              margin-top: 40px;
              font-size: 14px;
              text-align: center;
            }
            .total {
              font-weight: bold;
              background: #f5f5f5;
            }
          </style>
        </head>
        <body>
          <h1>Etech Solutions</h1>
          <h3>Invoice</h3>
          <p><strong>Date Issued:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Billed To:</strong> ${bill.name}</p>
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Amount (KES)</th>
                <th>Bill Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${bill.service}</td>
                <td>${bill.amount}</td>
                <td>${
                  bill.date?.toDate
                    ? bill.date.toDate().toISOString().split("T")[0]
                    : bill.date
                }</td>
                <td>${bill.status}</td>
              </tr>
              <tr class="total">
                <td colspan="3">Total</td>
                <td>KES ${bill.amount}</td>
              </tr>
            </tbody>
          </table>
          <div class="footer">
            <p><strong>Payment Upon Receipt</strong></p>
            <p>Payment Method: M-Pesa Paybill 123456, Account: Your Name</p>
            <p>Thank you for your business!</p>
          </div>
          <script>
            window.print();
            window.onafterprint = function() { window.close(); }
          </script>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
  };

  //END OF NEWWW

  // Filter & search
  const filteredBills = bills
    .filter((bill) =>
      filterDate
        ? bill.date?.toDate?.().toISOString().split("T")[0] === filterDate
        : true
    )
    .filter((bill) =>
      searchTerm
        ? bill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bill.service.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <h4>Pending Bills</h4>
        <div className="d-flex gap-3 flex-wrap">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search by name or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <Form.Group className="mb-0 d-flex align-items-center gap-2">
            <Form.Label className="mb-0">Filter by Date:</Form.Label>
            <Form.Control
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="outline-primary"
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) clearForm();
            }}
          >
            {showForm ? "Hide Form" : "Add Bill"}
          </Button>
        </div>
      </div>

      {/* Collapsible Form */}
      <Collapse in={showForm}>
        <div className="card mb-4">
          <div className="card-body">
            <Form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <Form.Label>Service</Form.Label>
                  <Form.Control
                    type="text"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <Form.Label>Amount (KES)</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                  </Form.Select>
                </div>
                <div className="col-md-2">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mt-3">
                <Button type="submit" variant="primary">
                  {editingId ? "Update Bill" : "Add Bill"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Collapse>

      {/* Table */}
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
              <td>{bill.name}</td>
              <td>{bill.service}</td>
              <td>{bill.amount}</td>
              <td>
                {bill.date?.toDate
                  ? bill.date.toDate().toISOString().split("T")[0]
                  : bill.date}
              </td>
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
                {bill.status === "unpaid" ? (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleMarkAsPaid(bill.id)}
                    >
                      Mark as Paid
                    </Button>{" "}
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleGenerateInvoice(bill)}
                    >
                      Generate Invoice
                    </Button>{" "}
                  </>
                ) : (
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(bill)}
                  >
                    Edit
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
