import React, { useEffect, useState } from "react";
import { db } from "./Config";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";

const AddItem = () => {
  const [showForm, setShowForm] = useState(false);
  const [item, setItem] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [inventory, setInventory] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch inventory items live
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInventory(items);
    });

    return () => unsubscribe();
  }, []);

  const clearForm = () => {
    setItem("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      if (editingId) {
        // Update
        await updateDoc(doc(db, "inventory", editingId), {
          item,
          description,
          price: Number(price),
          quantity: Number(quantity),
        });
        setMessage("Item updated successfully!");
      } else {
        // Add
        await addDoc(collection(db, "inventory"), {
          item,
          description,
          price: Number(price),
          quantity: Number(quantity),
        });
        setMessage("Item added successfully!");
      }

      clearForm();
    } catch (err) {
      console.error("Error saving item:", err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setItem(item.item);
    setDescription(item.description);
    setPrice(item.price);
    setQuantity(item.quantity);
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteDoc(doc(db, "inventory", id));
        setMessage("Item deleted successfully!");
      } catch (err) {
        console.error("Delete failed:", err);
        setError("Failed to delete item.");
      }
    }
  };

  return (
    <div className="container py-5">
      <h3 className="text-center mb-4">Inventory Management</h3>

      <div className="text-center mb-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) clearForm();
          }}
        >
          {showForm ? "Hide Form" : "Add New Item"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            {message && (
              <div className="alert alert-success text-center">{message}</div>
            )}
            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Item</label>
                <input
                  type="text"
                  className="form-control"
                  value={item}
                  required
                  onChange={(e) => setItem(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  required
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={quantity}
                  required
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary w-100"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? editingId
                    ? "Updating..."
                    : "Adding..."
                  : editingId
                  ? "Update Item"
                  : "Add Item"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">All Inventory Items</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No items found.
                    </td>
                  </tr>
                ) : (
                  inventory.map((inv) => (
                    <tr key={inv.id}>
                      <td>{inv.item}</td>
                      <td>{inv.description}</td>
                      <td>KES {inv.price.toLocaleString()}</td>
                      <td>{inv.quantity}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => handleEdit(inv)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(inv.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
