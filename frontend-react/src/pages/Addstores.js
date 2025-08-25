import React, { useState, useEffect } from "react";
import axios from "axios";

const AddStoreForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  });

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/users");
        
        setUsers(res.data.filter(u => u.role !== "admin"));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.owner_id) {
      setMessage("Store Name, Email, and Owner are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/Addstore", formData);
      if (res.data.success) {
        setMessage("Store added successfully!");
        setFormData({ name: "", email: "", address: "", owner_id: "" });
      } else {
        setMessage(res.data.message || "Failed to add store");
      }
    } catch (err) {
      console.error("Error adding store:", err);
      setMessage("Failed to add store");
    }
  };

  return (
    <div className="ui container" style={{ marginTop: "2em", maxWidth: "600px" }}>
      <h2 className="ui header center aligned">Add Store</h2>
      {message && <div className="ui message">{message}</div>}
      <form className="ui form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Store Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter store name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter store email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Enter store address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label>Store Owner</label>
          <select
            name="owner_id"
            value={formData.owner_id}
            onChange={handleChange}
            className="ui dropdown"
            required
          >
            <option value="">Select Owner</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="ui primary button">
          Add Store
        </button>
      </form>
    </div>
  );
};

export default AddStoreForm;
