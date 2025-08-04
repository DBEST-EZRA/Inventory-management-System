import React, { useEffect, useState } from "react";
import {
  Form,
  Table,
  Badge,
  Button,
  Collapse,
  InputGroup,
} from "react-bootstrap";
import { db } from "./Config";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const ServiceSales = () => {
  const [services, setServices] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form fields
  const [serviceType, setServiceType] = useState("");
  const [charges, setCharges] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [status, setStatus] = useState("Paid");
  const [date, setDate] = useState("");

  // Fetch data live from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "services"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setServices(data);
    });

    return () => unsubscribe();
  }, []);

  const clearForm = () => {
    setServiceType("");
    setCharges("");
    setPaymentMethod("");
    setStatus("Paid");
    setDate("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceType || !charges || !paymentMethod || !status || !date) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (editingId) {
        // Update existing record
        await updateDoc(doc(db, "services", editingId), {
          ServiceType: serviceType,
          Charges: Number(charges),
          PaymentMethod: paymentMethod,
          Status: status,
          Date: new Date(date),
        });
        alert("Service sale updated successfully!");
      } else {
        // Add new record
        await addDoc(collection(db, "services"), {
          ServiceType: serviceType,
          Charges: Number(charges),
          PaymentMethod: paymentMethod,
          Status: status,
          Date: new Date(date),
          createdAt: serverTimestamp(),
        });
        alert("Service sale recorded successfully!");
      }

      clearForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error saving service sale:", err);
    }
  };

  const handleEdit = (srv) => {
    setEditingId(srv.id);
    setServiceType(srv.ServiceType);
    setCharges(srv.Charges);
    setPaymentMethod(srv.PaymentMethod);
    setStatus(srv.Status);
    setDate(
      srv.Date?.toDate
        ? srv.Date.toDate().toISOString().split("T")[0]
        : srv.Date
    );
    setShowForm(true);
  };

  // Filtering by date & search
  const filtered = services
    .filter((srv) =>
      filterDate
        ? srv.Date?.toDate?.().toISOString().split("T")[0] === filterDate
        : true
    )
    .filter((srv) =>
      searchTerm
        ? srv.ServiceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          srv.PaymentMethod.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    );

  const total = filtered.reduce((sum, srv) => sum + srv.Charges, 0);

  return (
    <div className="container-fluid">
      {/* Header & filters */}
      <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
        <h4>Service Sales</h4>
        <div className="d-flex gap-3 flex-wrap">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search service or method..."
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
            {showForm ? "Hide Form" : "Add Service Sale"}
          </Button>
        </div>
      </div>

      {/* Collapsible Form */}
      <Collapse in={showForm}>
        <div className="card mb-4">
          <div className="card-body">
            <Form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <Form.Label>Service Type</Form.Label>
                  <Form.Control
                    type="text"
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <Form.Label>Charges (KES)</Form.Label>
                  <Form.Control
                    type="number"
                    value={charges}
                    onChange={(e) => setCharges(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Cash">Cash</option>
                    <option value="M-Pesa">M-Pesa</option>
                    <option value="Card">Card</option>
                  </Form.Select>
                </div>
                <div className="col-md-2">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                  >
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </Form.Select>
                </div>
                <div className="col-md-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mt-3">
                <Button type="submit" variant="primary">
                  {editingId ? "Update Sale" : "Add Sale"}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Collapse>

      {/* Sales Table */}
      <Table striped bordered responsive>
        <thead className="table-dark">
          <tr>
            <th>Service Type</th>
            <th>Charges (KES)</th>
            <th>Payment Method</th>
            <th>Date</th>
            <th>Payment Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((srv) => (
            <tr
              key={srv.id}
              className={
                srv.Status?.toLowerCase() === "unpaid" ? "table-warning" : ""
              }
            >
              <td>{srv.ServiceType}</td>
              <td>{srv.Charges}</td>
              <td>{srv.PaymentMethod}</td>
              <td>
                {srv.Date?.toDate
                  ? srv.Date.toDate().toISOString().split("T")[0]
                  : srv.Date}
              </td>
              <td>
                <Badge
                  bg={
                    srv.Status?.toLowerCase() === "paid" ? "success" : "danger"
                  }
                >
                  {srv.Status}
                </Badge>
              </td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleEdit(srv)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center text-muted">
                No records found.
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
              <td colSpan="5" className="fw-bold text-success">
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
