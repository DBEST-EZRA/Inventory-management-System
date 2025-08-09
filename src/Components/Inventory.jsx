// src/components/Inventory.jsx
import React, { useEffect, useState } from "react";
import { Button, Modal, Form, InputGroup } from "react-bootstrap";
import { db, auth } from "./Config";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import * as XLSX from "xlsx";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    quantity: "",
    sellingPrice: "",
    paymentMethod: "",
    paymentStatus: "Paid",
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("");

  // Fetch inventory live
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventory(data);
    });
    return () => unsubscribe();
  }, []);

  // Fetch username for logged-in user
  useEffect(() => {
    const fetchUsername = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUsername(querySnapshot.docs[0].data().username || "");
      }
    };
    fetchUsername();
  }, []);

  // Open modal
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

  // Handle input
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle selling
  const handleSell = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    const qtyToSell = Number(formData.quantity);
    const availableQty = selectedItem.quantity;

    if (qtyToSell <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }
    if (qtyToSell > availableQty) {
      alert("Quantity entered exceeds available stock.");
      return;
    }

    setLoading(true);

    try {
      // 1. Add to sales collection
      await addDoc(collection(db, "sales"), {
        ItemName: selectedItem.item,
        Description: selectedItem.description,
        Quantity: qtyToSell,
        SellingPrice: Number(formData.sellingPrice),
        PaymentMethod: formData.paymentMethod,
        PaymentStatus: formData.paymentStatus,
        SoldBy: username, // ✅ NEW FIELD
        Date: new Date(),
        createdAt: serverTimestamp(),
      });

      // 2. Update inventory quantity
      const newQty = availableQty - qtyToSell;
      await updateDoc(doc(db, "inventory", selectedItem.id), {
        quantity: newQty,
      });

      alert("Sale recorded successfully!");
      setShowModal(false);
    } catch (err) {
      console.error("Error posting sale:", err);
      alert("Error posting sale. Please try again.");
    }

    setLoading(false);
  };

  // Export to Excel
  const exportToExcel = () => {
    const filteredData = filteredInventory.map((item) => ({
      Item: item.item,
      Description: item.description,
      Price: item.price,
      Quantity: item.quantity,
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");
    XLSX.writeFile(workbook, "Inventory.xlsx");
  };

  // Filter by search
  const filteredInventory = inventory.filter(
    (item) =>
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid mt-4">
      <h3>Inventory</h3>

      {/* Search & Export */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <InputGroup style={{ maxWidth: "300px" }}>
          <Form.Control
            type="text"
            placeholder="Search item or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        <Button variant="success" onClick={exportToExcel}>
          Export to Excel
        </Button>
      </div>

      {/* Inventory Table */}
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
            {filteredInventory.map((item) => (
              <tr key={item.id}>
                <td>{item.item}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>
                  {item.quantity < 2 ? (
                    <span className="badge bg-danger">Low Stock</span>
                  ) : (
                    <span className="badge bg-success">In Stock</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => openModal(item)}
                    disabled={item.quantity === 0}
                  >
                    Sell
                  </button>
                </td>
              </tr>
            ))}
            {filteredInventory.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No items found.
                </td>
              </tr>
            )}
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
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Posting sale..." : "Confirm Sale"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Inventory;
