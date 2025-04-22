import { useEffect, useState } from "react";
import axios from "axios";

// Use Vite environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    warehouseId: "",
    productName: "",
    sku: "",
    quantity: "",
    price: "",
    category: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [priceUpdates, setPriceUpdates] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchInventory();
    fetchWarehouses();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/inventory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInventory(res.data);
    } catch (error) {
      console.error("Error fetching inventory", error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/warehouse`, {
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE_URL}/api/inventory`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        warehouseId: "",
        productName: "",
        sku: "",
        quantity: "",
        price: "",
        category: "",
      });
      setIsOpen(false);
      fetchInventory();
    } catch (error) {
      console.error("Error adding product", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && 
        formData.warehouseId && 
        formData.productName && 
        formData.sku && 
        formData.quantity && 
        formData.price && 
        formData.category) {
      handleAddProduct(e);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/inventory/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchInventory();
    } catch (error) {
      console.error("Error deleting product", error);
    }
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/inventory/${id}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInventory();
    } catch (error) {
      console.error("Error updating quantity", error);
    }
  };

  const handlePriceChange = (id, value) => {
    setPriceUpdates((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdatePrice = async (id) => {
    const newPrice = priceUpdates[id];
    if (!newPrice || isNaN(newPrice)) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE_URL}/api/inventory/${id}/price`,
        { price: parseFloat(newPrice) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInventory();
      setPriceUpdates((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      console.error("Error updating price", error);
    }
  };

  const groupedInventory = warehouses.map((warehouse) => ({
    ...warehouse,
    items: inventory.filter((item) => item.warehouseId === warehouse._id),
  }));

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Manage Inventory</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          {isOpen ? "Cancel" : "Add Inventory"}
        </button>
      </div>

      {isOpen && (
        <form 
          onSubmit={handleAddProduct} 
          className="mb-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md space-y-4"
          onKeyDown={handleKeyDown}
        >
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Add New Product</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Warehouse
              </label>
              <select
                name="warehouseId"
                value={formData.warehouseId}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              >
                <option value="">Select Warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse._id} value={warehouse._id}>
                    {warehouse.name} - {warehouse.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                placeholder="Product Name"
                value={formData.productName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                placeholder="SKU"
                value={formData.sku}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>
        </form>
      )}

      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Inventory by Warehouse</h3>

      {groupedInventory.length === 0 ? (
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow text-center">
          <p className="text-gray-600 dark:text-gray-400">No warehouses found.</p>
        </div>
      ) : (
        groupedInventory.map((warehouse) => (
          <div key={warehouse._id} className="mb-8">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-t-lg shadow">
              <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                {warehouse.name} ({warehouse.location})
              </h4>
            </div>
            
            {warehouse.items.length === 0 ? (
              <div className="p-4 bg-white dark:bg-gray-700 rounded-b-lg shadow">
                <p className="text-gray-500 dark:text-gray-400">No products in this warehouse.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {warehouse.items.map((item) => (
                  <li
                    key={item._id}
                    className="border p-4 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-lg text-gray-800 dark:text-white">{item.productName}</strong>
                          <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          SKU: {item.sku} | Stock: {item.quantity} pcs | Price: ₹{item.price.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center gap-1"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        >
                          <span>+1</span>
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center gap-1"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        >
                          <span>-1</span>
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            placeholder="New Price"
                            value={priceUpdates[item._id] || ""}
                            onChange={(e) => handlePriceChange(item._id, e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-24 p-1 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition"
                          />
                          <button
                            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors duration-200"
                            onClick={() => handleUpdatePrice(item._id)}
                          >
                            Update
                          </button>
                        </div>
                        
                        <button
                          className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => handleDeleteProduct(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Inventory;