import { useEffect, useState } from "react";
import axios from "axios";

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({ name: "", location: "", capacity: "" });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/warehouse", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWarehouses(res.data);
    } catch (error) {
      console.error("Error fetching warehouses", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddWarehouse = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/warehouse", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ name: "", location: "", capacity: "" });
      fetchWarehouses(); // Refresh list
    } catch (error) {
      console.error("Error adding warehouse", error);
    }
  };

  const handleDeleteWarehouse = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/warehouse/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWarehouses(); // Refresh list
    } catch (error) {
      console.error("Error deleting warehouse", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Manage Warehouses</h2>

      {/* Add Warehouse Form */}
      <form onSubmit={handleAddWarehouse} className="mb-6 space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Warehouse Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={formData.capacity}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md">
          Add Warehouse
        </button>
      </form>

      {/* Warehouse List */}
      <h3 className="text-xl font-semibold mb-3">Your Warehouses</h3>
      {warehouses.length === 0 ? (
        <p>No warehouses found.</p>
      ) : (
        <ul className="space-y-3">
          {warehouses.map((warehouse) => (
            <li
              key={warehouse._id}
              className="border p-3 rounded-md flex justify-between items-center"
            >
              <div>
                <strong>{warehouse.name}</strong> - {warehouse.location} (Capacity: {warehouse.capacity})
              </div>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded-md"
                onClick={() => handleDeleteWarehouse(warehouse._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Warehouse;
