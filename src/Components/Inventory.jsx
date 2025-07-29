// src/components/Inventory.jsx
import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const dummyData = [
  {
    id: 1,
    item: "Laptop",
    description: "Dell XPS 13",
    price: 1200,
    quantity: 3,
  },
  {
    id: 2,
    item: "Monitor",
    description: "24 inch LED",
    price: 300,
    quantity: 10,
  },
  {
    id: 3,
    item: "Mouse",
    description: "Wireless Mouse",
    price: 25,
    quantity: 2,
  },
];

const Inventory = () => {
  const [inventory] = useState(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    quantity: "",
    sellingPrice: "",
    paymentMethod: "",
    paymentStatus: "Paid",
  });

  const openModal = (item) => {
    setSelectedItem(item);
    setFormData({
      quantity: "",
      sellingPrice: "",
      paymentMethod: "",
      paymentStatus: "Paid",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSell = (e) => {
    e.preventDefault();
    console.log("Selling item:", {
      ...selectedItem,
      ...formData,
    });
    setShowModal(false);
  };

  return (
    <div className="container-fluid mt-4">
      <h3>Inventory</h3>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Item</th>
              <th>Description</th>
              <th>Price (Ksh)</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.item}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>
                  {item.quantity < 5 ? (
                    <span className="badge bg-danger">Low Stock</span>
                  ) : (
                    <span className="badge bg-success">In Stock</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => openModal(item)}
                  >
                    Sell
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Sell Item</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSell}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedItem?.item || ""}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={selectedItem?.description || ""}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                required
                value={formData.quantity}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Selling Price (Ksh)</Form.Label>
              <Form.Control
                type="number"
                name="sellingPrice"
                required
                value={formData.sellingPrice}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment Method</Form.Label>
              <Form.Control
                type="text"
                name="paymentMethod"
                required
                placeholder="e.g. Cash, MPESA"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Payment Status</Form.Label>
              <Form.Select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleInputChange}
              >
                <option>Paid</option>
                <option>Unpaid</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Sale
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Inventory;
